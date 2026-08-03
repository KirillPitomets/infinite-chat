# Avatar Upload — Frontend Integration Guide

## TL;DR

This is a **direct upload** (presigned) pattern — the file goes straight from the
browser to Cloudinary, bypassing our backend. Our API only handles steps 1 and 3;
step 2 is an external API call (Cloudinary), not one of our endpoints — don't look
for it in our backend's Swagger.

## Three steps

| #   | Caller   | Target                                                                                                  | What it does                                  |
| --- | -------- | ------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| 1   | Frontend | `POST /groups/:id/avatar/presign` (our backend, see Swagger)                                            | Gets a signature + credentials for the upload |
| 2   | Frontend | `POST https://api.cloudinary.com/v1_1/{cloudName}/image/upload` (**external Cloudinary API**, not ours) | Uploads the file directly                     |
| 3   | Frontend | `PATCH /groups/:id` (our backend, see Swagger)                                                          | Saves the resulting URL to the DB             |

## Step 1 — presign (our API)

See Swagger: `POST /groups/:id/avatar/presign`. Requires authorization (Bearer token);
the caller must be a group admin.

The response contains everything needed for step 2. Don't hardcode any of it on the
frontend (neither `cloudName` nor `apiKey`) — always take it from this endpoint's
response, since it can change per environment (dev/staging/prod use different
Cloudinary accounts).

## Step 2 — upload to Cloudinary (external API)

Official Cloudinary docs: https://cloudinary.com/documentation/upload_images#unsigned_upload

Minimal example:

```typescript
async function uploadToCloudinary(
  file: File,
  presignData: {
    signature: string;
    timestamp: number;
    folder: string;
    publicId: string;
    apiKey: string;
    cloudName: string;
  },
) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', presignData.apiKey);
  formData.append('timestamp', String(presignData.timestamp));
  formData.append('signature', presignData.signature);
  formData.append('folder', presignData.folder);
  formData.append('public_id', presignData.publicId);
  formData.append('overwrite', 'true');

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${presignData.cloudName}/image/upload`,
    { method: 'POST', body: formData },
  );

  if (!res.ok) {
    throw new Error('Cloudinary upload failed');
  }

  return res.json(); // contains secure_url, public_id
}
```

**Important**: any field added to `formData` (other than `file`, `api_key`, `signature`)
must exactly match what the backend included when generating the signature in step 1.
If you add an extra field on the frontend (e.g. `tags`) that wasn't part of the presign
payload, Cloudinary will return `Invalid Signature`, because the signature was computed
without it.

## Step 3 — save (our API)

`PATCH /groups/:id`, body: `{ url: secure_url, publicId: public_id }`
(fields from step 2's response). See Swagger for the exact DTO shape.

## Full helper (entire flow)

```typescript
export async function uploadGroupAvatar(groupId: string, file: File) {
  const presignData = await fetch(`/api/groups/${groupId}/avatar/presign`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contentType: file.type }),
  }).then((r) => r.json());

  const uploadResult = await uploadToCloudinary(file, presignData);

  await fetch(`/api/groups/${groupId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      avatarUrl: uploadResult.secure_url,
      avatarPublicId: uploadResult.public_id,
    }),
  });

  return uploadResult.secure_url;
}
```
