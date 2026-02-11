import {ChatInput} from "./Input"
import {useMutation, useQuery} from "@tanstack/react-query"
import {edenClient} from "@/lib/eden"
import {useParams} from "next/navigation"
import {Message} from "./Message/Message"
import {useEffect, useMemo, useRef, useState} from "react"
import {ChatUIMessage} from "@/types/ChatUiMessage"
import {useCurrentUser} from "@/context/CurrentUserContext"
import {MessageSkeleton} from "./Message/MessageSkeleton"

export const MessageList = () => {
  const params = useParams<{chatId: string}>()
  const [uiMessages, setUiMessages] = useState<ChatUIMessage[]>([])
  const currentUser = useCurrentUser()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const {mutate: sendMessage} = useMutation({
    mutationKey: ["sendMessage"],
    mutationFn: async (content: string) => {
      if (!params.chatId) {
        return
      }

      const res = await edenClient.message.post({
        content: content,
        chatId: params.chatId
      })

      if (res.error) {
        throw new Error(res.error.value.message)
      }
      return res.data
    },
    onMutate(content) {
      const tempId = crypto.randomUUID()

      setUiMessages(prev => [
        ...prev,
        {
          id: tempId,
          content,
          isMine: true,
          sender: {
            id: currentUser.id,
            imageUrl: currentUser.imageUrl,
            name: currentUser.name,
            tag: currentUser.tag
          },
          createdAt: new Date().toISOString(),
          status: "sending"
        }
      ])
      return {tempId}
    },
    onSuccess(data, _, ctx) {
      if (data) {
        setUiMessages(prev =>
          prev.map(msg =>
            msg.id === ctx.tempId ? {...data, status: "sent"} : msg
          )
        )
      }
    },
    onError(_, __, ctx) {
      setUiMessages(prev =>
        prev.map(msg =>
          msg.id === ctx?.tempId ? {...msg, status: "error"} : msg
        )
      )
    }
  })

  const {data: messages, isLoading} = useQuery({
    queryKey: ["getChatMessages", params.chatId],
    queryFn: async () => {
      if (!params.chatId) return []

      const res = await edenClient.message.get({
        query: {chatId: params.chatId}
      })

      return res.data ?? []
    }
  })

  const mergedMessages = useMemo<ChatUIMessage[]>(() => {
    if (!messages) return []

    const sentIds = new Set(messages.map(m => m.id))
    const serverMessages: ChatUIMessage[] = messages.map(msg => ({
      ...msg,
      status: "sent"
    }))

    return [...serverMessages, ...uiMessages.filter(m => !sentIds.has(m.id))]
  }, [messages, uiMessages])

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView()
    }
  }, [mergedMessages])

  return (
    <>
      <div className="flex-1 space-y-5 p-5.25 overflow-y-auto scrollbar-thin">
        {isLoading
          ? Array.from({length: 10}).map((_, indx) => (
              <MessageSkeleton
                key={`ChatMessageSkeleton-${indx}`}
                isMine={indx % 2 === 0}
              />
            ))
          : mergedMessages.map(msg => <Message key={msg.id} {...msg} />)}

        <div ref={messagesEndRef}></div>
      </div>

      <ChatInput sendFn={sendMessage} />
    </>
  )
}

