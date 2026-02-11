export const InboxMessagesItemSkeleton = () => {
  return (
    <div className="flex gap-2 py-1 px-5 transition-colors">
      <div className="w-8 flex justify-center items-center relative">
        <div className="w-8 h-8 rounded-4xl bg-zinc-300 animate-pulse"></div>
      </div>

      <div className="flex-1 max-w-[80%] space-y-2">
        <div className="flex justify-between">
          <div className="w-[35%] h-3 rounded-2xl bg-zinc-300 animate-pulse" />
          <div className="w-[20%] h-3 rounded-2xl bg-zinc-300 animate-pulse" />
        </div>
        <div className="w-full h-3 rounded-2xl bg-zinc-300 animate-pulse" />
      </div>
    </div>
  )
}
