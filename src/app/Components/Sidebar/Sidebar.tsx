import Image from "next/image";
import Link from "next/link";
import IconButton from "../IconButton/IconButton";

export default function Sidebar() {
  return (
    <aside className="w-100 max-w-13.5 min-h-screen flex flex-col justify-between px-2.75 py-7.5 bg-stone-400/20 ">
      <div className="flex flex-col align-center gap-3">
        <Image width={32} height={32} src="/logo.svg" alt="Infinite chat - logo" />
        <Link href="" className="w-8 h-8 rounded-4xl overflow-hidden flex items-center justify-center">
          {/* TODO: update here user data */}
          <Image width={32} height={32} src="https://dthezntil550i.cloudfront.net/kg/latest/kg1802132010216500004834729/1280_960/557d644f-12f3-49e1-bb66-23c16400540d.png" alt="Username" />
        </Link>

        <div className="w-9 h-px bg-stone-400/50 rounded-2xl"></div>
      </div>

      <div className="flex flex-col gap-5">
        <IconButton iconSrc="/Settings.svg" />
        <IconButton iconSrc="/logout.svg" />
      </div>
    </aside>
  )
}
