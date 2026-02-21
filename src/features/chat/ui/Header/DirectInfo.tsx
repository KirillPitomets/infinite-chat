import Image from "next/image"

export const DirectInfo = ({
  avatarUrl,
  tag,
  status,
  name
}: {
  avatarUrl: string
  tag: string
  status: string
  name: string
}) => {
  return (
    <>
      <div className="max-w-10.5 max-h-10.5 rounded-4xl bg-gray-600 overflow-hidden flex justify-center align-center">
        <Image
          width={42}
          height={42}
          src={avatarUrl}
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
      </div>
    </>
  )
}