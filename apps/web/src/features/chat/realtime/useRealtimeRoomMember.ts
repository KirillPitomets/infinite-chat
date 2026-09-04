import { ChatRoomSocket } from "@/shared/lib/socket/socketFactory"
import { ChatRoom, ChatRoomMember } from "@/shared/types/api.type"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { chatKeys } from "../chat/model/chat.keys"

export function useRealtimeChatRoom(
  chatId: string,
  chatRoomSocket: ChatRoomSocket | null
) {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!chatRoomSocket) return

    const handleCreated = (chatRoom: ChatRoom) => {}
    const handleUpdated = (chatRoom: ChatRoom) => {}
    const handleDeleted = (chatRoom: ChatRoom) => {}

    const handleUpdateRoomMemberReadAt = (chatRoomMember: ChatRoomMember) => {
      console.log("echo handle update room member read at")
      queryClient.setQueryData<ChatRoom>(chatKeys.data(chatId), old =>
        old
          ? {
              ...old,
              memberships: old.memberships.map(m =>
                m.id === chatRoomMember.id ? chatRoomMember : m
              )
            }
          : old
      )
    }

    const handleException = (err: unknown) => console.log(err)

    chatRoomSocket.on("room.created", handleCreated)
    chatRoomSocket.on("room.deleted", () => {})
    chatRoomSocket.on("room.member-joined", () => {})
    chatRoomSocket.on("room.member-kicked", () => {})
    chatRoomSocket.on("room.member-left", () => {})
    chatRoomSocket.on(
      "room.updated-member-read-at",
      handleUpdateRoomMemberReadAt
    )
    chatRoomSocket.on("exception", handleException)

    return () => {
      chatRoomSocket.off(
        "room.updated-member-read-at",
        handleUpdateRoomMemberReadAt
      )
    }
  }, [chatRoomSocket, chatId, queryClient])
}
