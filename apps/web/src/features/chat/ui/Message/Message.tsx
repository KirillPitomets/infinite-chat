"use client"
import {
  ChatUIMessage,
  UIAttachment
} from "@/features/chat/message/model/message.types"
import MessageContextMenu from "@/features/chat/ui/Message/ContextMenu"
import DeletedMessage from "@/features/chat/ui/Message/DeletedMessage"
import { formatDate } from "date-fns"
import { useState } from "react"
import toast from "react-hot-toast"
import { useMessageContextMenu } from "../../message/model/useMessageContextMenu"
import { MessageContent } from "./Content"
import { MessageSender } from "./Sender"
import { MessageStatus } from "./Status"
import { EditingMessage } from "../../message/api/mutate/useUpdateMessage"
import { useCurrentUser } from "@/features/user/hooks/useCurrentUser"
import type { Message as MessageType } from "@/shared/types/api.type"

interface IMessageProps extends ChatUIMessage {
  chatId: string
  prevSenderMessageId?: string
  // selectedMessageId?: string
  // isRead: boolean
  // handleUpdate: (editingMessage: EditingMessage) => void
  // handleReplyToMessage: (message: ChatUIMessage) => void
  // onDelete: (id: string) => void
  // onPreviewImage: (image: { alt: string; url: string }) => void
}

export const Message = ({
  chatId,
  id,
  text,
  sender,
  attachments,
  isDeleted,
  replyToMessage,
  type,
  systemContent,
  createdAt,
  updatedAt,
  status,

  prevSenderMessageId

  // id,
  // selectedMessageId,
  // isRead,
  // attachments,
  // status,
  // isDeleted,
  // updatedAt,
  // createdAt,
  // replyToMessage,
  // handleReplyToMessage,
  // handleUpdate,
  // onDelete,
  // onPreviewImage
}: IMessageProps) => {
  const currentUser = useCurrentUser()
  const isMine = currentUser.id === sender.id

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

  if (isDeleted || status === "deleted") {
    return (
      <DeletedMessage
        id={id}
        chatId={chatId}
        isMine={isMine}
        senderImageUrl={sender.imageUrl}
        senderName={sender.username}
      />
    )
  }

  return (
    <div className={`w-full flex ${isMine && "justify-end"} break-all`}>
      <div
        className={`max-w-[80%] flex flex-col space-y-2 ${status === "loading" && "opacity-70"} `}
      >
        {!isMine && sender.id !== prevSenderMessageId && (
          <MessageSender avatarUrl={sender.imageUrl} name={sender.username} />
        )}

        <div
          className={`relative px-3 py-1 rounded-sm
        ${
          // id === selectedMessageId
          false
            ? "dark:bg-green-700 bg-green-400"
            : "dark:bg-zinc-700 bg-gray-200 "
        }
        `}
        >
          {replyToMessage && (
            <div className="p-1 pl-2 text-sm border-l-2 border-black dark:bg-zinc-800 bg-gray-300 rounedd-xl">
              <p>{replyToMessage.sender.username}</p>
              <p className="opacity-80">{String(replyToMessage.text)}</p>
            </div>
          )}

          <div className="flex flex-wrap items-end justify-between gap-3">
            <MessageContent
              attachments={attachments}
              onPreviewImage={() => {}}
              content={String(text)}
              messageStatus={"sent"}
            />

            <div className="flex justify-end space-x-2">
              <p className={`text-sm opacity-50 ${isMine && "text-end"}`}>
                {formatDate(createdAt, "HH:mm")}
              </p>
              {/* {isMine && <MessageStatus status={isRead ? "readed" : status} />} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
