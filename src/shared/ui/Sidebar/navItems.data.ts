import {ACOOUNT_PAGES} from "@/shared/config/accountPages.config"
import {CameraIcon, MessageIcon, NetworkIcon, NoteIcon} from "@/shared/ui/icons"
import {CalendarIcon} from "@/shared/ui/icons/CalendarIcon"

export const navItems = [
  {
    icon: NetworkIcon,
    alt: "Network",
    href: ACOOUNT_PAGES.HOME
  },
  {
    icon: MessageIcon,
    alt: "Chats",
    href: ACOOUNT_PAGES.CHAT
  },
  {
    icon: CameraIcon,
    alt: "Events",
    href: ACOOUNT_PAGES.MEETINGS
  },
  {
    icon: NoteIcon,
    alt: "Music",
    href: ACOOUNT_PAGES.MUSIC
  },
  {
    icon: CalendarIcon,
    alt: "date",
    href: ACOOUNT_PAGES.EVENTS
  }
]
