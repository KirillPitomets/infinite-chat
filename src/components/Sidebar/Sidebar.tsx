import {IconButtonBase} from "@/components/ui/IconButtonBase"
import Image from "next/image"
import Link from "next/link"

import NavMenu from "./NavMenu"
import {PAGES} from "@/config/pages.config"
import {SettingsIcon} from "../ui/icons/SettingsIcon"
import {LogoutIcon} from "../ui/icons/LogoutIcon"

export default function Sidebar() {
  return (
    <aside className="min-h-screen flex flex-col justify-between px-2.75 py-7.5 bg-stone-400/20 ">
      <div className="flex flex-col align-center gap-3">
        <Link href={PAGES.HOME}>
          <Image
            width={32}
            height={32}
            src="/logo.svg"
            alt="Infinite chat - logo"
          />
        </Link>

        {/* TODO: LINK TO USER PROFILE PAGE */}
        <Link
          href=""
          className="w-8 h-8 overflow-hidden flex items-center justify-center"
        >
          <Image
            className="rounded-full w-8 h-8"
            width={32}
            height={32}
            src="https://randomuser.me/api/portraits/men/6.jpg"
            alt="photo"
          />
        </Link>

        <div className="w-9 h-px bg-stone-400/50 rounded-2xl"></div>
      </div>

      {/* navbar */}
      <NavMenu />

      <div className="flex flex-col ">
        <IconButtonBase tone="muted">
          <SettingsIcon />
        </IconButtonBase>

        <IconButtonBase tone="muted">
          <LogoutIcon />
        </IconButtonBase>
      </div>
    </aside>
  )
}
