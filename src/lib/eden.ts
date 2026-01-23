import {treaty} from "@elysiajs/eden"
import type {App} from "@/app/api/[[...slugs]]/route"

// .api to enter /api prefix
export const edenClient = treaty<App>("http://localhost:3000").api

