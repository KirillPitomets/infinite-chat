"use client"
import { ChatUIMessage } from "@/features/chat/message/model/message.types"
import DeletedMessage from "@/features/chat/ui/Message/DeletedMessage"
import { useCurrentUser } from "@/features/user/hooks/useCurrentUser"
import { formatDate } from "date-fns"
import { MessageContent } from "./Content"
import { MessageSender } from "./Sender"
import { MouseEvent, PropsWithChildren } from "react"
import { MessageStatus } from "./Status"

interface IMessageProps {
  msgData: ChatUIMessage
  prevSenderMessageId?: string
  isSelectedMessage: boolean
  isRead: boolean
  onUpdate: (message: ChatUIMessage) => void
  onReplyToMessage: (message: ChatUIMessage) => void
  onRestore: (messageId: string) => void
  onDelete: (id: string) => void
  onPreviewImage: (image: { alt: string; url: string }) => void
  onContextMenu: (e: MouseEvent) => void
}

export const Message = ({
  msgData,
  prevSenderMessageId,
  isSelectedMessage,
  isRead,
  onRestore,
  onPreviewImage,
  onContextMenu,
  children
}: PropsWithChildren<IMessageProps>) => {
  const currentUser = useCurrentUser()
  const isMine = currentUser.id === msgData.sender.id

  if (msgData.isDeleted || msgData.status === "deleted") {
    return (
      <DeletedMessage
        onContextMenu={e => onContextMenu(e)}
        id={msgData.id}
        isMine={isMine}
        sender={msgData.sender}
        onRestore={onRestore}
        prevSenderMessageId={prevSenderMessageId}
      />
    )
  }

  return (
    <div className={`w-full flex ${isMine && "justify-end"} break-all`}>
      <div
        className={`max-w-[80%] flex flex-col gap-2 ${msgData.status === "loading" && "opacity-70"} `}
      >
        {!isMine && msgData.sender.id !== prevSenderMessageId && (
          <MessageSender
            avatarUrl={msgData.sender.imageUrl}
            name={msgData.sender.username}
          />
        )}

        <div
          onContextMenu={e => onContextMenu(e)}
          className={`relative rounded-sm py-1 px-2
        ${
          isSelectedMessage
            ? "dark:bg-green-700 bg-green-400"
            : "dark:bg-zinc-700 bg-gray-200 "
        }
        
        transition-all
         `}
        >
          {children}

          {msgData.replyToMessage && (
            <div className="p-1 pl-2 text-sm border-l-2 border-black dark:bg-zinc-800 bg-gray-300 rounedd-xl">
              <p>{msgData.replyToMessage.sender.username}</p>
              <p className="opacity-80">{msgData.replyToMessage.text}</p>
            </div>
          )}

          <div className="flex flex-wrap items-end justify-between gap-3">
            <MessageContent
              attachments={msgData.attachments}
              onPreviewImage={onPreviewImage}
              content={msgData.text}
              messageStatus={msgData.status}
            />

            <div className="flex justify-end space-x-2">
              <p className={`text-sm opacity-50 ${isMine && "text-end"}`}>
                {formatDate(msgData.createdAt, "HH:mm")}
              </p>
              {isMine && (
                <MessageStatus status={isRead ? "readed" : msgData.status} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
