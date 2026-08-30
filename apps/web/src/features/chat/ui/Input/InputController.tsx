"use client"

import { ChatInputUI } from "@/features/chat/ui/Input/InputUI"
import { useMutation } from "@tanstack/react-query"
import { DropzoneInputProps } from "react-dropzone"
import { useTypingIndicator } from "../../hooks/useTypingIndicator"
import { ChatUIMessage, UIAttachment } from "../../message/model/message.types"
import { EditMessageInput } from "./EditMessageInput"
import { SubmitMessageArgs } from "../../message/api/mutate/useSendMessage"
import { ReplyMessageInput } from "./ReplyMessageInput"
import { EditingMessage } from "../../message/api/mutate/useUpdateMessage"
import { useEffect, useState } from "react"
import { useMessagesSocket } from "../../message/providers/socketProvider"
import { CreateMessageDto } from "@/shared/types/api.type"
// import { socket } from "@/shared/lib/socket/socket"

type ChatInputControllerProps = {
  chatId: string
  mode?: "edit" | "reply"
  // editingMessage: EditingMessage
  // replyMessage?: ChatUIMessage
  // inputDropZoneProps?: DropzoneInputProps
  // previewFiles: File[]
  onCancelUpdate: () => void
  onCancelReplyToMessage: () => void
  onUpdate: (id: string, value: string, files?: File[]) => void
  onSubmit: (dto: CreateMessageDto) => void
  onRemovePreviewFile: (filename: string) => void
}

export const ChatInputController = ({
  chatId,
  mode,
  // editingMessage,
  // inputDropZoneProps,
  // previewFiles,
  // replyMessage,
  onUpdate,
  onCancelUpdate,
  onCancelReplyToMessage,
  onRemovePreviewFile,
  onSubmit
}: ChatInputControllerProps) => {
  const { mutate } = useMutation({
    mutationFn: async (isTyping: boolean) => {
      // == TODO ==
      // await edenClient.presence.chats({ chatId }).typing.post({ isTyping })
    }
  })

  const handleTypingIndicator = useTypingIndicator(isTyping => {
    mutate(isTyping)
  }, 1000)

  // if (mode === "edit") {
  //   return (
  //     <EditMessageInput
  //       editingMessage={editingMessage}
  //       onCancelUpdate={onCancelUpdate}
  //       onUpdate={onUpdate}
  //       previewFiles={previewFiles}
  //       removePreviewFile={onRemovePreviewFile}
  //       inputDropZoneProps={inputDropZoneProps}
  //     />
  //   )
  // }

  // if (mode === "reply" && replyMessage) {
  //   return (
  //     <ReplyMessageInput
  //       onCancelReplyToMessage={onCancelReplyToMessage}
  //       onSubmit={onSubmit}
  //       previewFiles={previewFiles}
  //       removePreviewFile={onRemovePreviewFile}
  //       replyMessage={replyMessage}
  //     />
  //   )
  // }

  return (
    <>
      <ChatInputUI
        handleTypingIndicator={handleTypingIndicator}
        // inputDropZoneProps={inputDropZoneProps}
        // previewFiles={previewFiles}
        removePreviewFile={onRemovePreviewFile}
        onSubmit={value => onSubmit({ roomId: chatId, text: value })}
        // onSubmit={value => handleSendMessage({ roomId: chatId, text: value })}
        // onSubmit={value => console.log(value)}
        initialValue=""
      />
    </>
  )
}

// const { getToken } = useAuth()
// const socketRef = useRef<Socket | null>(null)

// const [status, setStatus] = useState("idle")

// useEffect(() => {
//   const msgSocket = getMessageSocket(getToken)
//   socketRef.current = msgSocket

//   msgSocket.on("connect", () => setStatus(`connected: ${msgSocket.id}`))
//   msgSocket.on("connect_error", err => setStatus(`err: ${err.message}`))
//   msgSocket.on("disconnect", reason => setStatus(`disconnect: ${reason}`))
//   msgSocket.on("message.created", reason => console.log(reason))

//   msgSocket.on("message.created", (...args: any) => {
//     console.log(...args)
//   })

//   msgSocket.connect()

//   return () => void msgSocket.disconnect()
// }, [getToken])

// const handleSend = () => {
//   socketRef.current?.emit("message.send", {
//     roomId: "8df5f8ea-ea9c-4f56-a6cc-06bb3df52f7f",
//     text: "Message from socket test page"
//   })
// }
