import { useState } from "react"
import { ChatUIMessage } from "../../model/message.types"

export const useReplyMessage = () => {
  const [replyMessage, setReplyMessage] = useState<ChatUIMessage | undefined>(
    undefined
  )
  const [isReplyMessage, setIsReplyMessage] = useState(false)

  const clearReplyMessage = () => {
    setIsReplyMessage(false)
    setReplyMessage(undefined)
  }

  const handleReplyMessage = (msg: ChatUIMessage) => {
    setIsReplyMessage(true)
    setReplyMessage(msg)
  }

  return {
    replyMessage,
    isReplyMessage,
    clearReplyMessage,
    handleReplyMessage
  }
}
