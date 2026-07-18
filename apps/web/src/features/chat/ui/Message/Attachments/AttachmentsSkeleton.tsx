export const AttachmentsSkeleton = ({ count = 1 }: { count?: number }) => {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, indx) => (
        <div
          className="max-w-225 flex justify-center items-center rounded-2xl"
          key={`${Date.now}-attachmentSkeleton-${indx}`}
        >
          <div className="w-50 h-25 animate-pulse border rounded-sm flex items-center justify-center">
            <p>Loading...</p>
          </div>
        </div>
      ))}
    </div>
  )
}
