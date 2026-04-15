export const isReadMessage = (
  msgCreatedAt: string,
  userLastReadAt: string
): boolean => {
  return new Date(msgCreatedAt) <= new Date(userLastReadAt)
}
