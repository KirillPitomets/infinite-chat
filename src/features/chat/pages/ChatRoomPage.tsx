"use client"

import { ChatHeader } from "@/features/chat/ui/Header/Header"
import { ChatInputController } from "@/features/chat/ui/Input/InputController"
import { MessageList } from "@/features/chat/ui/MessageList/MessageList"
import { useCurrentUser } from "@/shared/context/CurrentUserContext"
import { useState } from "react"
import { useChatRealtime } from "../api/useChatRealtime"
import { useDeleteMessage } from "../api/useDeleteMessage"
import { useGetMessages } from "../api/useGetMessages"
import { useSendMessage } from "../api/useSendMessage"
import { useUpdateMessage } from "../api/useUpdateMessage"

export const ChatRoomPage = ({ chatId }: { chatId: string }) => {
  const currentUser = useCurrentUser()
  const [isEditMessage, setIsEditMessage] = useState(false)
  const [editingMessage, setEditingMessage] = useState<{
    id: string
    initialValue: string
  }>({ id: "", initialValue: "" })
  const { data: messages = [], isLoading } = useGetMessages(chatId)
  const { mutate: sendMessage } = useSendMessage(chatId)
  const { mutate: updateMessage } = useUpdateMessage({
    chatId,
    cancelUpdate: () => onCancelUpdate()
  })
  const { mutate: deleteMessage } = useDeleteMessage(chatId)

  useChatRealtime(chatId, currentUser.id)

  const handleMessageDetails = (messageId: string, initialValue: string) => {
    setEditingMessage({ id: messageId, initialValue })
    setIsEditMessage(true)
  }

  const onUpdateMessage = (id: string, value: string) => {
    updateMessage({ messageId: id, content: value })
  }

  const onCancelUpdate = () => {
    setEditingMessage({ id: "", initialValue: "" })
    setIsEditMessage(false)
  }
  return (
    <div className="flex flex-col flex-1 w-full justify-beetwen">
      <ChatHeader chatId={chatId} />
      <MessageList
        chatId={chatId}
        currentUser={currentUser}
        isLoading={isLoading}
        messages={messages}
        isEditMessage={isEditMessage}
        onUpdate={handleMessageDetails}
        onDelete={deleteMessage}
      />
      <ChatInputController
        isEdit={isEditMessage}
        editingMessageId={editingMessage.id}
        editingMessageInitialValue={editingMessage.initialValue}
        onUpdate={onUpdateMessage}
        onCancelUpdate={onCancelUpdate}
        onSend={sendMessage}
      />
    </div>
  )
}
