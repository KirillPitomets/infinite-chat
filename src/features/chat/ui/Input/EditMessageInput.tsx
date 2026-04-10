import { DropzoneInputProps } from "react-dropzone"
import { ChatInputUI } from "./InputUI"
import { InputHeader } from "./Header"
import { EditingMessage } from "../../message/api/mutate/useUpdateMessage"

type EditMessageInputProps = {
  editingMessage: EditingMessage
  onCancelUpdate: () => void
  onUpdate: (messageId: string, value: string) => void
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
        content={editingMessage.initialValue ||  `Attachments: ${editingMessage.initialAttachments?.length}`}
        onCancel={onCancelUpdate}
      />
      <ChatInputUI
        previewFiles={previewFiles}
        removePreviewFile={removePreviewFile}
        onSubmit={value => onUpdate(editingMessage.id, value)}
        inputDropZoneProps={inputDropZoneProps}
        isEditInput={true}
        initialValue={editingMessage.initialValue || ""}
      />
    </div>
  )
}
