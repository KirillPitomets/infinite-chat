type UserAvatarProps = {
  url: string
  alt: string
  size?: number
}

export const UserAvatar = ({ url, alt, size = 5 }: UserAvatarProps) => {
  return (
    <div className="flex gap-2 items-center">
      <div
        className={`w-${size} h-${size} bg-white-500 flex items-center justify-center rounded-full font-medium text-white overflow-hidden`}
      >
        <img src={url} alt={alt} className="w-full h-full object-cover" />
      </div>
    </div>
  )
}
