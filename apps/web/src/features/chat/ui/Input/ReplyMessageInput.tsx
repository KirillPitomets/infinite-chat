import { DropzoneInputProps } from "react-dropzone"
import { ChatInputUI } from "./InputUI"
import { InputHeader } from "./Header"
import { ChatUIMessage } from "../../message/model/message.types"

type ReplyMessageInput = {
  previewFiles: File[]
  replyMessage: ChatUIMessage
  onCancelReplyToMessage: () => void
  onSubmit: (value: string) => void
  inputDropZoneProps?: DropzoneInputProps
  removePreviewFile: (filename: string) => void
}

export const ReplyMessageInput = ({
  previewFiles = [],
  onSubmit,
  replyMessage,
  removePreviewFile,
  onCancelReplyToMessage,
  inputDropZoneProps
}: ReplyMessageInput) => {
  return (
    <div>
      <InputHeader
        title="Reply to"
        content={replyMessage.text}
        countAttachments={replyMessage.attachments.length}
        onCancel={onCancelReplyToMessage}
      />
      <ChatInputUI
        inputDropZoneProps={inputDropZoneProps}
        previewFiles={previewFiles}
        removePreviewFile={removePreviewFile}
        onSubmit={value => {
          onSubmit(value)
          onCancelReplyToMessage()
        }}
        initialValue=""
      />
    </div>
  )
}
