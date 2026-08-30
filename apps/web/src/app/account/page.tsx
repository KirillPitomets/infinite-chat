import { getCurrentUserServer } from "@/features/user/api/getCurrentUser.server"
import { ChatUserListServer } from "@/shared/components/ChatUserList/ChatUserList.server"
import { ChatUserListSkeleton } from "@/shared/components/ChatUserList/Skeleton"
import { ApiError } from "@/shared/lib/api/unwrap"
import { notFound } from "next/navigation"
import { Suspense } from "react"

export default async function AccountPage() {
  let user

  try {
    user = await getCurrentUserServer()
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      notFound()
    }

    throw err
  }

  return (
    <div className="w-full min-h-screen">
      <div className="flex flex-col items-center justify-center flex-1 w-full h-full space-y-10">
        <h1 className="text-4xl">Welcome, {user.username} ❤️</h1>
        <Suspense fallback={<ChatUserListSkeleton />}>
          <ChatUserListServer />
        </Suspense>
      </div>
    </div>
  )
}
