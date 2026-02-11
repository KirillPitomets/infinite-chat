import Home from "@/app/page"
import {edenClient} from "@/lib/eden"
import {useQuery} from "@tanstack/react-query"
import {ReactNode, createContext, useContext} from "react"

type CurrentUserContextType = {
  id: string
  name: string
  imageUrl: string
  tag: string
}

const CurrentUserContext = createContext<CurrentUserContextType | null>(null)

const CurrentUserProvider = ({children}: {children: ReactNode}) => {
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
      <div className="w-full h-screen flex justify-center items-center ">
        <h1 className="font-bold text-2xl animate-pulse">
          Syncing with the server⚙️
        </h1>
      </div>
    )
  }

  if (isError || !user) {
    return <Home />
  }

  const currentUser: CurrentUserContextType = {
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
  const ctx = useContext(CurrentUserContext)
  if (!ctx) {
    throw new Error("useCurrentUser must be used in CurrentUserProvider ")
  }
  return ctx
}
