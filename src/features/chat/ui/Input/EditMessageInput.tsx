import { IconButtonBase } from "@/shared/components/ui/IconButtonBase"
import { DropzoneInputProps } from "react-dropzone"
import { ChatInputUI } from "./InputUI"

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
      <div className="flex justify-between w-full p-4 border border-zinc-300">
        <div className="">
          <p>Edit message: </p>
          <p className="truncate max-w-175">{initialValue}</p>
        </div>
        <button onClick={onCancelUpdate}>
          <IconButtonBase>cancel</IconButtonBase>
        </button>
      </div>
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
