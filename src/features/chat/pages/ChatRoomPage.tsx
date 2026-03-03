"use client"

import { ChatHeader } from "@/features/chat/ui/Header/Header"
import { ChatInputController } from "@/features/chat/ui/Input/InputController"
import { MessageList } from "@/features/chat/ui/MessageList/MessageList"
import { useCurrentUser } from "@/shared/context/CurrentUserContext"
import { useState } from "react"
import { useChatData } from "../chat/api/useChatData"
import { useChatRealtime } from "../chat/api/useChatRealtime"
import { useDeleteChat } from "../chat/api/useDeleteChat"
import { useDeleteMessage } from "../message/api/mutate/useDeleteMessage"
import { useGetMessages } from "../message/api/query/useGetMessages"
import { useSendMessage } from "../message/api/mutate/useSendMessage"
import { useUpdateMessage } from "../message/api/mutate/useUpdateMessage"
import ImagePreviewDialog from "@/shared/components/ui/ImagePreviewDialog/ImagePreviewDialog"
import { UIAttachment } from "../message/model/message.types"

export const ChatRoomPage = ({ chatId }: { chatId: string }) => {
  const currentUser = useCurrentUser()
  const [isOpenImagePreview, setIsOpenImagePreview] = useState(false)
  const [previewImage, setPreviewImage] = useState<{
    alt: string
    url: string
  }>({ alt: "", url: "" })
  const [isEditMessage, setIsEditMessage] = useState(false)
  const [editingMessage, setEditingMessage] = useState<{
    id: string
    initialValue: string
    initialAttachments?: UIAttachment[]
  }>({ id: "", initialValue: "" })
  const { data: chatData, isLoading: isChatDataLoading } = useChatData(chatId)
  const { data: messages = [], isLoading } = useGetMessages(chatId)
  const { mutate: sendMessage } = useSendMessage(chatId)
  const { mutate: updateMessage } = useUpdateMessage({
    chatId,
    cancelUpdate: () => onCancelUpdate()
  })
  const { mutate: deleteMessage } = useDeleteMessage(chatId)

  useChatRealtime(chatId, currentUser.id)

  const handleMessageDetails = (
    messageId: string,
    initialValue: string,
    attachments?: UIAttachment[]
  ) => {
    setEditingMessage({
      id: messageId,
      initialValue,
      initialAttachments: attachments
    })
    setIsEditMessage(true)
  }

  const onUpdateMessage = (id: string, value: string, files?: File[]) => {
    updateMessage({
      messageId: id,
      content: value,
      files: files
    })
  }

  const onCancelUpdate = () => {
    setEditingMessage({ id: "", initialValue: "" })
    setIsEditMessage(false)
  }

  const { mutate: deleteChat } = useDeleteChat(chatId)

  const handleImagePreviewDialog = (image: { alt: string; url: string }) => {
    setPreviewImage(image)
    setIsOpenImagePreview(true)
  }

  return (
    <div className="flex flex-col flex-1 w-full justify-beetwen">
      <ImagePreviewDialog
        isOpen={isOpenImagePreview}
        image={previewImage}
        onClose={() => setIsOpenImagePreview(false)}
      />
      <ChatHeader
        chatId={chatId}
        chatData={
          chatData?.type === "DIRECT"
            ? {
                type: "DIRECT",
                otherUser: chatData.otherUser
              }
            : chatData?.type === "GROUP"
              ? {
                  ...chatData
                }
              : undefined
        }
        onDelete={() => deleteChat()}
        isLoading={isChatDataLoading}
      />
      <MessageList
        chatId={chatId}
        currentUser={currentUser}
        isLoading={isLoading}
        messages={messages}
        isEditMessage={isEditMessage}
        handleUpdate={handleMessageDetails}
        onDelete={deleteMessage}
        onPreviewImage={image => handleImagePreviewDialog(image)}
      />
      <ChatInputController
        isEdit={isEditMessage}
        editingMessage={editingMessage}
        onUpdate={onUpdateMessage}
        onCancelUpdate={onCancelUpdate}
        onSubmit={(content, files) => {
          sendMessage({ content, files })
        }}
      />
    </div>
  )
}
