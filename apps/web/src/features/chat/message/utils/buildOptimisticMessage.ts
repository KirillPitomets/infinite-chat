import { User } from "@/shared/types/api.type"
import { ChatUIMessage, UIAttachment } from "../model/message.types"

type BuildOptimisticMessageParams = {
  roomId: string
  sender: User
  text?: string | null | undefined
  replyMessage?: ChatUIMessage
  files?: File[]
}

export const buildOptimisticMessageAttachment = (file: File): UIAttachment => {
  const tempFileId = crypto.randomUUID()
  return {
    id: tempFileId,
    key: `temp-${tempFileId}`,
    name: file.name,
    size: 123,
    type: "IMAGE",
    url: "",
    createdAt: new Date().toISOString(),

    isError: false
  }
}

export const buildOptimisticMessage = ({
  roomId,
  sender,
  files,
  replyMessage,
  text
}: BuildOptimisticMessageParams): ChatUIMessage => {
  const tempId = crypto.randomUUID()

  return {
    id: tempId,
    roomId,
    type: "USER",
    text,
    sender,
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "loading",
    replyToMessage: replyMessage,
    attachments: files
      ? files.map(file => buildOptimisticMessageAttachment(file))
      : []
  }
}
