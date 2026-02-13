import {ReactNode, useEffect} from "react"
import {useCurrentUser} from "./CurrentUserProvider"
import {realtime} from "@/lib/realtime"

const PresenceProvider = ({children}: {children: ReactNode}) => {
  const {id: userId} = useCurrentUser()

  useEffect(() => {
    console.log("use effect presence provider")
    const channel = realtime.channel("presence")

    channel.emit("presence.user.status", {userId, status: "online"})

    const interval = setInterval(() => {
      console.log("echo from interval");
      
      channel.emit("presence.user.heartbeat", {userId})
    }, 1000)

    return () => {
      channel.emit("presence.user.status", {userId, status: "offline"})
      clearInterval(interval)
    }
  }, [userId])

  return children
}

export default PresenceProvider
