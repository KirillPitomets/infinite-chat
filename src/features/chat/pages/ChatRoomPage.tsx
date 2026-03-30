"use client"

import { ChatHeader } from "@/features/chat/ui/Header/Header"
import { ChatInputController } from "@/features/chat/ui/Input/InputController"
import { MessageList } from "@/features/chat/ui/MessageList/MessageList"
import { UploadIcon } from "@/shared/components/ui/icons"
import ImagePreviewDialog from "@/shared/components/ui/ImagePreviewDialog/ImagePreviewDialog"
import { useCurrentUser } from "@/shared/context/CurrentUserContext"
import { useCallback, useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"
import toast from "react-hot-toast"
import { useChatData } from "../chat/api/useChatData"
import { useDeleteChat } from "../chat/api/useDeleteChat"
import { useDeleteMessage } from "../message/api/mutate/useDeleteMessage"
import { useSendMessage } from "../message/api/mutate/useSendMessage"
import { useUpdateMessage } from "../message/api/mutate/useUpdateMessage"
import { useGetMessages } from "../message/api/query/useGetMessages"
import { useRealtimeChat } from "../realtime/useRealtimeChat"
import { ChatTypingBanner } from "../ui/ChatTypingBanner/ChatTypingBanner"

export const ChatRoomPage = ({ chatId }: { chatId: string }) => {
  const currentUser = useCurrentUser()
  const [files, setFiles] = useState<File[]>([])
  const [previewImage, setPreviewImage] = useState<{
    alt: string
    url: string
  }>({ alt: "", url: "" })
  const [isOpenImagePreview, setIsOpenImagePreview] = useState(false)

  const { data: chatData, isLoading: isChatDataLoading } = useChatData(chatId)
  const { data: messages = [], isLoading } = useGetMessages(chatId)
  const {
    mutate: sendMessage,
    setIsReplyMessage,
    isReplyMessage,
    setReplyMessage,
    replyMessage,
    clearReplyMessage
  } = useSendMessage(chatId)

  const {
    updateMessage,
    cancelUpdate,
    editingMessage,
    handleEdditingMessage,
    isEditMessage
  } = useUpdateMessage(chatId)
  const { mutate: deleteMessage } = useDeleteMessage(chatId)
  const { mutate: deleteChat } = useDeleteChat(chatId)

  const handleImagePreviewDialog = (image: { alt: string; url: string }) => {
    setPreviewImage(image)
    setIsOpenImagePreview(true)
  }

  const onUpdateMessage = (id: string, value: string, files?: File[]) => {
    updateMessage({
      messageId: id,
      content: value,
      files: files
    })
  }

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const totalFiles = files.length + acceptedFiles.length

      if (totalFiles > 4) {
        toast.error("You can upload only 4 files")
        return
      }
      console.log("echo upload button")
      setFiles(prev => [...prev, ...acceptedFiles])
    },
    [files]
  )

  const { getInputProps, getRootProps, isDragActive } = useDropzone({
    noClick: true,
    onDrop,
    maxFiles: 4,
    multiple: true
  })

  useRealtimeChat(chatId, currentUser.id)

  useEffect(() => {
    toast.dismissAll()
  }, [])

  return (
    <div className="flex flex-col w-full h-full">
      <ImagePreviewDialog
        isOpen={isOpenImagePreview}
        image={previewImage}
        onClose={() => setIsOpenImagePreview(false)}
      />
      <ChatHeader
        chatId={chatId}
        chatData={
          chatData?.type === "DIRECT"
            ? {
                type: "DIRECT",
                otherUser: chatData.otherUser
              }
            : chatData?.type === "GROUP"
              ? {
                  ...chatData
                }
              : undefined
        }
        onDelete={() => deleteChat()}
        isLoading={isChatDataLoading}
      />

      <div
        {...getRootProps()}
        className="relative flex flex-col flex-1 min-h-0"
      >
        {isDragActive && (
          <div className="absolute inset-0 flex items-center justify-center w-full h-full bg-black/50 z-1001">
            <div className="p-4 border-4 rounded-xl border-black/50">
              <UploadIcon className="w-40 h-40 opacity-60" />
            </div>
          </div>
        )}

        <MessageList
          chatId={chatId}
          currentUser={currentUser}
          isLoading={isLoading}
          messages={messages}
          isEditMessage={isEditMessage}
          isReplyToMessage={isReplyMessage}
          handleUpdate={(id, value, attachments) =>
            handleEdditingMessage({
              id,
              initialValue: value,
              initialAttachments: attachments
            })
          }
          handleReplyToMessage={replyMessage => {
            setIsReplyMessage(true)
            setReplyMessage(replyMessage)
          }}
          onDelete={deleteMessage}
          onPreviewImage={image => handleImagePreviewDialog(image)}
        />

        <div className="relative">
          <div className="absolute left-0 bottom-full">
            <ChatTypingBanner chatId={chatId} />
          </div>
          <ChatInputController
            chatId={chatId}
            replyMessage={replyMessage}
            previewFiles={files}
            mode={isEditMessage ? "edit" : isReplyMessage ? "reply" : undefined}
            removePreviewFile={filename => {
              setFiles(prev => prev.filter(file => file.name !== filename))
            }}
            inputDropZoneProps={getInputProps()}
            editingMessage={editingMessage}
            onUpdate={(id, value) => {
              onUpdateMessage(id, value, files)
              setFiles([])
            }}
            onCancelUpdate={cancelUpdate}
            onCancelReplyToMessage={clearReplyMessage}
            onSubmit={({ content, replyMessage }) => {
              sendMessage({ content, files, replyMessage })
              setFiles([])
            }}
          />
        </div>
      </div>
    </div>
  )
}
