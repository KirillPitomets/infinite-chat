import { ContextMenuItem } from "../../message/model/useMessageContextMenu"

type ContextMenuProps = {
  isVisible: boolean
  buttons: ContextMenuItem[]
  isMineMessage: boolean
}

const MessageContextMenu = ({
  isVisible,
  isMineMessage,
  buttons
}: ContextMenuProps) => {
  if (!isVisible) return null

  return (
    <ul className="absolute right-0 bottom-full flex rounded-sm bg-zinc-900 dark:bg-zinc-300 z-1">
      {isMineMessage
        ? buttons.map((item, indx) => (
            <li key={`contextMenuItem-${indx}`}>
              <button
                className="p-2 transition-colors cursor-pointer hover:text-green-400"
                onClick={item.handle}
              >
                {<item.icon width={18} height={22} />}
              </button>
            </li>
          ))
        : buttons
            .filter(btn => !btn.isOwnerOnly)
            .map((item, indx) => (
              <li key={`contextMenuItem-${indx}`}>
                <button
                  className="p-2 transition-colors cursor-pointer hover:text-green-400"
                  onClick={item.handle}
                >
                  {<item.icon width={18} height={22} />}
                </button>
              </li>
            ))}
    </ul>
  )
}

export default MessageContextMenu
