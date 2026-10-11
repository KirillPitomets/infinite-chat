import { DropzoneInputProps } from "react-dropzone"
import { ChatInputUI } from "./InputUI"
import { InputHeader } from "./Header"
import { ChatUIMessage } from "../../message/model/message.types"

type EditMessageInputProps = {
  editingMessage: ChatUIMessage
  onCancelUpdate: () => void
  onUpdate: (value: string) => void
  inputDropZoneProps?: DropzoneInputProps
  previewFiles: File[]
  removePreviewFile: (filename: string) => void
}

export const EditMessageInput = ({
  editingMessage,
  previewFiles = [],
  removePreviewFile,
  onCancelUpdate,
  onUpdate,
  inputDropZoneProps
}: EditMessageInputProps) => {
  return (
    <div>
      <InputHeader
        title="Edit"
        content={editingMessage.text}
        countAttachments={editingMessage.attachments?.length}
        onCancel={onCancelUpdate}
      />
      <ChatInputUI
        previewFiles={previewFiles}
        removePreviewFile={removePreviewFile}
        onSubmit={value => onUpdate(value)}
        inputDropZoneProps={inputDropZoneProps}
        isEditInput={true}
        initialValue={editingMessage.text || ""}
      />
    </div>
  )
}
