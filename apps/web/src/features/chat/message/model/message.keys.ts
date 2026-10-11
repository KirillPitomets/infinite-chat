export const messageKeys = {
  latestMessage: (chatId: string) => ["latest", "message", chatId] as const,
  unreadCountMessages: (chatId: string) =>
    ["unread", "count", "messages", chatId] as const
}
