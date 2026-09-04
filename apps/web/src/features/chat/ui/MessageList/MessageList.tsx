"use client"
import { ChatUIMessage } from "@/features/chat/message/model/message.types"
import { Message } from "@/features/chat/ui/Message/Message"
import { useCurrentUser } from "@/features/user/hooks/useCurrentUser"
import { useThrottle } from "@/shared/hooks/useThrottle"
import type {
  ChatRoomMember,
  Message as MessageType,
  UpdateRoomMemberLastReadAtDto
} from "@/shared/types/api.type"
import { useMutation } from "@tanstack/react-query"
import { useRef } from "react"
import { useChatScroll } from "../../hooks/useChatScroll"
import { useGetMessages } from "../../message/api/query/useGetMessages"
import { useChatRoomSocket } from "../../message/providers/socketProvider"
import MessageContextMenu from "../Message/ContextMenu/ContextMenu"
import { useMessageContextMenu } from "../Message/ContextMenu/useMessageContextMenu"
import { useReadMessages } from "../../message/api/mutate/useReadMessage"

type MessageListProps = {
  chatId: string
  memberships: ChatRoomMember[]
  initialData: MessageType[]
  replyMessageId?: string
  onUpdate: (editingMessage: ChatUIMessage) => void
  onReplyToMessage: (message: ChatUIMessage) => void
  onRestore: (messageId: string) => void
  onDelete: (id: string) => void
  onPreviewImage: (image: { alt: string; url: string }) => void
}

export const MessageList = ({
  chatId,
  initialData,
  memberships,
  replyMessageId,
  onUpdate,
  onReplyToMessage,
  onDelete,
  onRestore,
  onPreviewImage
}: MessageListProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const roomSocket = useChatRoomSocket()

  const { data: messages } = useGetMessages(chatId, initialData)
  const { readMessages } = useReadMessages(chatId, roomSocket, messages)

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
    onUpdate,
    onRestore
  })

  const throttledHandleScroll = useThrottle(() => readMessages(), 1000)
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
          isSelectedMessage={
            msg.id === activeMessage?.id || msg.id === replyMessageId
          }
          prevSenderMessageId={indx > 0 ? messages[indx - 1].sender.id : ""}
          onDelete={onDelete}
          onUpdate={onUpdate}
          onReplyToMessage={onReplyToMessage}
          onRestore={onRestore}
          msgData={msg}
          onPreviewImage={onPreviewImage}
          onContextMenu={e => handleContextMenu(e.nativeEvent, msg)}
          isRead={!!memberships.find(m => m.lastReadAt >= msg.createdAt)}
        />
      ))}
    </div>
  )
}
