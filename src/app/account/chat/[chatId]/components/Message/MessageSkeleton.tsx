export const MessageSkeleton = ({isMine}: {isMine: boolean}) => {
  return (
    <div className={`w-full flex ${isMine && "justify-end"} break-all`}>
      <div
        className={`max-w-[80%] space-y-2 ${status === "sending" && "opacity-70"}`}
      >
        {!isMine && (
          <div className="flex items-end space-x-2.5">
            <div className="w-6.25 h-6.25 rounded-2xl bg-zinc-400 animate-pulse "></div>
            <div className="w-25 h-3 rounded-2xl bg-zinc-300 animate-pulse"></div>
          </div>
        )}

        <div className="w-46 h-12 flex gap-4 flex-wrap p-4 rounded-2xl bg-zinc-300 animate-pulse"></div>
      </div>
    </div>
  )
}
