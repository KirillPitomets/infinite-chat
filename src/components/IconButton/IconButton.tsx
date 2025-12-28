import Image from "next/image"

interface Props {
  iconSrc: string
  handle?: <T = unknown, R = unknown>(args: T) => R
}

export default function IconButton({handle, iconSrc}: Props) {
  return (
    <button
      onClick={handle}
      className="flex align-center justify-center cursor-pointer "
    >
      <Image width={26} height={26} src={iconSrc} alt="" />
    </button>
  )
}
