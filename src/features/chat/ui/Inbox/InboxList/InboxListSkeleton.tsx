import { ChatInboxItemSkeleton } from "./InboxItem/InboxItemSkeleton"

export function ChatInboxListSkeleton({
  skeletonItems = 1
}: {
  skeletonItems?: number
}) {
  return (
    <ul>
      {Array.from({ length: skeletonItems }).map((_, indx) => (
        <li key={indx}>
          <ChatInboxItemSkeleton />
        </li>
      ))}
    </ul>
  )
}
