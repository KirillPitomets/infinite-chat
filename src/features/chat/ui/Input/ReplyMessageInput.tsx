import { DropzoneInputProps } from "react-dropzone"
import { ChatInputUI } from "./InputUI"
import { InputHeader } from "./Header"
import { ChatUIMessage } from "../../message/model/message.types"
import { SubmitMessageArgs } from "../../message/api/mutate/useSendMessage"

type ReplyMessageInput = {
  previewFiles: File[]
  replyMessage: ChatUIMessage
  onCancelReplyToMessage: () => void
  onSubmit: (args: SubmitMessageArgs) => void
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
        content={replyMessage.content}
        onCancel={onCancelReplyToMessage}
      />
      <ChatInputUI
        inputDropZoneProps={inputDropZoneProps}
        previewFiles={previewFiles}
        removePreviewFile={removePreviewFile}
        onSubmit={value => {
          onSubmit({
            content: value,
            replyMessage
          })
          onCancelReplyToMessage()
        }}
        initialValue=""
      />
    </div>
  )
}
