import { InboxMessagesItemSkeleton } from "./Item/ItemSkeleton"

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
