import React from "react"

type ContextButtons = {
  icon: React.ElementType
  handle: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

type ContextMenuProps = {
  buttons: ContextButtons[]
}

const MessageContextMenu = ({buttons}: ContextMenuProps) => {
  return (
    <ul className="absolute right-0 flex rounded-lg -top-5 bg-zinc-300 z-1">
      {buttons.map((item, indx) => (
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
