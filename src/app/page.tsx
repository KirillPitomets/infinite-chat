import {authServer} from "@/lib/auth/server"
import Link from "next/link"
import {AUTH_PAGES} from "@/config/authPages.config"

export default async function Home() {
  const {data} = await authServer.getSession()

  if (data && data.user) {
    return (
      <div className="flex flex-col gap-2 min-h-screen items-center justify-center bg-gray-900">
        <h1 className="mb-4 text-4xl">
          Logged in as{" "}
          <span className="font-bold underline">{data.user.name}</span>
        </h1>
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-2 min-h-screen items-center justify-center bg-gray-900">
      <h1 className="mb-4 text-4xl font-bold">Not logged in</h1>
      <div className="flex item-center gap-2">
        <Link
          href={AUTH_PAGES.SIGN_UP}
          className="inline-flex text-lg text-indigo-400 hover:underline"
        >
          Sign-up
        </Link>
        <Link
          href={AUTH_PAGES.SIGN_IN}
          className="inline-flex text-lg text-indigo-400 hover:underline"
        >
          Sign-in
        </Link>
      </div>
    </div>
  )
}
