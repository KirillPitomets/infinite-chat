import { ChatInputUI } from "@/features/chat/ui/Input/InputUI"
import { UIAttachment } from "../../message/model/message.types"
import { DropzoneInputProps } from "react-dropzone"

type ChatinputControllerProps = {
  isEdit: boolean
  editingMessage: {
    id: string
    initialValue: string
    initialAttachments?: UIAttachment[]
  }
  previewFiles: File[]
  onCancelUpdate: () => void
  onUpdate: (id: string, value: string, files?: File[]) => void
  onSubmit: (value: string, files?: File[]) => void
  inputDropZoneProps?: DropzoneInputProps
  removePreviewFile: (filename: string) => void
}

export const ChatInputController = ({
  isEdit,
  editingMessage,
  inputDropZoneProps,
  previewFiles,
  onUpdate,
  onCancelUpdate,
  removePreviewFile,
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
          previewFiles={previewFiles}
          removePreviewFile={removePreviewFile}
          onSubmit={value => onUpdate(editingMessage.id, value)}
          inputDropZoneProps={inputDropZoneProps}
          isEditInput={isEdit}
          initialValue={editingMessage.initialValue}
        />
      </div>
    )
  }

  return (
    <ChatInputUI
      inputDropZoneProps={inputDropZoneProps}
      previewFiles={previewFiles}
      removePreviewFile={removePreviewFile}
      onSubmit={value => onSubmit(value)}
      initialValue=""
    />
  )
}
