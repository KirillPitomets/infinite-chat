import {IconButtonBase} from "@/components/ui/IconButtonBase"
import {ChatComponion} from "./ChatComponion"
import {CameraIcon, InformationIcon} from "@/components/ui/icons"

export function ChatHeader() {
  return (
    <header className="flex items-center justify-between p-2.5 border-b border-zinc-300">
      <ChatComponion
        name="Travis Barker"
        status="online"
        img="https://randomuser.me/api/portraits/men/81.jpg"
      />

      <div className="flex space-x-1">
        <IconButtonBase>
          <CameraIcon />
        </IconButtonBase>

        <IconButtonBase tone="muted">
          <InformationIcon />
        </IconButtonBase>
      </div>
      
    </header>
  )
}
