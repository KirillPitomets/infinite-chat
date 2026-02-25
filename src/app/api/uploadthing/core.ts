import { getAuth } from "@clerk/nextjs/server"
import { createUploadthing, type FileRouter } from "uploadthing/next"
import { UploadThingError } from "uploadthing/server"

const f = createUploadthing()

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1
    }
  })
    .middleware(async ({ req }) => {
      const user = getAuth(req)

      if (!user) {
        throw new UploadThingError("Unauthorized")
      }

      return { userId: user.userId }
    })
    .onUploadComplete(async ({ metadata }) => {
      return { uploadedBy: metadata.userId }
    })
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
