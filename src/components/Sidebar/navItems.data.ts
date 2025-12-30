import {PAGES} from "@/config/pages.config"
import {CameraIcon, MessageIcon, NetworkIcon, NoteIcon} from "../ui/icons"
import {CalendarIcon} from "../ui/icons/CalendarIcon"

export const navItems = [
  {
    icon: NetworkIcon,
    alt: "Network",
    href: PAGES.HOME
  },
  {
    icon: MessageIcon,
    alt: "Chats",
    href: PAGES.CHAT
  },
  {
    icon: CameraIcon,
    alt: "Events",
    href: PAGES.MEETINGS
  },
  {
    icon: NoteIcon,
    alt: "Music",
    href: PAGES.MUSIC
  },
  {
    icon: CalendarIcon,
    alt: "date",
    href: PAGES.EVENTS
  }
]
