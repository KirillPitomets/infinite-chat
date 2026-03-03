import { ChatInputUI } from "@/features/chat/ui/Input/InputUI"
import { UIAttachment } from "../../message/model/message.types"

type ChatinputControllerProps = {
  isEdit: boolean
  editingMessage: {
    id: string
    initialValue: string
    initialAttachments?: UIAttachment[]
  }
  onCancelUpdate: () => void
  onUpdate: (id: string, value: string, files?: File[]) => void
  onSubmit: (value: string, files?: File[]) => void
}

export const ChatInputController = ({
  isEdit,
  editingMessage,
  onUpdate,
  onCancelUpdate,
  onSubmit
}: ChatinputControllerProps) => {
  if (isEdit) {
    return (
      <div>
        <div className="flex justify-between w-full p-4 border border-zinc-300">
          <div className="">
            <p>Edit message: </p>
            <p className="truncate max-w-175">{editingMessage.initialValue}</p>
          </div>
          <button onClick={onCancelUpdate}>cancel</button>
        </div>
        <ChatInputUI
          onSubmit={(value, files) => onUpdate(editingMessage.id, value, files)}
          isEditInput={isEdit}
          initialValue={editingMessage.initialValue}
        />
      </div>
    )
  }

  return (
    <ChatInputUI
      onSubmit={(value, files) => onSubmit(value, files)}
      initialValue=""
    />
  )
}
