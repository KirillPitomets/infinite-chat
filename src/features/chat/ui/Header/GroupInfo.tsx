import Image from "next/image"

export const GroupInfo = ({
  avatarUrl,
  name,
  membersCount
}: {
  avatarUrl: string
  name: string
  membersCount: number
}) => {
  return (
    <>
      <div className="max-w-10.5 max-h-10.5 rounded-4xl bg-gray-600 overflow-hidden flex justify-center align-center">
        <Image width={42} height={42} src={avatarUrl} alt={name} />
      </div>
      <div>
        <p className="font-semibold">{name}</p>
        <span className="text-zinc-400">Members: {membersCount}</span>
      </div>
    </>
  )
}

