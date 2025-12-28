"use client"

import {usePathname} from "next/navigation"
import {navItems} from "./navItems.data"
import NavLink from "./NavLink"

export default function NavMenu() {
  const pathname = usePathname()

  return (
    <div className="space-y-5">
      {navItems.map(item => (
        <NavLink
          key={item.href}
          href={item.href}
          isActive={pathname.startsWith(item.href)}
        >
          <item.icon />
        </NavLink>
      ))}
    </div>
  )
}
