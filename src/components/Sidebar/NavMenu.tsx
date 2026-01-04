"use client"

import {usePathname} from "next/navigation"
import {navItems} from "./navItems.data"
import Link from "next/link"
import {IconButtonBase} from "../ui/IconButtonBase"
import {matchRoute} from "@/utils/matchRoute"

export default function NavMenu() {
  const pathname = usePathname()

  return (
    <div className="space-y-2">
      {navItems.map(item => (
        <Link className="block" key={item.href} href={item.href}>
          <IconButtonBase isActive={matchRoute(pathname, item.href)}>
            <item.icon />
          </IconButtonBase>
        </Link>
      ))}
    </div>
  )
}
