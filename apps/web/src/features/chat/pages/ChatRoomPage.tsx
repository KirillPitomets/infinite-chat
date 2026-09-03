"use client"

import { ChatHeader } from "@/features/chat/ui/Header/Header"
import { UploadIcon } from "@/shared/components/ui/icons"
import ImagePreviewDialog from "@/shared/components/ui/ImagePreviewDialog/ImagePreviewDialog"
import { useFiles } from "@/shared/hooks/useFiles"
import { usePreviewImageDialog } from "@/shared/hooks/usePreviewImage"
import { ChatRoom, Message } from "@/shared/types/api.type"
import { useCallback, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import toast from "react-hot-toast"
import { useDeleteChat } from "../chat/api/useDeleteChat"
import { useDeleteMessage } from "../message/api/mutate/useDeleteMessage"
import { useRestoreMessage } from "../message/api/mutate/useRestoreMessage"
import { useSendMessage } from "../message/api/mutate/useSendMessage"
import { useUpdateMessage } from "../message/api/mutate/useUpdateMessage"
import { useMessagesSocket } from "../message/providers/socketProvider"
import { useRealtimeChat } from "../realtime/useRealtimeChat"
import { ChatInputController } from "../ui/Input/InputController"
import { MessageList } from "../ui/MessageList/MessageList"
import { useReplyMessage } from "../message/api/hooks/useReplyMessage"
import {
  ACCEPTED_FILE_TYPES,
  fileSizeValidator,
  MAX_FILES
} from "@/shared/lib/dropzone/fileSizeValidator"

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
  const { files, addFiles, clearFiles, removePreviewFile } = useFiles({
    maxFiles: 4
  })

  const {
    previewImage,
    isOpenImagePreview,
    closePreviewImageDialog,
    handleImagePreviewDialog
  } = usePreviewImageDialog()

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      addFiles(acceptedFiles)
    },
    [addFiles]
  )

  const { getInputProps, getRootProps, isDragActive, fileRejections } =
    useDropzone({
      accept: ACCEPTED_FILE_TYPES,
      validator: fileSizeValidator,
      noClick: true,
      onDrop,
      maxFiles: MAX_FILES,
      multiple: true
    })

  const { mutate: deleteChat } = useDeleteChat(chatId)

  const disenableAllInputStates = () => {
    cancelUpdate()
    clearReplyMessage()
  }

  const messageSocket = useMessagesSocket()
  const {
    replyMessage,
    isReplyMessage,
    clearReplyMessage,
    handleReplyMessage
  } = useReplyMessage()

  const { handleSendMessage } = useSendMessage(chatId, messageSocket)

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

  const handleMessageSubmit = (value: string) => {
    handleSendMessage({
      roomId: chatId,
      text: value,
      files,
      replyMessage
    })
    clearFiles()
  }

  const handleMessageUpdateSubmit = (value: string, files?: File[]) => {
    handleUpdateMessage({ text: value })
    clearFiles()
  }

  useEffect(() => {
    toast.dismissAll()
  }, [])

  useEffect(() => {
    fileRejections.forEach(file => {
      if (file.errors) {
        file.errors.forEach(err => toast.error(err.message))
      }
    })
  }, [fileRejections, fileRejections.length])

  useRealtimeChat(chatId, messageSocket)

  return (
    <div className="flex flex-col w-full h-full">
      <ImagePreviewDialog
        isOpen={isOpenImagePreview}
        image={previewImage}
        onClose={closePreviewImageDialog}
      />

      <ChatHeader
        chatId={chatId}
        chatName={chatRoomData.name}
        avatarUrl={chatRoomData.avatarUrl}
        type={chatRoomData.type}
        memberships={chatRoomData.memberships}
      />

      <div
        {...getRootProps()}
        className="relative flex flex-col flex-1 min-h-0"
      >
        {isDragActive && (
          <div className="absolute inset-0 flex items-center justify-center w-full h-full bg-black/50 z-1001">
            <div className="p-4 border-4 rounded-sm border-black/50">
              <UploadIcon className="w-40 h-40 opacity-60" />
            </div>
          </div>
        )}

        <MessageList
          chatId={chatId}
          initialData={initialMessages}
          onUpdate={editingMsg => handleEditingMessage(editingMsg)}
          onReplyToMessage={msg => handleReplyMessage(msg)}
          onDelete={handleDeleteMessage}
          onRestore={handleRestoreMessage}
          onPreviewImage={handleImagePreviewDialog}
          selectedMessageId=""
        />

        <div className="relative">
          <ChatInputController
            chatId={chatId}
            replyMessage={replyMessage}
            previewFiles={files}
            inputDropZoneProps={getInputProps()}
            mode={
              isEditingMessage ? "edit" : isReplyMessage ? "reply" : undefined
            }
            editingMessage={editingMessage}
            onRemovePreviewFile={removePreviewFile}
            onUpdate={handleMessageUpdateSubmit}
            onCancelUpdate={cancelUpdate}
            onCancelReplyToMessage={clearReplyMessage}
            onSubmit={handleMessageSubmit}
          />
        </div>
      </div>
    </div>
  )
}
