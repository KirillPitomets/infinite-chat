export function HeaderSkeleton() {
  return (
    <header className="flex items-center justify-between p-2.5 border-b border-zinc-300">
      <div className="flex items-center gap-2">
        <div className="max-w-10.5 max-h-10.5 rounded-4xl bg-gray-600 overflow-hidden flex justify-center align-center">
          <div className="w-10.5 h-10.5 bg-zinc-300 rounded-4xl animate-pulse "></div>
        </div>
        <div className="space-y-3">
          <div className="w-25 h-3 bg-zinc-300 rounded-2xl animate-pulse"></div>
          <div className="w-15 h-3 bg-zinc-300 rounded-2xl animate-pulse"></div>
        </div>
      </div>

      <div className="flex space-x-4">
        {Array.from({length: 3}).map((_, indx) => (
          <div
            key={`chatHeaderSkeleton-${indx}`}
            className="w-6.25 h-6.25 bg-zinc-300 rounded-4xl animate-pulse "
          ></div>
        ))}
      </div>
    </header>
  )
}
