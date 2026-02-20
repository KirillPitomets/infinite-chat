export type ChatUIMessage = {
  id: string
  content: string
  createdAt: string
  isDeleted: boolean
  sender: {id: string, tag: string, imageUrl: string; name: string}

  status: "sending" | "sent" | "error" | "editing" | "deleted"
}
