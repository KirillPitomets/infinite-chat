"use client"
import {
  ChatUIMessage,
  mapAPIMessageToUI
} from "@/features/chat/message/model/message.types"
import { Message } from "@/features/chat/ui/Message/Message"
import { useThrottle } from "@/shared/hooks/useThrottle"
import type { Message as MessageType, User } from "@/shared/types/api.type"
import { isReadMessage } from "@/shared/utils/isReadMessage"
import { useMutation } from "@tanstack/react-query"
import { useEffect, useRef } from "react"
import { useChatScroll } from "../../hooks/useChatScroll"
import { useGetMessages } from "../../message/api/query/useGetMessages"
import { MessageListSkeleton } from "./Skeleton"
import { useCurrentUser } from "@/features/user/hooks/useCurrentUser"

type MessageListProps = {
  chatId: string
  initialData: MessageType[]
  selectedMessageId?: string
  // otherUserLastReadAt?: string
  onUpdate: (editingMessage: ChatUIMessage) => void
  onReplyToMessage: (message: ChatUIMessage) => void
  onRestore: (messageId: string) => void
  onDelete: (id: string) => void
  onPreviewImage: (image: { alt: string; url: string }) => void
}

export const MessageList = ({
  chatId,
  initialData,
  selectedMessageId,
  // otherUserLastReadAt,
  onUpdate,
  onReplyToMessage,
  onDelete,
  onRestore,
  onPreviewImage
}: MessageListProps) => {
  const currentUser = useCurrentUser()
  const containerRef = useRef<HTMLDivElement>(null)

  const { data: messages } = useGetMessages(chatId, initialData)

  const { mutate: updateLastReadAt } = useMutation({
    mutationFn: async () => {
      const lastIncommingMessage = [...messages]
        .slice()
        .reverse()
        .find(msg => msg.sender.id !== currentUser.id)

      if (
        !lastIncommingMessage ||
        lastIncommingMessage.sender.id === currentUser.id
      ) {
        return
      }
      // == TODO ==
      // await edenClient.chat({ chatId }).read.put({
      //   lastReadAt: lastIncommingMessage.createdAt
      // })
    }
  })

  const throttledHandleScroll = useThrottle(() => updateLastReadAt(), 1000)
  useChatScroll(containerRef, messages, () => throttledHandleScroll())

  // const contextMenu = useMessageContextMenu({
  //   closeContext: () => setIsVisibleContextMenu(false),
  //   copyMessage: () => {
  //     if (content) {
  //       navigator.clipboard.writeText(content)
  //       toast.success("Message copied :)")
  //     } else {
  //       toast.error("No content for copy")
  //     }
  //   },
  //   deleteMessage() {
  //     onDelete(id)
  //   },
  //   updateMessage() {
  //     handleUpdate({
  //       id,
  //       initialValue: content,
  //       initialAttachments: attachments
  //     })
  //   },
  //   replyMessage() {
  //     handleReplyToMessage({
  //       id,
  //       attachments,
  //       content,
  //       createdAt,
  //       status,
  //       isDeleted,
  //       updatedAt,
  //       sender
  //     })
  //   }
  // })

  return (
    <div
      ref={containerRef}
      className="relative flex-1 p-4 space-y-1 overflow-y-auto scrollbar-thin"
    >
      {/* <MessageContextMenu
          isMineMessage={isMine}
          isVisible={isVisibleContextMenu}
          buttons={contextMenu}
        /> 
      */}
      {messages.map((msg, indx) => (
        <Message
          key={msg.id}
          selectedMessageId={selectedMessageId}
          prevSenderMessageId={indx > 0 ? messages[indx - 1].sender.id : ""}
          onDelete={onDelete}
          onUpdate={onUpdate}
          onReplyToMessage={onReplyToMessage}
          onRestore={onRestore}
          msgData={msg}
          onPreviewImage={onPreviewImage}

          // isRead={
          //   otherUserLastReadAt
          //     ? isReadMessage(msg.createdAt, otherUserLastReadAt)
          //     : false
          // }
        />
      ))}
    </div>
  )
}
