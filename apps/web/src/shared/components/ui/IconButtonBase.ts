import { cn } from "@/shared/utils/cn"

const toneStyles = {
  primary: "text-green-600",
  muted: "dark:text-zinc-500 text-gray-600/45",
  danger: "dark:text-red-500 text-red-600"
} as const

export function getButtonStyleClass(
  tone: keyof typeof toneStyles,
  isActive?: boolean
) {
  return cn(
    "cursor-pointer p-3 rounded-sm transition-colors hover:bg-green-600 hover:text-white",
    toneStyles[tone],
    isActive && "bg-green-600 text-white dark:text-white"
  )
}
