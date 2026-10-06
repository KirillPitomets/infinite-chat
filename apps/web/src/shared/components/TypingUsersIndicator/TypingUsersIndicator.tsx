import { ChatRoom } from "@/shared/types/api.type"
import { TypingIndicator } from "../ui/TypingIndicator/TypingIndicator"

type TypingUsersIndicatorProps = {
  typingUserIds: string[]
  memberships: ChatRoom["memberships"]
}

export const TypingUsersIndicator = ({
  typingUserIds,
  memberships
}: TypingUsersIndicatorProps) => {
  return (
    <div className="flex align-center gap-1 px-2">
      <p>
        {memberships
          .filter(m =>
            typingUserIds.find(typingUserId => typingUserId === m.user.id)
          )
          .map(user => user.user.username)
          .join(", ")}{" "}
      </p>
      <TypingIndicator />
    </div>
  )
}
