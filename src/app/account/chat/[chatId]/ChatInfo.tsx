import Image from "next/image"

interface IProps {
  imgUrl: string
  name: string
  tag?: string
  status?: "online" | "offline"
  membersCount?: number
}

export function ChatInfo({name, status, imgUrl, tag, membersCount}: IProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="max-w-10.5 max-h-10.5 rounded-4xl bg-gray-600 overflow-hidden flex justify-center align-center">
        <Image
          width={42}
          height={42}
          src={imgUrl}
          alt={tag ? `${name} - ${tag}` : `${name}`}
        />
      </div>

      <div>
        <p className="font-semibold">{name}</p>
        <span
          className={`${status === "online" ? "text-green-700" : "text-zinc-400"}`}
        >
          {status}
        </span>
        {membersCount && (
          <>
            <span className="text-zinc-500">Members: {membersCount}</span>
          </>
        )}
      </div>
    </div>
  )
}
