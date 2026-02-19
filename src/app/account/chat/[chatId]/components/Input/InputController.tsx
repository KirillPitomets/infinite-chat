import React from "react"
import {ChatInputUI} from "./InputUI"

type ChatinputControllerProps = {
  isEdit: boolean
  editingMessageId: string
  editingMessageInitialValue: string
  onCancelUpdate: () => void
  onUpdate: (id: string, value: string) => void
  onSend: (value: string) => void
}

const ChatInputController = ({
  isEdit,
  editingMessageId,
  editingMessageInitialValue,
  onUpdate,
  onCancelUpdate,
  onSend
}: ChatinputControllerProps) => {
  if (isEdit) {
    return (
      <div>
        <div className="w-full flex justify-between p-4 border border-zinc-300">
          <div className="">
            <p>Edit message: </p>
            <p className="max-w-175 truncate">{editingMessageInitialValue}</p>
          </div>
          <button onClick={onCancelUpdate}>cancel</button>
        </div>
        <ChatInputUI
          onSubmit={value => onUpdate(editingMessageId, value)}
          initialValue={editingMessageInitialValue}
        />
      </div>
    )
  }

  return <ChatInputUI onSubmit={value => onSend(value)} initialValue="" />
}

export default ChatInputController
