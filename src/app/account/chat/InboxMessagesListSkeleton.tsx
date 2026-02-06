export function InboxMessagesListSkeleton({
  skeletonItems = 1
}: {
  skeletonItems?: number
}) {
  return (
    <ul>
      {Array.from({length: skeletonItems}).map((_, indx) => (
        <li key={indx}>
          <div className="flex gap-2 py-1 px-5 transition-colors">
            <div className="w-8 flex justify-center items-center relative">
              <div className="w-8 h-8 rounded-4xl bg-zinc-300 animate-pulse"></div>
            </div>
            <div className="flex-1 max-w-35 space-y-2">
              <div className="w-[50%] h-3 rounded-2xl bg-zinc-300 animate-pulse" />
              <div className="w-full h-3 rounded-2xl bg-zinc-300 animate-pulse" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
