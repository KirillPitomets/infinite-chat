"use client"

import { ChatInputUI } from "@/features/chat/ui/Input/InputUI"
import { useMutation } from "@tanstack/react-query"
import { useTypingIndicator } from "../../hooks/useTypingIndicator"
import { ChatUIMessage } from "../../message/model/message.types"
import { EditMessageInput } from "./EditMessageInput"
import { ReplyMessageInput } from "./ReplyMessageInput"
// import { socket } from "@/shared/lib/socket/socket"

type ChatInputControllerProps = {
  chatId: string
  mode?: "edit" | "reply"
  editingMessage: ChatUIMessage | null | undefined
  replyMessage?: ChatUIMessage
  // inputDropZoneProps?: DropzoneInputProps
  // previewFiles: File[]
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
  // inputDropZoneProps,
  // previewFiles,
  replyMessage,
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

  if (mode === "edit" && editingMessage) {
    return (
      <EditMessageInput
        editingMessage={editingMessage}
        onUpdate={onUpdate}
        onCancelUpdate={onCancelUpdate}
        previewFiles={[]}
        removePreviewFile={onRemovePreviewFile}
        // inputDropZoneProps={inputDropZoneProps}
      />
    )
  }

  if (mode === "reply" && replyMessage) {
    return (
      <ReplyMessageInput
        onCancelReplyToMessage={onCancelReplyToMessage}
        onSubmit={onSubmit}
        previewFiles={[]}
        removePreviewFile={onRemovePreviewFile}
        replyMessage={replyMessage}
      />
    )
  }

  return (
    <>
      <ChatInputUI
        handleTypingIndicator={handleTypingIndicator}
        previewFiles={[]}
        removePreviewFile={onRemovePreviewFile}
        onSubmit={onSubmit}
        // inputDropZoneProps={inputDropZoneProps}
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
