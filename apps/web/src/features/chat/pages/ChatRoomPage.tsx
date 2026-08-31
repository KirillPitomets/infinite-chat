"use client"

import { ChatHeader } from "@/features/chat/ui/Header/Header"
import {
  ChatRoom,
  CreateMessageDto,
  Message,
  User
} from "@/shared/types/api.type"
import {
  PropsWithChildren,
  Suspense,
  useEffect,
  useEffectEvent,
  useRef
} from "react"
import { MessageListSkeleton } from "../ui/MessageList/Skeleton"
import { MessageListServer } from "../ui/MessageList/MessageList.server"
import { ChatInputController } from "../ui/Input/InputController"
import { useChatRoomData } from "../chat/api/useChatRoomData"
import { useMessagesSocket } from "../message/providers/socketProvider"
import { useQueryClient } from "@tanstack/react-query"
import { useAuth } from "@clerk/nextjs"
import { Socket } from "socket.io-client"
import { chatKeys } from "../chat/model/chat.keys"
import { useSendMessage } from "../message/api/mutate/useSendMessage"
import { useUpdateMessage } from "../message/api/mutate/useUpdateMessage"
import { MessageList } from "../ui/MessageList/MessageList"
import { useDeleteMessage } from "../message/api/mutate/useDeleteMessage"
import { useRestoreMessage } from "../message/api/mutate/useRestoreMessage"

const MAX_FILES = 4

type ChatRoomPageProps = {
  chatId: string
  chatRoomData: ChatRoom
  initialMessages: Message[]
}

export const ChatRoomPage = ({
  chatId,
  chatRoomData,
  initialMessages
}: ChatRoomPageProps) => {
  // const currentUser = useCurrentUser()
  // =======================================
  // ================ FILES ================
  // =======================================
  // const { files, addFiles, clearFiles, removePreviewFile } = useFiles({
  //   maxFiles: MAX_FILES
  // })
  // const {
  //   previewImage,
  //   isOpenImagePreview,
  //   closePreviewImageDialog,
  //   handleImagePreviewDialog
  // } = usePreviewImageDialog()
  // const { getInputProps, getRootProps, isDragActive, fileRejections } =
  //   useDropzone({
  //     accept: {
  //       "image/jpeg": [],
  //       "image/png": [],
  //       "image/webp": [],
  //       "image/heic": [],
  //       "image/jfif": []
  //     },
  //     noClick: true,
  //     onDrop,
  //     maxFiles: MAX_FILES,
  //     multiple: true
  //   })

  // =======================================
  // ============== Messages ===============
  // =======================================

  // const { mutate: deleteChat } = useDeleteChat(chatId)

  // const onDrop = useCallback(
  //   (acceptedFiles: File[]) => {
  //     addFiles(acceptedFiles)
  //   },
  //   [addFiles]
  // )

  // const handleMessageUpdate = (id: string, value: string) => {
  //   updateMessage({ messageId: id, content: value, files })
  //   clearFiles()
  // }
  // const handleMessageSubmit = ({
  //   content,
  //   replyMessage
  // }: SubmitMessageArgs) => {
  //   sendMessage({ content, files, replyMessage })
  //   clearFiles()
  // }
  // const disenableAllInputStates = () => {
  //   cancelUpdate()
  //   setIsReplyMessage(false)
  // }

  // useRealtimeChat(chatId, currentUser.id)

  // useEffect(() => {
  //   toast.dismissAll()
  // }, [])
  // useEffect(() => {
  //   fileRejections.forEach(file => {
  //     if (file.errors) {
  //       file.errors.forEach(err => toast.error(err.message))
  //     }
  //   })
  // }, [fileRejections, fileRejections.length])

  const messageSocket = useMessagesSocket()
  const queryClient = useQueryClient()
  const {
    handleSendMessage,
    handleReplyMessage,
    isReplyMessage,
    replyMessage,
    clearReplyMessage
  } = useSendMessage(chatId, messageSocket)

  const {
    handleUpdateMessage,
    cancelUpdate,
    editingMessage,
    handleEditingMessage,
    isEditingMessage
  } = useUpdateMessage(chatId, messageSocket)

  const { mutate: handleDeleteMessage } = useDeleteMessage(
    chatId,
    messageSocket
  )

  const { handleRestoreMessage } = useRestoreMessage(chatId, messageSocket)

  useEffect(() => {
    if (!messageSocket) return

    const handleNewMessage = (msg: Message) => {
      console.log("Message created - ", msg)

      queryClient.setQueryData<Message[]>(
        chatKeys.messages(chatId),
        (old = []) => [...old, msg]
      )
    }

    const handleExceptions = (err: any) => console.log(err)

    messageSocket.on("message.created", handleNewMessage)

    messageSocket.on("exception", handleExceptions)
    return () => {
      messageSocket.off("message.created", handleNewMessage)
      messageSocket.off("exception", handleExceptions)
    }
  }, [messageSocket, chatId])

  return (
    <div className="flex flex-col w-full h-full">
      {/* <ImagePreviewDialog
        isOpen={isOpenImagePreview}
        image={previewImage}
        onClose={closePreviewImageDialog}
      /> */}

      <ChatHeader
        chatId={chatId}
        chatName={chatRoomData.name}
        avatarUrl={chatRoomData.avatarUrl}
        type={chatRoomData.type}
        memberships={chatRoomData.memberships}
      />

      {/* <div
        {...getRootProps()}
        className="relative flex flex-col flex-1 min-h-0"
      > */}

      {/* {isDragActive && (
          <div className="absolute inset-0 flex items-center justify-center w-full h-full bg-black/50 z-1001">
            <div className="p-4 border-4 rounded-sm border-black/50">
              <UploadIcon className="w-40 h-40 opacity-60" />
            </div>
          </div>
        )} */}

      <MessageList
        chatId={chatId}
        initialData={initialMessages}
        onUpdate={editingMsg => handleEditingMessage(editingMsg)}
        onReplyToMessage={msg => handleReplyMessage(msg)}
        onDelete={handleDeleteMessage}
        onRestore={handleRestoreMessage}
        selectedMessageId=""
      />

      <div className="relative">
        <ChatInputController
          chatId={chatId}
          replyMessage={replyMessage}
          // previewFiles={files}
          // inputDropZoneProps={getInputProps()}
          mode={
            isEditingMessage ? "edit" : isReplyMessage ? "reply" : undefined
          }
          editingMessage={editingMessage}
          onRemovePreviewFile={() => {}} // removePreviewFile={removePreviewFile}
          onUpdate={(value, files) =>
            handleUpdateMessage({
              text: value,
              attachments: []
            })
          }
          onCancelUpdate={cancelUpdate}
          onCancelReplyToMessage={clearReplyMessage}
          onSubmit={value =>
            handleSendMessage({
              roomId: chatId,
              text: value,
              attachments: [],
              replyToMessageId: replyMessage?.id
            })
          }
        />
      </div>
      {/* </div> */}
    </div>
  )
}
