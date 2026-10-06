import { ACCOUNT_PAGES } from "@/shared/config/accountPages.config"
import {
  CalendarIcon,
  CameraIcon,
  MessageIcon,
  NetworkIcon,
  NoteIcon
} from "@/shared/components/ui/icons"
import { SVGProps } from "react"

export type navItem = {
  id: "network" | "chats" | "meetings" | "music" | "calendar"
  icon: (props: SVGProps<SVGSVGElement>) => React.JSX.Element
  alt: string
  href: string
  isDisabled: boolean
}

export const navItems: navItem[] = [
  {
    id: "network",
    icon: NetworkIcon,
    alt: "Network",
    href: ACCOUNT_PAGES.HOME,
    isDisabled: false
  },
  {
    id: "chats",
    icon: MessageIcon,
    alt: "Chats",
    href: ACCOUNT_PAGES.CHAT,
    isDisabled: false
  },
  {
    id: "meetings",
    icon: CameraIcon,
    alt: "Events",
    href: ACCOUNT_PAGES.MEETINGS,
    isDisabled: true
  },
  {
    id: "music",
    icon: NoteIcon,
    alt: "Music",
    href: ACCOUNT_PAGES.MUSIC,
    isDisabled: true
  },
  {
    id: "calendar",
    icon: CalendarIcon,
    alt: "date",
    href: ACCOUNT_PAGES.EVENTS,
    isDisabled: true
  }
]
