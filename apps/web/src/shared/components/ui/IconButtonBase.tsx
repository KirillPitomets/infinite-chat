import { FC } from "react"

interface Props {
  children?: React.ReactNode
  isActive?: boolean
  tone?: "primary" | "muted"
  size?: number
}

export const IconButtonBase: FC<Props> = ({
  isActive,
  tone = "primary",
  size = 4.5,
  children
}) => {
  return (
    <div
      className={`
        flex justify-center items-center cursor-pointer
        ${tone === "primary" ? "text-green-600" : "dark:text-zinc-500 text-gray-600/45 "}
        ${isActive && "bg-green-600 text-white"}
        p-3 rounded-2xl transition-colors hover:bg-green-600 hover:text-white`}
    >
      <div className={`size-${size} flex items-center justify-center`}>
        {children}
      </div>
    </div>
  )
}
