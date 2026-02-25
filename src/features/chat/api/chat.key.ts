export const chatKeys = {
  all: ["chat"] as const,
  data: (chatId: string) => [...chatKeys.all, "data", chatId] as const,
  lists: () => [...chatKeys.all, "list"] as const,
  preview: () => [...chatKeys.all, "preview"] as const,
  messages: (chatId: string) => [...chatKeys.all, chatId, "messages"] as const,
  sendMessages: (chatId: string) =>
    [...chatKeys.all, chatId, "send-message"] as const
}
