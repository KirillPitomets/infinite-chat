import { ChatInputUI } from "@/features/chat/ui/Input/InputUI"
import { edenClient } from "@/shared/lib/eden"
import { useMutation } from "@tanstack/react-query"
import { DropzoneInputProps } from "react-dropzone"
import { useTypingIndicator } from "../../hooks/useTypingIndicator"
import { UIAttachment } from "../../message/model/message.types"
import { EditMessageInput } from "./EditMessageInput"

type ChatinputControllerProps = {
  chatId: string
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
  chatId,
  isEdit,
  editingMessage,
  inputDropZoneProps,
  previewFiles,
  onUpdate,
  onCancelUpdate,
  removePreviewFile,
  onSubmit
}: ChatinputControllerProps) => {
  const { mutate } = useMutation({
    mutationFn: async (isTyping: boolean) => {
      await edenClient.presence.chats({ chatId }).typing.post({ isTyping })
    }
  })

  const handleTypingIndicator = useTypingIndicator(isTyping => {
    mutate(isTyping)
  }, 1000)

  if (isEdit) {
    return (
      <EditMessageInput
        messageId={editingMessage.id}
        initialValue={editingMessage.initialValue}
        onCancelUpdate={onCancelUpdate}
        onUpdate={onUpdate}
        previewFiles={previewFiles}
        removePreviewFile={removePreviewFile}
        inputDropZoneProps={inputDropZoneProps}
      />
    )
  }

  return (
    <ChatInputUI
      handleTypingIndicator={handleTypingIndicator}
      inputDropZoneProps={inputDropZoneProps}
      previewFiles={previewFiles}
      removePreviewFile={removePreviewFile}
      onSubmit={value => onSubmit(value)}
      initialValue=""
    />
  )
}
