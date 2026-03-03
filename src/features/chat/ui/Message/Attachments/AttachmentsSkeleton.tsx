export const AttachmentsSkeleton = ({ count = 1 }: { count?: number }) => {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, indx) => (
        <div
          className="max-w-[900px] flex justify-center items-center rounded-2xl"
          key={`${Date.now}-attachmentSkeleton-${indx}`}
        >
          <div className="w-[200px] h-[100px] animate-pulse border rounded-sm flex items-center justify-center">
            <p>Loading...</p>
          </div>
        </div>
      ))}
    </div>
  )
}
