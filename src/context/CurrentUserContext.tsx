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
  const {data: user} = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const res = await edenClient.user.current.get()

      return res.data
    }
  })

  const currentUser: CurrentUserContextType | null = user
    ? {
        id: user.id,
        imageUrl: user.imageUrl,
        name: user.name,
        tag: user.tag
      }
    : null

  return (
    <CurrentUserContext.Provider value={currentUser}>
      {children}
    </CurrentUserContext.Provider>
  )
}

export default CurrentUserProvider

export const useCurrentUser = () => {
  const ctx = useContext(CurrentUserContext)
  return ctx
}
