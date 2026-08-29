"use client"

// import { useChatData } from "@/features/chat/chat/api/useChatData"
import { useDeleteChat } from "@/features/chat/chat/api/useDeleteChat"
import { useDeleteMessage } from "@/features/chat/message/api/mutate/useDeleteMessage"
import {
  SubmitMessageArgs,
  useSendMessage
} from "@/features/chat/message/api/mutate/useSendMessage"
import { useUpdateMessage } from "@/features/chat/message/api/mutate/useUpdateMessage"
import { useRealtimeChat } from "@/features/chat/realtime/useRealtimeChat"
import { ChatHeader } from "@/features/chat/ui/Header/Header"
import { ChatInputController } from "@/features/chat/ui/Input/InputController"
import { MessageList } from "@/features/chat/ui/MessageList/MessageList"
import { useCurrentUser } from "@/features/user/hooks/useCurrentUser"
import { UploadIcon } from "@/shared/components/ui/icons"
import ImagePreviewDialog from "@/shared/components/ui/ImagePreviewDialog/ImagePreviewDialog"
import { useFiles } from "@/shared/hooks/useFiles"
import { usePreviewImageDialog } from "@/shared/hooks/usePreviewImage"
import { ChatRoom, User } from "@/shared/types/api.type"
import { useQuery } from "@tanstack/react-query"
import { Suspense, useCallback, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import toast from "react-hot-toast"

const MAX_FILES = 4

/*
1. current user  
2. useFiles 

*/

type ChatRoomPageProps = {
  chatId: string
  chatRoomData: ChatRoom
}

export const ChatRoomPage = ({ chatId, chatRoomData }: ChatRoomPageProps) => {
  const currentUser = useCurrentUser()
  // return <div>Chat room with ID: {chatId}</div>
  // const currentUser = useCurrentUser()
  // const { files, addFiles, clearFiles, removePreviewFile } = useFiles({
  //   maxFiles: MAX_FILES
  // })
  // const {
  //   previewImage,
  //   isOpenImagePreview,
  //   closePreviewImageDialog,
  //   handleImagePreviewDialog
  // } = usePreviewImageDialog()
  // const { data: chatData, isLoading: isChatDataLoading } = useChatData(chatId)
  // const {
  //   mutate: sendMessage,
  //   setIsReplyMessage,
  //   isReplyMessage,
  //   setReplyMessage,
  //   replyMessage,
  //   clearReplyMessage
  // } = useSendMessage(chatId)
  // const {
  //   updateMessage,
  //   cancelUpdate,
  //   editingMessage,
  //   handleEditingMessage,
  //   isEditMessage
  // } = useUpdateMessage(chatId)1
  // const { mutate: deleteMessage } = useDeleteMessage(chatId)
  // const { mutate: deleteChat } = useDeleteChat(chatId)
  // const onDrop = useCallback(
  //   (acceptedFiles: File[]) => {
  //     addFiles(acceptedFiles)
  //   },
  //   [addFiles]
  // )
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
  // // useRealtimeChat(chatId, currentUser.id)
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
        onDelete={() => {}}
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
      {/* <MessageList
          chatId={chatId}
          selectedMessageId={editingMessage.id || replyMessage?.id}
          currentUser={currentUser}
          otherUserLastReadAt={
            chatData?.type === "DIRECT"
              ? chatData.otherUser.lastReadAt
              : undefined
          }
          handleUpdate={editingMessage => {
            disenableAllInputStates()
            handleEditingMessage(editingMessage)
          }}
          handleReplyToMessage={replyMessage => {
            disenableAllInputStates()
            setIsReplyMessage(true)
            setReplyMessage(replyMessage)
          }}
          onDelete={deleteMessage}
          onPreviewImage={handleImagePreviewDialog}
        />
        <div className="relative">
          <ChatInputController
            chatId={chatId}
            replyMessage={replyMessage}
            previewFiles={files}
            mode={isEditMessage ? "edit" : isReplyMessage ? "reply" : undefined}
            removePreviewFile={removePreviewFile}
            inputDropZoneProps={getInputProps()}
            editingMessage={editingMessage}
            onUpdate={handleMessageUpdate}
            onCancelUpdate={cancelUpdate}
            onCancelReplyToMessage={clearReplyMessage}
            onSubmit={handleMessageSubmit}
          />
        </div> */}
      {/* </div> */}
    </div>
  )
}
