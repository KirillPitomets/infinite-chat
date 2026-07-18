"use client"

import { LogoIcon } from "@/shared/components/ui/icons"

export const ChatEmptyState = () => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center ">
      <LogoIcon className="w-full h-full opacity-10" />
    </div>
  )
}
