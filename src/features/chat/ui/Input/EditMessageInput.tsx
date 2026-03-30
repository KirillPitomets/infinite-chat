import { DropzoneInputProps } from "react-dropzone"
import { ChatInputUI } from "./InputUI"
import { InputHeader } from "./Header"

type EditMessageInputProps = {
  messageId: string
  initialValue: string
  onCancelUpdate: () => void
  onUpdate: (messageId: string, value: string) => void
  inputDropZoneProps?: DropzoneInputProps
  previewFiles: File[]
  removePreviewFile: (filename: string) => void
}

export const EditMessageInput = ({
  initialValue,
  messageId,
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
        content={initialValue}
        onCancel={onCancelUpdate}
      />
      <ChatInputUI
        previewFiles={previewFiles}
        removePreviewFile={removePreviewFile}
        onSubmit={value => onUpdate(messageId, value)}
        inputDropZoneProps={inputDropZoneProps}
        isEditInput={true}
        initialValue={initialValue}
      />
    </div>
  )
}
