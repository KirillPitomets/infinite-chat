"use client"

import { ChatInputUI } from "@/features/chat/ui/Input/InputUI"
import { useMutation } from "@tanstack/react-query"
import { DropzoneInputProps } from "react-dropzone"
import { useTypingIndicator } from "../../hooks/useTypingIndicator"
import { ChatUIMessage } from "../../message/model/message.types"
import { EditMessageInput } from "./EditMessageInput"
import { ReplyMessageInput } from "./ReplyMessageInput"
import { usePresenceSocket } from "../../providers/socketProvider"
import { useRef } from "react"
import { usePresenceTyping } from "../../realtime/usePresenceTyping"

type ChatInputControllerProps = {
  chatId: string
  mode?: "edit" | "reply"
  editingMessage: ChatUIMessage | null | undefined
  replyMessage?: ChatUIMessage
  inputDropZoneProps?: DropzoneInputProps
  previewFiles: File[]
  onCancelUpdate: () => void
  onCancelReplyToMessage: () => void
  onUpdate: (value: string, files?: File[]) => void
  onSubmit: (value: string) => void
  onRemovePreviewFile: (filename: string) => void
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
  onRemovePreviewFile,
  onSubmit
}: ChatInputControllerProps) => {
  const socket = usePresenceSocket()

  const { onInputChange } = usePresenceTyping(chatId, socket)

  if (mode === "edit" && editingMessage) {
    return (
      <EditMessageInput
        editingMessage={editingMessage}
        onUpdate={onUpdate}
        onCancelUpdate={onCancelUpdate}
        previewFiles={previewFiles}
        removePreviewFile={onRemovePreviewFile}
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
        removePreviewFile={onRemovePreviewFile}
        replyMessage={replyMessage}
      />
    )
  }

  return (
    <ChatInputUI
      handleTypingIndicator={onInputChange}
      previewFiles={previewFiles}
      removePreviewFile={onRemovePreviewFile}
      onSubmit={onSubmit}
      inputDropZoneProps={inputDropZoneProps}
      initialValue=""
    />
  )
}
