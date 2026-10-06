"use client"

import { matchRoute } from "@/shared/utils/matchRoute"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { getButtonStyleClass } from "../ui/IconButtonBase"
import { navItems } from "./navItems.data"

export default function NavMenu() {
  const pathname = usePathname()

  return (
    <div className="space-y-2">
      {navItems.map(item => (
        <Link
          className="relative block"
          key={item.href}
          href={item.href}
          style={item.isDisabled ? { pointerEvents: "none" } : undefined}
        >
          <button
            className={getButtonStyleClass(
              "primary",
              matchRoute(pathname, item.href),
              item.isDisabled
            )}
            disabled={item.isDisabled}
          >
            <item.icon />
          </button>
        </Link>
      ))}
    </div>
  )
}
