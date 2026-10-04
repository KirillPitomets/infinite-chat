export const presenceKeys = {
  presence: (userId: string) => ["presence", userId],
  typing: (roomId: string) => ["typing", roomId]
}
