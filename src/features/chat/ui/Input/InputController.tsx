import { ChatInputUI } from "@/features/chat/ui/Input/InputUI"

type ChatinputControllerProps = {
  isEdit: boolean
  editingMessageId: string
  editingMessageInitialValue: string
  onCancelUpdate: () => void
  onUpdate: (id: string, value: string) => void
  onSend: (value: string) => void
}

export const ChatInputController = ({
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
        <div className="flex justify-between w-full p-4 border border-zinc-300">
          <div className="">
            <p>Edit message: </p>
            <p className="truncate max-w-175">{editingMessageInitialValue}</p>
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
