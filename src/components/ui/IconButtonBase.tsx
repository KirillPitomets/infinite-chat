import {FC} from "react"

interface Props {
  children?: React.ReactNode
  isActive?: boolean
  tone?: "primary" | "muted"
  width?: number
  height?: number
}

export const IconButtonBase: FC<Props> = ({
  isActive,
  tone = "primary",
  width = 4.5,
  height = 4.5,
  children
}) => {
  return (
    <div
      className={`
        flex justify-center items-center cursor-pointer
        ${tone === "primary" ? "text-green-600" : "text-gray-600/45"}
        ${isActive && "bg-green-600 text-white"}
        p-3 rounded-2xl transition-colors hover:bg-green-600 hover:text-white`}
    >
      <div
        className={`w-${width} h-${height} flex items-center justify-center`}
      >
        {children}
      </div>
    </div>
  )
}
