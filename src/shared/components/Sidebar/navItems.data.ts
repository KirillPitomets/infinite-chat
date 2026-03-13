import { ACCOUNT_PAGES } from "@/shared/config/accountPages.config"
import {
  CalendarIcon,
  CameraIcon,
  MessageIcon,
  NetworkIcon,
  NoteIcon
} from "@/shared/components/ui/icons"

export const navItems = [
  {
    icon: NetworkIcon,
    alt: "Network",
    href: ACCOUNT_PAGES.HOME
  },
  {
    icon: MessageIcon,
    alt: "Chats",
    href: ACCOUNT_PAGES.CHAT
  },
  {
    icon: CameraIcon,
    alt: "Events",
    href: ACCOUNT_PAGES.MEETINGS
  },
  {
    icon: NoteIcon,
    alt: "Music",
    href: ACCOUNT_PAGES.MUSIC
  },
  {
    icon: CalendarIcon,
    alt: "date",
    href: ACCOUNT_PAGES.EVENTS
  }
]
