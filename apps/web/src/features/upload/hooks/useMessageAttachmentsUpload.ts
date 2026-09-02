import { unwrap } from "@/shared/lib/api/unwrap"
import { useApiClient } from "@/shared/lib/api/useApiClient"
import { uploadToCloudinary } from "@/shared/lib/upload/uploadToCloudinary"
import { CreateMessageAttachmentDto } from "@/shared/types/api.type"
import { CloudinaryUploadResponse } from "@/shared/types/cloudinary.type"
import { useCallback } from "react"

function defineResourceType(
  type: Pick<CloudinaryUploadResponse, "resource_type">
) {
  switch (type.resource_type) {
    case "image":
      return "IMAGE"
    case "raw":
      return "FILE"
    case "video":
      return "VIDEO"
    default:
      throw new Error(`Unsupported resource_type: ${type.resource_type}`)
  }
}

export const useMessageAttachmentsUpload = (chatRoomId: string) => {
  const api = useApiClient()

  const upload = useCallback(
    async (file: File): Promise<CreateMessageAttachmentDto> => {
      const slot = await unwrap(
        api.POST("/api/v1/message/attachments/presign/{roomId}", {
          params: { path: { roomId: chatRoomId } }
        })
      )

      const { public_id, display_name, bytes, resource_type, secure_url } =
        await uploadToCloudinary(slot, file)

      return {
        key: public_id,
        name: display_name,
        size: bytes,
        type: defineResourceType({ resource_type }),
        url: secure_url
      }
    },
    [chatRoomId, api]
  )

  return upload
}
