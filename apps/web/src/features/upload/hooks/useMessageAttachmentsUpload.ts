import { unwrap } from "@/shared/lib/api/unwrap"
import { useApiClient } from "@/shared/lib/api/useApiClient"
import { useCallback } from "react"
import { CloudinaryPresignSlot } from "@/shared/types/api.type"

export const useMessageAttachmentsUpload = (chatRoomId: string) => {
  const api = useApiClient()

  const getSlot = useCallback(async () => {
    return await api.POST("/api/v1/message/attachments/presign/{roomId}", {
      params: { path: { roomId: chatRoomId } }
    })
  }, [chatRoomId])

  // const slot = unwrap(
  //   api.POST("/api/v1/message/attachments/presign/{roomId}", {
  //     params: { path: { roomId: chatRoomId } }
  //   })
  // )

  // useFileUpload(slot)
}

const useFileUpload = (slot: CloudinaryPresignSlot) => {}
