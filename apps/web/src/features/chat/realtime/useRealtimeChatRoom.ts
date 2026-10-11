import { ChatRoomSocket } from "@/shared/lib/socket/socketFactory"
import { ChatRoom, ChatRoomMember } from "@/shared/types/api.type"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { chatKeys } from "../chat/model/chat.keys"
import { RoomEventMap } from "@/shared/types/socket/chatRoom.events"
import { useRouter } from "next/navigation"
import { ACCOUNT_PAGES } from "@/shared/config/accountPages.config"

export function useRealtimeChatRoom(
  chatId: string,
  chatRoomSocket: ChatRoomSocket | null
) {
  const queryClient = useQueryClient()
  const { push } = useRouter()

  useEffect(() => {
    if (!chatRoomSocket) return

    const handleDeleted = (roomId: RoomEventMap["room.deleted"]) => {
      push(ACCOUNT_PAGES.CHAT)
    }

    const handleUpdateRoomMemberReadAt = (
      chatRoomMember: RoomEventMap["room.updated-member-read-at"]
    ) => {
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

    const handleMemberLeft = (memberId: RoomEventMap["room.member-left"]) => {
      console.log("memberId has left from the room ", memberId)
      queryClient.setQueryData<ChatRoom>(chatKeys.data(chatId), old =>
        old
          ? {
              ...old,
              memberships: old.memberships.filter(
                member => member.id !== memberId
              )
            }
          : old
      )
    }

    const handleMemberKicked = ({
      actorId,
      kickedMemberId
    }: RoomEventMap["room.member-kicked"]) => {
      queryClient.setQueryData<ChatRoom>(chatKeys.data(chatId), old =>
        old
          ? {
              ...old,
              memberships: old.memberships.filter(
                member => member.id !== kickedMemberId
              )
            }
          : old
      )
    }

    const handleMemberJoined = (member: RoomEventMap["room.member-joined"]) => {
      queryClient.setQueryData<ChatRoom>(chatKeys.data(chatId), old =>
        old
          ? {
              ...old,
              memberships: [...old.memberships, member]
            }
          : old
      )
    }

    const handleException = (err: unknown) => console.log(err)

    chatRoomSocket.on("room.deleted", handleDeleted)
    chatRoomSocket.on("room.member-joined", handleMemberJoined)
    chatRoomSocket.on("room.member-kicked", handleMemberKicked)
    chatRoomSocket.on("room.member-left", handleMemberLeft)
    chatRoomSocket.on(
      "room.updated-member-read-at",
      handleUpdateRoomMemberReadAt
    )
    chatRoomSocket.on("exception", handleException)

    return () => {
      chatRoomSocket.off("room.deleted", handleDeleted)
      chatRoomSocket.off("room.member-joined", handleMemberJoined)
      chatRoomSocket.off("room.member-kicked", handleMemberKicked)
      chatRoomSocket.off("room.member-left", handleMemberLeft)
      chatRoomSocket.off(
        "room.updated-member-read-at",
        handleUpdateRoomMemberReadAt
      )
    }
  }, [chatRoomSocket, chatId, queryClient])
}
