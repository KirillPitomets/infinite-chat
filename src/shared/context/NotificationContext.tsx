import { useParams } from "next/navigation"
import React from "react"
import toast from "react-hot-toast"
import { useRealtime } from "../lib/realtime-client"
import { useCurrentUser } from "./CurrentUserContext"

export const NotificationProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  const user = useCurrentUser()
  const params = useParams()

  useRealtime({
    channels: [`user:${user.id}`],
    events: ["notification.message.created"],
    onData: ({ data, event }) => {
      if (
        event === "notification.message.created" &&
        data.message.sender.id !== user.id &&
        params.chatId !== data.chatId
      ) {
        toast.success(`A new message from ${data.message.sender.name}`, {
          id: data.chatId
        })
      }
    }
  })

  return <>{children}</>
}
