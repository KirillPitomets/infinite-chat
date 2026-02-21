import Home from "@/app/page"
import { edenClient } from "@/shared/lib/eden"
import { useQuery } from "@tanstack/react-query"
import { ReactNode, createContext, useContext } from "react"
import { User } from "@/shared/types/User.type"

const CurrentUserContext = createContext<User>(null!)

const CurrentUserProvider = ({ children }: { children: ReactNode }) => {
  const {
    data: user,
    isError,
    isLoading
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const res = await edenClient.user.current.get()

      return res.data
    }
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-screen ">
        <h1 className="text-2xl font-bold animate-pulse">
          Syncing with the server <span>⚙️</span>
        </h1>
      </div>
    )
  }

  if (isError || !user) {
    return <Home />
  }

  const currentUser: User = {
    id: user.id,
    imageUrl: user.imageUrl,
    name: user.name,
    tag: user.tag
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      {children}
    </CurrentUserContext.Provider>
  )
}

export default CurrentUserProvider

export const useCurrentUser = () => {
  return useContext(CurrentUserContext)
}
