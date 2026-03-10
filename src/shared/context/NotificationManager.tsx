import { usePathname, useRouter } from "next/navigation"
import React from "react"
import toast from "react-hot-toast"
import { NotificationAlert } from "../components/ui/NotificationAlert/NotificationAlert"
import { useRealtime } from "../lib/realtime-client"
import { useCurrentUser } from "./CurrentUserContext"
import { ACСOOUNT_PAGES } from "../config/accountPages.config"

export const NotificationManager = () => {
  const user = useCurrentUser()
  const isChatPage = usePathname().startsWith("/account/chat")
  const router = useRouter()

  useRealtime({
    channels: [`user:${user.id}`],
    events: ["notification.message.created"],
    onData: ({ data, event }) => {
      if (
        event === "notification.message.created" &&
        data.message.sender.id !== user.id
      ) {
        Notification.requestPermission().then(perm => {
          if (perm === "granted" && document.visibilityState === "hidden") {
            const notify = new Notification("Infinite chat", {
              body: `${data.message.sender.tag} wrote a new message`,
              icon: "logo.svg",
              silent: false
            })

            notify.addEventListener("click", () => {
              window.focus()
              router.replace(ACСOOUNT_PAGES.CHAT_ID(data.chatId))
            })
          }
        })
        if (!isChatPage) {
          toast.custom(
            t => (
              <>
                <NotificationAlert
                  title={data.message.sender.name}
                  message="New message"
                  linkTo={ACСOOUNT_PAGES.CHAT_ID(data.chatId)}
                  handleCloseNotification={() => toast.remove(t.id)}
                />
              </>
            ),
            {
              position: "top-right",
              duration: 20 * 1000
            }
          )
        }
      }
    }
  })
  return null
}
