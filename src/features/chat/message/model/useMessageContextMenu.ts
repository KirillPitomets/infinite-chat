import { CopyIcon, EditIcon, TrashIcon } from "@/shared/components/ui/icons"
import toast from "react-hot-toast"

type Params = {
  updateMessage: () => void
  deleteMessage: () => void
  copyMessage: () => void
  closeContext: () => void
}

export const useMessageContextMenu = ({
  closeContext,
  deleteMessage,
  updateMessage,
  copyMessage
}: Params) => {
  return [
    {
      icon: EditIcon,
      handle: () => {
        updateMessage()
        closeContext()
      }
    },
    {
      icon: CopyIcon,
      handle: () => {
        copyMessage()
        closeContext()
      }
    },
    {
      icon: TrashIcon,
      handle: () => {
        deleteMessage()
        closeContext()
      }
    }
  ]
}
