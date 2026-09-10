import { messageKeys } from "@/features/chat/message/model/message.keys"
import {
  ChatUIMessage,
  mapAPIMessageToUI
} from "@/features/chat/message/model/message.types"
import {
  ChatRoomSocket,
  MessageSocket
} from "@/shared/lib/socket/socketFactory"
import { ChatRoom, ChatRoomMember, Message } from "@/shared/types/api.type"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { chatKeys } from "../chat/model/chat.keys"
import { RoomEventMap } from "@/shared/types/socket/chatRoom.events"
import { MessageEventMap } from "@/shared/types/socket/messageSocket.events"

export const useRealtimeInbox = (
  messageSocket: MessageSocket | null,
  chatRoomSocket: ChatRoomSocket | null
) => {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!messageSocket || !chatRoomSocket) return

    const handleMessageCreated = (
      message: MessageEventMap["message.created"]
    ) => {
      console.log("echo message created")
      queryClient.setQueryData<ChatUIMessage>(
        messageKeys.latestMessage(message.roomId),
        () => mapAPIMessageToUI(message, "sent", false)
      )

      queryClient.setQueryData<number>(
        messageKeys.unreadCountMessages(message.roomId),
        prevUnreadCount => (prevUnreadCount ? prevUnreadCount + 1 : 1)
      )
    }

    const handleRoomCreated = (room: RoomEventMap["room.created"]) => {
      queryClient.setQueryData<ChatRoom[]>(chatKeys.inbox(), old =>
        old ? [...old, room] : old
      )
    }
    const handleRoomDelete = (chatRoomId: RoomEventMap["room.deleted"]) => {
      console.log("echo room deleted")
      queryClient.setQueryData<ChatRoom[]>(chatKeys.inbox(), old =>
        old ? old.filter(room => room.id !== chatRoomId) : old
      )
    }

    const handleUpdateRoomMemberReadAt = (
      chatRoomMember: RoomEventMap["room.updated-member-read-at"]
    ) => {
      console.log("echo update room member read at")
      queryClient.setQueryData<ChatRoom[]>(chatKeys.inbox(), old =>
        old
          ? old.map(room =>
              room.memberships.find(member => member.id === chatRoomMember.id)
                ? {
                    ...room,
                    memberships: [
                      ...room.memberships.filter(
                        member => member.id !== chatRoomMember.id
                      ),
                      chatRoomMember
                    ]
                  }
                : room
            )
          : old
      )
    }

    const handleException = (exception: any) => {
      console.log("exception ", exception)
    }

    chatRoomSocket.on("room.created", handleRoomCreated)
    chatRoomSocket.on("room.deleted", handleRoomDelete)
    chatRoomSocket.on(
      "room.updated-member-read-at",
      handleUpdateRoomMemberReadAt
    )
    messageSocket.on("message.created", handleMessageCreated)
    chatRoomSocket.on("exception", handleException)
    messageSocket.on("exception", handleException)
    return () => {
      chatRoomSocket.off("exception", handleException)
      messageSocket.off("exception", handleException)
      messageSocket.off("message.created", handleMessageCreated)
      chatRoomSocket.off("room.created", handleRoomCreated)
      chatRoomSocket.off("room.deleted", handleRoomDelete)
      chatRoomSocket.off(
        "room.updated-member-read-at",
        handleUpdateRoomMemberReadAt
      )
    }
  }, [messageSocket, chatRoomSocket, queryClient])
}

/*
  // const user = useCurrentUser()

  // return useRealtime({
  //   channels: ["chats", ...chats.map(chat => chat.id)],
  //   events: [
  //     "chat.created",
  //     "chat.deleted",
  //     "chat.message.created",
  //     "chat.message.updated",
  //     "chat.message.readed"
  //   ],
  //   onData: ({ data, event }) => {
  //     if (event === "chat.created") {
  //       if (data.memberships.find(member => member.userId === user.id)) {
  //         queryClient.setQueryData<UserChatPreview[]>(chatKeys.inbox(), old =>
  //           old
  //             ? old.map(previewChat =>
  //                 previewChat.id !== data.preview.id
  //                   ? data.preview
  //                   : previewChat
  //               )
  //             : old
  //         )
  //       }
  //     }

  //     if (event === "chat.deleted") {
  //       queryClient.setQueryData<UserChatPreview[]>(chatKeys.inbox(), old =>
  //         old ? old.filter(chat => chat.id !== data.chatId) : old
  //       )
  //     }

  //     if (event === "chat.message.updated") {
  //       queryClient.setQueryData<ChatMessage>(
  //         messageKeys.latestMessage(params.chatId),
  //         data.message
  //       )
  //     }

  //     // set a new value for latest messages
  //     if (event === "chat.message.created") {
  //       queryClient.setQueryData<UserChatPreview[]>(chatKeys.inbox(), old => {
  //         if (!old) return old

  //         const chat = old.find(chat => chat.id === data.chatId)

  //         if (!chat) return old

  //         const updatedChat: UserChatPreview = {
  //           ...chat,
  //           latestMessage: data.message
  //         }

  //         return [
  //           updatedChat,
  //           ...old.filter(oldChat => oldChat.id !== data.chatId)
  //         ]
  //       })
  //     }

  //     if (event === "chat.message.readed") {
  //       // ========= Clear unreadedCount messages =========
  //       if (data.userId === user.id) {
  //         queryClient.setQueryData<UserChatPreview[]>(chatKeys.inbox(), old =>
  //           old
  //             ? old.map(chat =>
  //                 chat.id === data.chatId ? { ...chat, unreadCount: 0 } : chat
  //               )
  //             : old
  //         )
  //       }

  //       // ========= Change lastReadAt for inbox Chats =========
  //       if (data.userId !== user.id) {
  //         queryClient.setQueryData<UserChatPreview[]>(chatKeys.inbox(), old =>
  //           old
  //             ? old.map(previewChat =>
  //                 previewChat.id === data.chatId &&
  //                 previewChat.type === "DIRECT"
  //                   ? {
  //                       ...previewChat,
  //                       otherUser: {
  //                         ...previewChat.otherUser,
  //                         lastReadAt: data.lastReadAt
  //                       }
  //                     }
  //                   : previewChat
  //               )
  //             : old
  //         )
  //       }
  //     }
  //   }
*/
