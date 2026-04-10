import { IconButtonBase } from "../ui/IconButtonBase"

export const ChatUserListSkeleton = () => {
  return (
    <ul className="w-full max-w-[400px]">
      {Array.from({ length: 5 }).map((_, indx) => (
        <li
          key={`ChatUserList-${indx}`}
          className="flex items-center justify-between p-2 border-b border-zinc-400"
        >
          <div className="flex gap-2 items-center">
            <div className="w-7 h-7 bg-zinc-400 rounded-full animate-pulse"></div>
            <span className="w-20 h-5 bg-zinc-400 rounded-sm animate-pulse"></span>
          </div>
          <span className="w-20 h-5 bg-zinc-400 rounded-sm animate-pulse"></span>

          <IconButtonBase>
            <button className="w-20 h-5 bg-zinc-400 rounded-sm animate-pulse" />
          </IconButtonBase>
        </li>
      ))}
    </ul>
  )
}
