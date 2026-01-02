import {IconButtonBase} from "@/components/ui/IconButtonBase"
import {CameraIcon, InformationIcon} from "@/components/ui/icons"
import Image from "next/image"

interface IProps {
  img: string
  name: string
  status: "online" | "offline"
}

export function ChatComponion({name, status, img}: IProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="max-w-10.5 max-h-10.5 rounded-4xl bg-gray-600 overflow-hidden flex justify-center align-center">
        <Image width={42} height={42} src={img} alt="Companion" />
      </div>
      <div>
        <p className="font-semibold">{name}</p>
        <span className="text-green-700">{status}</span>
      </div>
    </div>
  )
}
