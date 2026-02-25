import Image from "next/image"
import Link from "next/link"

import NavMenu from "./NavMenu"
import { ACOOUNT_PAGES } from "@/shared/config/accountPages.config"

import { SignOutButton, UserButton } from "@clerk/nextjs"
import { IconButtonBase } from "@/shared/components/ui/IconButtonBase"
import { LogoutIcon, SettingsIcon } from "@/shared/components/ui/icons"

export default function Sidebar() {
  return (
    <aside className="min-h-screen flex flex-col justify-between px-2.75 py-7.5 bg-stone-400/20 ">
      <div className="flex flex-col items-center justify-center gap-3">
        <Link href={ACOOUNT_PAGES.HOME}>
          <Image
            width={32}
            height={32}
            src="/logo.svg"
            alt="Infinite chat - logo"
          />
        </Link>

        <UserButton
          fallback={<div className="bg-gray-400 w-7 h-7 rounded-2xl" />}
        />

        <div className="h-px w-9 bg-stone-400/50 rounded-2xl"></div>
      </div>

      {/* navbar */}
      <NavMenu />

      <div className="flex flex-col ">
        <IconButtonBase tone="muted">
          <SettingsIcon />
        </IconButtonBase>

        <SignOutButton signOutOptions={{redirectUrl: ACOOUNT_PAGES.HOME}}>
          <IconButtonBase tone="muted">
            <LogoutIcon />
          </IconButtonBase>
        </SignOutButton>
      </div>
    </aside>
  )
}
