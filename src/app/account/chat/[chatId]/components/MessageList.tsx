import {useCurrentUser} from "@/context/CurrentUserContext"
import {edenClient} from "@/lib/eden"
import {ChatUIMessage} from "@/types/ChatUiMessage"
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"
import {useParams} from "next/navigation"
import {useEffect, useRef, useState} from "react"
import toast from "react-hot-toast"
import ChatInputController from "./Input/InputController"
import {Message} from "./Message/Message"
import {MessageSkeleton} from "./Message/MessageSkeleton"
import {useRealtime} from "@/lib/realtime-client"

export const MessageList = () => {
  const {chatId} = useParams<{chatId: string}>()
  const currentUser = useCurrentUser()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isEditMessage, setIsEditMessage] = useState(false)
  const [editingMessage, setEditingMessage] = useState<{
    id: string
    initialValue: string
  }>({id: "", initialValue: ""})

  const queryClient = useQueryClient()

  const {data: messages = [], isLoading} = useQuery<ChatUIMessage[]>({
    enabled: !!chatId,
    queryKey: ["getChatMessages", chatId],
    queryFn: async () => {
      const res = await edenClient.message.get({
        query: {chatId: chatId}
      })

      if (!res.data) {
        throw new Error("Failed to get messages")
      }

      return res.data.map(msg => ({
        ...msg,
        status: "sent"
      }))
    }
  })

  const {mutate: sendMessage} = useMutation<
    ChatUIMessage,
    Error,
    string,
    {previousMessages: ChatUIMessage[]; tempId: string}
  >({
    mutationKey: ["sendMessage", chatId],
    mutationFn: async (content: string) => {
      const res = await edenClient.message.post({
        content,
        chatId
      })

      if (!res.data) {
        throw new Error("Failed to send message")
      }

      return {...res.data, status: "sent"}
    },

    onMutate: async content => {
      await queryClient.cancelQueries({
        queryKey: ["getChatMessages", chatId]
      })

      const previousMessages =
        queryClient.getQueryData<ChatUIMessage[]>([
          "getChatMessages",
          chatId
        ]) ?? []

      const tempId = crypto.randomUUID()

      const optimisticMessage: ChatUIMessage = {
        id: tempId,
        content,
        isMine: true,
        sender: currentUser,
        createdAt: new Date().toISOString(),
        status: "sending"
      }

      queryClient.setQueryData<ChatUIMessage[]>(
        ["getChatMessages", chatId],
        old => [...(old ?? []), optimisticMessage]
      )

      return {previousMessages, tempId}
    },
    onSuccess: (data, _, ctx) => {
      queryClient.setQueryData<ChatUIMessage[]>(
        ["getChatMessages", chatId],
        old =>
          old?.map(msg =>
            msg.id === ctx.tempId ? {...data, status: "sent"} : msg
          ) ?? []
      )
    },
    onError: (error, _, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(
          ["getChatMessages", chatId],
          context.previousMessages ?? []
        )
      }

      toast.error(error.message)
    }
  })

  const {mutate: updateMessage} = useMutation<
    ChatUIMessage,
    Error,
    {messageId: string; content: string},
    {previousMessages: ChatUIMessage[]}
  >({
    mutationKey: ["updateMessage"],
    mutationFn: async ({messageId, content}) => {
      const res = await edenClient.message({messageId}).put({content})

      if (res.status !== 200 || !res.data) {
        throw new Error(res.error?.value.message ?? "Failed to update message")
      }

      return {...res.data, status: "sent"}
    },
    onMutate: async ({messageId, content}) => {
      await queryClient.cancelQueries({
        queryKey: ["getChatMessages", chatId]
      })
      const previousMessages =
        queryClient.getQueryData<ChatUIMessage[]>([
          "getChatMessages",
          chatId
        ]) ?? []

      // optimistic update
      queryClient.setQueryData<ChatUIMessage[]>(
        ["getChatMessages", chatId],
        old =>
          old
            ? old.map(msg =>
                msg.id === messageId
                  ? {...msg, content, status: "editing"}
                  : msg
              )
            : []
      )

      return {previousMessages}
    },
    onSuccess: data => {
      queryClient.setQueryData<ChatUIMessage[]>(
        ["getChatMessages", chatId],
        old => old?.map(msg => (msg.id === data.id ? data : msg)) ?? []
      )

      toast.success("Message have been updated")
      onCancelUpdate()
    },
    onError: (error, _, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(
          ["getChatMessages", chatId],
          context.previousMessages
        )
      }

      toast.error(error.message)
      onCancelUpdate()
    }
  })

  useRealtime({
    channels: [chatId],
    events: [
      "chat.message.created",
      "chat.message.deleted",
      "chat.message.updated"
    ],
    onData({data, event}) {
      switch (event) {
        case "chat.message.created":
          if (data.sender.id !== currentUser.id) {
            queryClient.setQueryData<ChatUIMessage[]>(
              ["getChatMessages", chatId],
              old => [
                ...(old ?? []),
                {
                  ...data,
                  status: "sent"
                }
              ]
            )
          }
          break
        case "chat.message.updated":
          queryClient.setQueryData<ChatUIMessage[]>(
            ["getChatMessages", chatId],
            old =>
              old
                ? old.map(msg =>
                    msg.id === data.id ? {...data, status: "sent"} : msg
                  )
                : []
          )
          break
        default:
          break
      }
    }
  })

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView()
    }
  }, [messages.length, isEditMessage])

  const handleMessageDetails = (messageId: string, initialValue: string) => {
    setEditingMessage({id: messageId, initialValue})
    setIsEditMessage(true)
  }

  const onUpdateMessage = (id: string, value: string) => {
    updateMessage({messageId: id, content: value})
  }

  const onCancelUpdate = () => {
    setEditingMessage({id: "", initialValue: ""})
    setIsEditMessage(false)
  }

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
          : messages.map(msg => (
              <Message
                key={msg.id}
                handleUpdateMessage={handleMessageDetails}
                {...msg}
                isMine={currentUser.id === msg.sender.id}
              />
            ))}
        <div ref={messagesEndRef}></div>
      </div>
      <ChatInputController
        isEdit={isEditMessage}
        editingMessageId={editingMessage.id}
        editingMessageInitialValue={editingMessage.initialValue}
        onUpdate={onUpdateMessage}
        onCancelUpdate={onCancelUpdate}
        onSend={sendMessage}
      />
    </>
  )
}
