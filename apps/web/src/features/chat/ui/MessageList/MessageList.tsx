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
import { MouseEvent, useEffect, useRef, useState } from "react"
import { useChatScroll } from "../../hooks/useChatScroll"
import { useGetMessages } from "../../message/api/query/useGetMessages"
import { MessageListSkeleton } from "./Skeleton"
import { useCurrentUser } from "@/features/user/hooks/useCurrentUser"
import toast from "react-hot-toast"
import MessageContextMenu from "../Message/ContextMenu/ContextMenu"
import { useMessageContextMenu } from "../Message/ContextMenu/useMessageContextMenu"

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

  const {
    contextMenu,
    activeMessage,
    getMenuItems,
    handleCloseContextMenu,
    handleContextMenu
  } = useMessageContextMenu({
    containerRef,
    messages,
    onDelete,
    onReplyToMessage,
    onUpdate
  })
  const throttledHandleScroll = useThrottle(() => updateLastReadAt(), 1000)
  useChatScroll(containerRef, messages, () => throttledHandleScroll())

  return (
    <div
      ref={containerRef}
      className={`relative flex-1 p-4 space-y-1
         ${
           contextMenu && activeMessage
             ? "overflow-y-hidden"
             : "overflow-y-auto"
         } scrollbar-thumb-green-800`}
    >
      {contextMenu && activeMessage && (
        <MessageContextMenu
          position={contextMenu.position}
          items={getMenuItems(activeMessage)}
          onClose={handleCloseContextMenu}
        />
      )}

      {messages.map((msg, indx) => (
        <Message
          key={msg.id}
          isSelectedMessage={msg.id === activeMessage?.id}
          prevSenderMessageId={indx > 0 ? messages[indx - 1].sender.id : ""}
          onDelete={onDelete}
          onUpdate={onUpdate}
          onReplyToMessage={onReplyToMessage}
          onRestore={onRestore}
          msgData={msg}
          onPreviewImage={onPreviewImage}
          onContextMenu={e => handleContextMenu(e.nativeEvent, msg)}

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
