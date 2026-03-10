import { ACСOOUNT_PAGES } from "@/shared/config/accountPages.config"
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
    href: ACСOOUNT_PAGES.HOME
  },
  {
    icon: MessageIcon,
    alt: "Chats",
    href: ACСOOUNT_PAGES.CHAT
  },
  {
    icon: CameraIcon,
    alt: "Events",
    href: ACСOOUNT_PAGES.MEETINGS
  },
  {
    icon: NoteIcon,
    alt: "Music",
    href: ACСOOUNT_PAGES.MUSIC
  },
  {
    icon: CalendarIcon,
    alt: "date",
    href: ACСOOUNT_PAGES.EVENTS
  }
]
