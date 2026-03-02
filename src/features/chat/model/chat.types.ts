import { ChatMessage, MessageAttachment } from "@/shared/schemes/message.schema"

export type UIAttachment = MessageAttachment & {
  isError: boolean
}

export type ChatUIMessage = ChatMessage & {
  attachments: UIAttachment[]
  status: "loading" | "sent" | "error" | "deleted"
}

export const mapAPIMessageToUI = (
  msg: ChatMessage,
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
