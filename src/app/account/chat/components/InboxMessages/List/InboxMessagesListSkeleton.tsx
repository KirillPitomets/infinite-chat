import { InboxMessagesItemSkeleton } from "./Item/InboxMessagesItemSkeleton"

export function InboxMessagesListSkeleton({
  skeletonItems = 1
}: {
  skeletonItems?: number
}) {
  return (
    <ul>
      {Array.from({length: skeletonItems}).map((_, indx) => (
        <li key={indx}>
          <InboxMessagesItemSkeleton />
        </li>
      ))}
    </ul>
  )
}
