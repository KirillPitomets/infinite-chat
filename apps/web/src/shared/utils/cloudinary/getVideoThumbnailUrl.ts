export function getVideoThumbnailUrl(videoUrl: string): string {
  return videoUrl
    .replace("/video/upload/", "/video/upload/so_0/")
    .replace(/\.\w+$/, ".jpg")
}
