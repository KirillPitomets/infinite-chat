import { Button } from "../ui/Button"
import { User } from "@/shared/types/api.type"
import { useCreateOrFindDirectChat } from "@/features/chat/chat/api/mutate/useCreateOrFindDirectChat"
import { UserAvatar } from "../ui/UserAvatar/UserAvatar"
import { cn } from "@/shared/utils/cn"
import { Minus, Plus, UserRoundIcon } from "lucide-react"

type ChatUserListItemProps = {
  user: User
  onToggleUserOfGroup: (userId: string) => void
  chatTypeForCreate: "GROUP" | "DIRECT"
  isSelected: boolean
}

export const ChatUserListItem = ({
  user,
  onToggleUserOfGroup,
  chatTypeForCreate,
  isSelected
}: ChatUserListItemProps) => {
  const { isPending, createChat } = useCreateOrFindDirectChat()

  return (
    <li
      onClick={() => onToggleUserOfGroup(user.id)}
      className={cn(
        "flex items-center justify-between p-2 pb-3 mb-2 border border-transparent border-b-zinc-400 ",
        { "border-green-400 hover:border-red-500": isSelected }
      )}
    >
      <div className="flex wrap gap-2 items-center">
        <UserAvatar url={user.imageUrl} alt={user.username} size={10} />
        <span className="font-semibold">
          {user.firstName} {user.lastName}
        </span>
      </div>

      {chatTypeForCreate === "GROUP" ? (
        isSelected ? (
          <Button tone="danger">
            <Minus />
          </Button>
        ) : (
          <Button>
            <Plus />
          </Button>
        )
      ) : (
        <Button onClick={() => createChat(user.id)} isPending={isPending}>
          Send message
        </Button>
      )}
    </li>
  )
}
