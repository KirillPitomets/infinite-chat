import { ChatMessage } from "@/shared/schemes/message.schema"

export interface ChatUIMessage extends ChatMessage {
  status: "sending" | "sent" | "error" | "editing" | "deleted"
}
