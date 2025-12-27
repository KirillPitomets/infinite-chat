import { ChatComponion } from "./ChatComponion";

export function ChatHeader() {
  return (
    <div className="p-10 border-b border-stone-300 flex items-center justify-between fixed top-0 left-0 right-0">
      <ChatComponion name="Travis Barker" status="online" img="https://dthezntil550i.cloudfront.net/kg/latest/kg1802132010216500004834729/1280_960/557d644f-12f3-49e1-bb66-23c16400540d.png" />

    </div>  
  )
}
