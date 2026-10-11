import { Loader } from "@/shared/components/ui/Loader"
import { cn } from "@/shared/utils/cn"
import { ButtonHTMLAttributes, PropsWithChildren } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isPending?: boolean
  iconSize?: number
  tone?: "danger" | "fill" | "fill-danger"
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
        "flex items-center justify-center gap-2 p-1 rounded-sm border border-green-600 cursor-pointer hover:bg-green-600 transition-all ",
        {
          "bg-green-600 hover:bg-green-900 hover:border-green-900 ":
            tone === "fill"
        },
        { "border-red-500 hover:bg-red-500": tone === "danger" },
        {
          "border-red-500 bg-red-500 hover:bg-red-900 hover:border-red-900":
            tone === "fill-danger"
        },
        { "border-green-900 hover:bg-green-900 bg-green-900": isPending }
      )}
      {...props}
    >
      {children}
      {isPending && <Loader size={iconSize} />}
    </button>
  )
}
