"use client"
import Image from "next/image"
import Link from "next/link"

import { ACCOUNT_PAGES } from "@/shared/config/accountPages.config"

import { LogoutIcon } from "@/shared/components/ui/icons"
import { useClerk, UserButton } from "@clerk/nextjs"
import { Settings } from "lucide-react"
import NavMenu from "../Navmenu/NavMenu"
import { getButtonStyleClass } from "../ui/IconButtonBase"

export default function Sidebar() {
  const { signOut } = useClerk()
  return (
    <aside className="min-h-screen flex flex-col justify-between px-2.75 py-7.5 bg-stone-400/20 ">
      <div className="flex flex-col items-center justify-center gap-3">
        <Link href={ACCOUNT_PAGES.HOME}>
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

      <NavMenu />

      <div className="flex flex-col ">
        <button className={getButtonStyleClass("primary")}>
          <Settings />
        </button>

        <button
          className={getButtonStyleClass("muted")}
          onClick={() => signOut({ redirectUrl: ACCOUNT_PAGES.HOME })}
        >
          <LogoutIcon />
        </button>
      </div>
    </aside>
  )
}
