"use client"

import { ChatHeader } from "@/features/chat/ui/Header/Header"
import { ChatInputController } from "@/features/chat/ui/Input/InputController"
import { MessageList } from "@/features/chat/ui/MessageList/MessageList"
import { useCurrentUser } from "@/shared/context/CurrentUserContext"
import { useCallback, useState } from "react"
import { useChatData } from "../chat/api/useChatData"
import { useChatRealtime } from "../chat/api/useChatRealtime"
import { useDeleteChat } from "../chat/api/useDeleteChat"
import { useDeleteMessage } from "../message/api/mutate/useDeleteMessage"
import { useGetMessages } from "../message/api/query/useGetMessages"
import { useSendMessage } from "../message/api/mutate/useSendMessage"
import { useUpdateMessage } from "../message/api/mutate/useUpdateMessage"
import ImagePreviewDialog from "@/shared/components/ui/ImagePreviewDialog/ImagePreviewDialog"
import { UIAttachment } from "../message/model/message.types"
import { UploadIcon } from "@/shared/components/ui/icons"
import { useDropzone } from "react-dropzone"
import toast from "react-hot-toast"

export const ChatRoomPage = ({ chatId }: { chatId: string }) => {
  const currentUser = useCurrentUser()
  const [files, setFiles] = useState<File[]>([])
  const [isOpenImagePreview, setIsOpenImagePreview] = useState(false)
  const [previewImage, setPreviewImage] = useState<{
    alt: string
    url: string
  }>({ alt: "", url: "" })
  const [isEditMessage, setIsEditMessage] = useState(false)
  const [editingMessage, setEditingMessage] = useState<{
    id: string
    initialValue: string
    initialAttachments?: UIAttachment[]
  }>({ id: "", initialValue: "" })
  const { data: chatData, isLoading: isChatDataLoading } = useChatData(chatId)
  const { data: messages = [], isLoading } = useGetMessages(chatId)
  const { mutate: sendMessage } = useSendMessage(chatId)
  const { mutate: updateMessage } = useUpdateMessage({
    chatId,
    cancelUpdate: () => onCancelUpdate()
  })
  const { mutate: deleteMessage } = useDeleteMessage(chatId)

  useChatRealtime(chatId, currentUser.id)

  const handleMessageDetails = (
    messageId: string,
    initialValue: string,
    attachments?: UIAttachment[]
  ) => {
    setEditingMessage({
      id: messageId,
      initialValue,
      initialAttachments: attachments
    })
    setIsEditMessage(true)
  }

  const onUpdateMessage = (id: string, value: string, files?: File[]) => {
    updateMessage({
      messageId: id,
      content: value,
      files: files
    })
  }

  const onCancelUpdate = () => {
    setEditingMessage({ id: "", initialValue: "" })
    setIsEditMessage(false)
  }

  const { mutate: deleteChat } = useDeleteChat(chatId)

  const handleImagePreviewDialog = (image: { alt: string; url: string }) => {
    setPreviewImage(image)
    setIsOpenImagePreview(true)
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
          handleUpdate={handleMessageDetails}
          onDelete={deleteMessage}
          onPreviewImage={image => handleImagePreviewDialog(image)}
        />
        <ChatInputController
          previewFiles={files}
          removePreviewFile={filename => {
            setFiles(prev => prev.filter(file => file.name !== filename))
          }}
          inputDropZoneProps={getInputProps()}
          isEdit={isEditMessage}
          editingMessage={editingMessage}
          onUpdate={(id, value) => {
            onUpdateMessage(id, value, files)
            setFiles([])
          }}
          onCancelUpdate={onCancelUpdate}
          onSubmit={content => {
            sendMessage({ content, files })
            setFiles([])
          }}
        />
      </div>
    </div>
  )
}
