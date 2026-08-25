import { useState } from "react"

export const useRealtimeTyping = (chatId: string) => {
  //  :{ isMemberTyping: boolean; member: { id: string; name: string } }
  // const user = useCurrentUser()
  const [isMemberTyping, setIsMemberTyping] = useState(false)
  const [member, setMember] = useState<{ id: string; name: string }>({
    id: "",
    name: ""
  })

  // useRealtime({
  //   channels: [`presence:typing:chatId:${chatId}`],
  //   events: ["chat.presence.typing"],
  //   onData({ data, event }) {
  //     if (event === "chat.presence.typing") {
  //       if (data.user.id !== user.id) {
  //         setIsMemberTyping(data.isTyping)
  //         setMember({
  //           id: data.user.id,
  //           name: data.user.name
  //         })
  //       }
  //     }
  //   }
  // })

  // return { isMemberTyping, member }
}
