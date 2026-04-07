import { treaty } from "@elysiajs/eden"
import type { App } from "@/app/api/[[...slugs]]/route"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

// .api to enter /api prefix
export const edenClient = treaty<App>(BASE_URL || "http://localhost:3000").api
