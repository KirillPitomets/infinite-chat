export type CloudinaryUploadResponse = {
  asset_id: string
  public_id: string
  version: number
  version_id: string
  signature: string
  width: number
  height: number
  format: string
  resource_type: "image" | "video" | "raw"
  created_at: string
  tags: string[]
  bytes: number
  type: "upload"
  etag: string
  placeholder: boolean
  url: string
  secure_url: string
  asset_folder: string
  display_name: string
  existing: boolean
  original_filename: string
  api_key: string
}
