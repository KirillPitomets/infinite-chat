import { Loader } from "@/shared/components/ui/Loader"
import { cn } from "@/shared/utils/cn"
import { HTMLAttributes, PropsWithChildren } from "react"

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  isPending?: boolean
  iconSize?: number
  tone?: "danger"
}

export const Button = ({
  isPending,
  children,
  iconSize = 13,
  tone,
  ...props
}: PropsWithChildren<ButtonProps>) => {
  return (
    <button
      className={cn(
        "flex items-center justify-center gap-2 p-1 rounded-sm border hover:bg-green-600 cursor-pointer border-green-600",
        { "border-red-500 hover:bg-red-500": tone === "danger" },
        { "border-green-900 hover:bg-green-900 bg-green-900": isPending }
      )}
      {...props}
    >
      {children}
      {isPending && <Loader size={iconSize} />}
    </button>
  )
}
