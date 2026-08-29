import { ChatPage } from "@/features/chat/"

type ChatPageParams = { params: Promise<{ chatId: string }> }

export default async function Page({ params }: ChatPageParams) {
  const { chatId } = await params
  return <ChatPage chatId={chatId} />
}
