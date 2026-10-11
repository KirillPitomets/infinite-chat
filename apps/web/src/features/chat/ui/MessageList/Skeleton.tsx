import { MessageSkeleton } from "../Message/Skeleton"

export const MessageListSkeleton = ({ length = 10 }: { length?: number }) => {
  return (
    <>
      {Array.from({ length }).map((_, indx) => (
        <MessageSkeleton
          key={`ChatMessageSkeleton-${indx}`}
          isMine={indx % 2 === 0}
        />
      ))}
    </>
  )
}
