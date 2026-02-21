/*
  Matches simple routes to determine active navigation state
  Supported routes:
  - /account
  - /account/event
  - /account/chat
  - /account/chat/:chatId

  Rules: 
  - For first-level routes (/account), compare the first path segment
  - For nested routes, compare second path segment
*/

export const matchRoute = (pathname: string, href: string): boolean => {
  const splitedPathname = pathname.split("/")
  const splitedHref = href.split("/")

  if (splitedPathname.length == 2 && splitedHref.length == 2) {
    return splitedPathname[1] == splitedHref[1]
  }

  if (splitedPathname.length >= 3) {
    return splitedPathname[2] === splitedHref[2]
  }

  return false
}
