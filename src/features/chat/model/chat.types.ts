import { ChatMessage } from "@/shared/schemes/message.schema"

export interface ChatUIMessage extends ChatMessage {
  status: "loading" | "sent" | "error" | "deleted"
}
