"use client"
import { useState } from "react"
import { PlayIcon } from "lucide-react"
import { getVideoThumbnailUrl } from "@/shared/utils/cloudinary/getVideoThumbnailUrl"

export function VideoAttachment({ url, name }: { url: string; name: string }) {
  const [isPlaying, setIsPlaying] = useState(false)

  if (isPlaying) {
    return (
      <video
        src={url}
        controls
        autoPlay
        className="w-full h-full rounded-lg"
        onEnded={() => setIsPlaying(false)}
      />
    )
  }

  return (
    <button
      onClick={() => setIsPlaying(true)}
      className="relative w-full h-full group cursor-pointer"
      aria-label={`Play video ${name}`}
    >
      <img
        src={getVideoThumbnailUrl(url)}
        alt={name}
        className="w-full h-full object-cover rounded-lg"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors rounded-lg">
        <PlayIcon className="w-10 h-10 text-white" fill="white" />
      </div>
    </button>
  )
}
