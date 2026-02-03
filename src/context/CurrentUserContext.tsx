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
    isLoading,
    isError
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const res = await edenClient.user.current.get()

      return res.data
    }
  })

  if (isLoading) return null

  if (isError || !user) {
    return /*TODO: redirect or render AuthErrorPage */
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
    throw new Error("useCurrentUser must be used within CurrentUserProvider")
  }

  return ctx
}
