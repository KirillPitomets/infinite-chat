type UserAvatarProps = {
  alt: string
  url?: string
  size?: number
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map(part => part[0].toUpperCase() + ".")
    .join("")
}

export const UserAvatar = ({ url, alt, size = 5 }: UserAvatarProps) => {
  return (
    <div className="flex gap-2 items-center">
      <div
        style={{ backgroundColor: "var(--foreground)" }}
        className={`w-${size} h-${size} flex items-center justify-center rounded-full font-medium text-white overflow-hidden`}
      >
        {url ? (
          <img src={url} alt={alt} className="w-full h-full object-cover" />
        ) : (
          <p className="dark:text-zinc-800 font-bold">{getInitials(alt)}</p>
        )}
      </div>
    </div>
  )
}
