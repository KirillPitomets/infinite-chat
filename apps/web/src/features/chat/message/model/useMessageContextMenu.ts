import {
  CopyIcon,
  EditIcon,
  ReplyIcon,
  TrashIcon
} from "@/shared/components/ui/icons"

type Params = {
  updateMessage: () => void
  deleteMessage: () => void
  copyMessage: () => void
  closeContext: () => void
  replyMessage: () => void
}

export type ContextMenuItem = {
  icon: React.ComponentType<{ width: number; height: number }>
  handle: () => void
  isOwnerOnly: boolean
}

export const useMessageContextMenu = ({
  closeContext,
  deleteMessage,
  updateMessage,
  replyMessage,
  copyMessage
}: Params): ContextMenuItem[] => {
  const contextMenu: ContextMenuItem[] = [
    {
      handle: () => {
        replyMessage()
        closeContext()
      },
      isOwnerOnly: false,
      icon: ReplyIcon
    },
    {
      icon: EditIcon,
      handle: () => {
        updateMessage()
        closeContext()
      },
      isOwnerOnly: true
    },
    {
      icon: CopyIcon,
      handle: () => {
        copyMessage()
        closeContext()
      },
      isOwnerOnly: false
    },
    {
      icon: TrashIcon,
      handle: () => {
        deleteMessage()
        closeContext()
      },
      isOwnerOnly: true
    }
  ]

  return contextMenu
}
