import { ChatPage } from "@/features/chat/"
import { getChatRoomData } from "@/features/chat/chat/api/getChatRoomData.server"
import { ChatRoomPage } from "@/features/chat/pages/ChatRoomPage"
import { MessageListServer } from "@/features/chat/ui/MessageList/MessageList.server"
import { MessageListSkeleton } from "@/features/chat/ui/MessageList/Skeleton"
import { Suspense } from "react"

type ChatPageParams = { params: Promise<{ chatId: string }> }

export default async function Page({ params }: ChatPageParams) {
  const { chatId } = await params
  const room = await getChatRoomData(chatId)
  return (
    <ChatRoomPage chatId={chatId} chatRoomData={room}>
      <Suspense fallback={<MessageListSkeleton />}>
        <MessageListServer
          chatId={chatId}
          // selectedMessageId={editingMessage.id || replyMessage?.id}
          // currentUser={currentUser}
          // otherUserLastReadAt={
          //   chatData?.type === "DIRECT"
          //     ? chatData.otherUser.lastReadAt
          //     : undefined
          // }
          // handleUpdate={editingMessage => {
          //   disenableAllInputStates()
          //   handleEditingMessage(editingMessage)
          // }}
          // handleReplyToMessage={replyMessage => {
          //   disenableAllInputStates()
          //   setIsReplyMessage(true)
          //   setReplyMessage(replyMessage)
          // }}
          // onDelete={deleteMessage}
          // onPreviewImage={handleImagePreviewDialog}
        />
      </Suspense>
    </ChatRoomPage>
  )
}
