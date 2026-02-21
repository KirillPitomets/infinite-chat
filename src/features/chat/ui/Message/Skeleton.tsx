export const MessageSkeleton = ({isMine}: {isMine: boolean}) => {
  return (
    <div className={`w-full flex ${isMine && "justify-end"} break-all`}>
      <div
        className={`max-w-[80%] space-y-2 ${status === "sending" && "opacity-70"}`}
      >
        {!isMine && (
          <div className="flex items-end space-x-2.5">
            <div className="w-6.25 h-6.25 rounded-2xl bg-zinc-400 animate-pulse "></div>
            <div className="h-3 w-25 rounded-2xl bg-zinc-300 animate-pulse"></div>
          </div>
        )}

        <div className="flex flex-wrap h-12 gap-4 p-4 w-46 rounded-2xl bg-zinc-300 animate-pulse"></div>
      </div>
    </div>
  )
}
