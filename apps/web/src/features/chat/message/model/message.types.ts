import { Message, MessageAttachments } from "@/shared/types/api.type"

export type UIAttachment = MessageAttachments & {
  isError: boolean
}

export type ChatUIMessage = Message & {
  attachments: UIAttachment[]
  status: "loading" | "sent" | "error" | "deleted" | "readed"
}

export const mapAPIMessageToUI = (
  msg: Message,
  status: ChatUIMessage["status"],
  isAttachmentError: boolean
): ChatUIMessage => {
  return {
    ...msg,
    status,
    attachments: msg.attachments.map(att => ({
      ...att,
      isError: isAttachmentError
    }))
  }
}
