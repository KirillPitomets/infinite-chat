# Sending Messages with Attachments

This guide describes the full client-side flow for sending a chat message that includes one or more file attachments (images, files, etc.).

## Overview

Attachments are **not** uploaded through the API server. Files go directly from the client to Cloudinary using short-lived signed parameters. The backend only ever sees file _metadata_ (URL, size, type) — never the binary content.

Flow in three steps:

1. **Presign** — request N signed upload slots from the API, one per file.
2. **Upload** — upload each file directly to Cloudinary using its signed slot.
3. **Send** — emit `message.send` over the `/messages` WebSocket namespace with the text and the metadata returned by Cloudinary for each uploaded file.

```
Client                     API                     Cloudinary
  |--- POST /attachments/presign?count=N --------->|
  |<---------------- N signed slots ----------------|
  |                                                  |
  |--- upload file 1 (slot 1) --------------------->|
  |<----------------- secure_url, bytes, ... --------|
  |--- upload file 2 (slot 2) --------------------->|
  |<----------------- secure_url, bytes, ... --------|
  |                                                  |
  |--- WS emit "message.send" { text, attachments } (to API)
```

## Step 1 — Request presigned slots

Call the presign endpoint **after** the user has picked their files, so `count` matches the real number of files (don't pre-request slots speculatively).

```
POST /attachments/presign?count=2
Authorization: Bearer <clerk_jwt>
```

`count` must be between 1 and 6.

Response — an array of signed slots, one per requested file, in order:

```json
[
  {
    "signature": "a1b2c3...",
    "timestamp": "1755000000",
    "publicId": "attachments/9c1f...uuid",
    "folder": "user/<userId>/<roomId>",
    "apiKey": "123456789012345",
    "cloudName": "your-cloud-name"
  },
  {
    "signature": "d4e5f6...",
    "timestamp": "1755000000",
    "publicId": "attachments/7a2e...uuid",
    "folder": "user/<userId>/<roomId>",
    "apiKey": "123456789012345",
    "cloudName": "your-cloud-name"
  }
]
```

Match `presigns[i]` to the `i`-th file the user selected — order matters, there's no other correlation between a slot and a file.

Each slot is single-use and expires (Cloudinary signed timestamps are valid for a limited window). Unused slots simply become invalid — no cleanup needed on your side.

## Step 2 — Upload each file directly to Cloudinary

For each file, `POST` a `multipart/form-data` request straight to Cloudinary, using the matching slot:

```
POST https://api.cloudinary.com/v1_1/<cloudName>/auto/upload
```

Form fields:

| field       | value            |
| ----------- | ---------------- |
| `file`      | the raw file     |
| `api_key`   | `slot.apiKey`    |
| `timestamp` | `slot.timestamp` |
| `signature` | `slot.signature` |
| `public_id` | `slot.publicId`  |
| `folder`    | `slot.folder`    |

```ts
async function uploadToCloudinary(file: File, slot: PresignedSlot) {
  const form = new FormData();
  form.append('file', file);
  form.append('api_key', slot.apiKey);
  form.append('timestamp', slot.timestamp);
  form.append('signature', slot.signature);
  form.append('public_id', slot.publicId);
  form.append('folder', slot.folder);
  form.append('overwrite', 'false');

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${slot.cloudName}/auto/upload`,
    { method: 'POST', body: form },
  );

  if (!res.ok) throw new Error('Upload failed');
  return res.json(); // { secure_url, bytes, public_id, ... }
}
```

Run uploads in parallel with `Promise.all` when there are multiple files.

Cloudinary's response gives you everything needed for the next step: `secure_url`, `bytes` (size), `public_id`, and the resource type/format.

## Step 3 — Send the message over WebSocket

Once every upload has resolved, emit `message.send` on the `/messages` namespace with the message text and an `attachments` array built from the Cloudinary responses.

```ts
socket.emit('message.send', {
  roomId,
  text: 'check this out',
  attachments: [
    {
      key: upload.public_id,
      name: file.name,
      url: upload.secure_url,
      size: upload.bytes,
      type: 'IMAGE', // map from file.type — see table below
    },
  ],
});
```

### `CreateMessageAttachmentDto` shape

| field  | type                    | notes                                           |
| ------ | ----------------------- | ----------------------------------------------- |
| `key`  | `string`                | Cloudinary `public_id` from the upload response |
| `name` | `string`                | original file name                              |
| `url`  | `string`                | Cloudinary `secure_url`                         |
| `size` | `number`                | bytes, integer                                  |
| `type` | `MessageAttachmentType` | see mapping below                               |

### Mapping file type → `MessageAttachmentType`

Map the MIME type (or file extension) on the client before sending:

| MIME prefix / extension | `type`  |
| ----------------------- | ------- |
| `image/*`               | `IMAGE` |
| `video/*`               | `VIDEO` |
| anything else           | `FILE`  |

### `text` vs `attachments`

A message must have **at least one** of `text` or `attachments` — sending both empty is rejected by the server (`400 Bad Request` equivalent over WS, delivered as a `WsException`). `text`, when present, must be 2–160 characters.

## Handling errors

Errors from `message.send` (validation, not a room member, room not found, etc.) come back as a `WsException`, forwarded to the client as an `exception`/`error` event on the socket — not as an HTTP status code. Listen for it before sending:

```ts
socket.on('exception', (payload) => {
  console.error(payload.error);
});
```

## Known limitations (MVP stage)

- **No server-side confirmation of uploads.** The server trusts the metadata the client reports after a Cloudinary upload (size, url, type). A Cloudinary webhook-based confirmation flow is a planned improvement, not yet implemented.
- **Orphaned files.** If a user uploads a file via a presigned slot but never sends the message, the file remains in Cloudinary with no matching `MessageAttachment` row. Cleanup is not yet automated.
