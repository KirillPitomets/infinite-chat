import { ChatInputUI } from "@/features/chat/ui/Input/InputUI"
import { useMutation } from "@tanstack/react-query"
import { DropzoneInputProps } from "react-dropzone"
import { useTypingIndicator } from "../../hooks/useTypingIndicator"
import { ChatUIMessage, UIAttachment } from "../../message/model/message.types"
import { EditMessageInput } from "./EditMessageInput"
import { SubmitMessageArgs } from "../../message/api/mutate/useSendMessage"
import { ReplyMessageInput } from "./ReplyMessageInput"
import { EditingMessage } from "../../message/api/mutate/useUpdateMessage"

type ChatinputControllerProps = {
  chatId: string
  mode?: "edit" | "reply"
  editingMessage: EditingMessage
  replyMessage?: ChatUIMessage
  previewFiles: File[]
  onCancelUpdate: () => void
  onCancelReplyToMessage: () => void
  onUpdate: (id: string, value: string, files?: File[]) => void
  onSubmit: (args: SubmitMessageArgs) => void
  inputDropZoneProps?: DropzoneInputProps
  removePreviewFile: (filename: string) => void
}

export const ChatInputController = ({
  chatId,
  mode,
  editingMessage,
  inputDropZoneProps,
  previewFiles,
  replyMessage,
  onUpdate,
  onCancelUpdate,
  onCancelReplyToMessage,
  removePreviewFile,
  onSubmit
}: ChatinputControllerProps) => {
  const { mutate } = useMutation({
    mutationFn: async (isTyping: boolean) => {
      // == TODO ==
      // await edenClient.presence.chats({ chatId }).typing.post({ isTyping })
    }
  })

  const handleTypingIndicator = useTypingIndicator(isTyping => {
    mutate(isTyping)
  }, 1000)

  if (mode === "edit") {
    return (
      <EditMessageInput
        editingMessage={editingMessage}
        onCancelUpdate={onCancelUpdate}
        onUpdate={onUpdate}
        previewFiles={previewFiles}
        removePreviewFile={removePreviewFile}
        inputDropZoneProps={inputDropZoneProps}
      />
    )
  }

  if (mode === "reply" && replyMessage) {
    return (
      <ReplyMessageInput
        onCancelReplyToMessage={onCancelReplyToMessage}
        onSubmit={onSubmit}
        previewFiles={previewFiles}
        removePreviewFile={removePreviewFile}
        replyMessage={replyMessage}
      />
    )
  }

  return (
    <ChatInputUI
      handleTypingIndicator={handleTypingIndicator}
      inputDropZoneProps={inputDropZoneProps}
      previewFiles={previewFiles}
      removePreviewFile={removePreviewFile}
      onSubmit={value => onSubmit({ content: value })}
      initialValue=""
    />
  )
}
