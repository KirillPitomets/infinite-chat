"use client"
import { ChatRoom } from "../types/api.type"

export const getDirectChatPartner = (
  memberships: ChatRoom["memberships"],
  currentUserId: string
) => {
  const otherMember = memberships.find(
    member => member.user.id !== currentUserId
  )
  return otherMember?.user ?? null
}
