import { useMessageAttachmentsUpload } from "@/features/upload/hooks/useMessageAttachmentsUpload"
import { CreateMessageAttachmentDto } from "@/shared/types/api.type"
import { useCallback } from "react"

export const useAttachmentUpload = (chatId: string) => {
  const uploadMessageAttachment = useMessageAttachmentsUpload(chatId)

  const uploadAll = useCallback(
    async (files: File[]) => {
      const attachments: CreateMessageAttachmentDto[] = []

      for (let file of files) {
        const att = await uploadMessageAttachment(file)
        attachments.push(att)
      }

      return attachments
    },
    [chatId]
  )

  return [uploadAll]
}
