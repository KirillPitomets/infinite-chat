export type ChatUIMessage = {
  id: string
  isMine: boolean
  content: string
  createdAt: string
  sender: {id: string, tag: string, imageUrl: string; name: string}

  status: "sending" | "sent" | "error" | "editing"
}
