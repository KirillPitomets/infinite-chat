import { useEffect, useState } from "react"
import { CrossIcon, LightIcon } from "../icons"
import Link from "next/link"
import { useRouter } from "next/navigation"

type NotificationAlertProps = {
  title: string
  linkTo?: string
  message: string
  handleCloseNotification: () => void
}

export const NotificationAlert = ({
  title,
  message,
  linkTo,
  handleCloseNotification
}: NotificationAlertProps) => {
  const [stage, setStage] = useState<"intro" | "idle">("intro")

  const router = useRouter()

  const handleRoute = () => {
    if (linkTo) {
      router.replace(linkTo)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setStage("idle")
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      onContextMenu={e => {
        e.preventDefault()
        e.stopPropagation()
        handleCloseNotification()
      }}
      className="flex flex-col items-end p-4 pt-2 border border-green-400 bg-background rounded-sm"
    >
      <button
        className="p-1 cursor-pointer hover:opacity-70"
        onClick={handleCloseNotification}
      >
        <CrossIcon className="text-red-500 size-3" />
      </button>

      <div
        key={`${Date.now}-notification-alert`}
        onClick={handleRoute}
        className={`relative transition-all ${linkTo && "hover:opacity-60 cursor-pointer"}`}
      >
        <div className="flex items-center gap-3 animate-shake">
          <LightIcon
            className={`size-10 ${
              stage === "intro" ? "animate-light-pulse" : "animate-shake"
            }`}
          />

          <div>
            <p>{title}</p>
            <p className="text-sm opacity-80">{message}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
