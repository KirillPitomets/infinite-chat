"use client"

import {usePathname} from "next/navigation"
import {navItems} from "./navItems.data"
import Link from "next/link"
import IconButton from "../ui/IconButton/IconButton"

export default function NavMenu() {
  const pathname = usePathname()

  return (
    <div className="space-y-2">
      {navItems.map(item => (
        <Link className="block" key={item.href} href={item.href}>
          <IconButton
            isActive={pathname.split("/")[1] === item.href.split("/")[1]}
          >
            <item.icon />
          </IconButton>
        </Link>
      ))}
    </div>
  )
}
