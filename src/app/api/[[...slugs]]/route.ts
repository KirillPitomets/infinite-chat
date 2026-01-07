import {app} from "@/server/api"

export const GET = app.fetch
export const POST = app.fetch

export type App = typeof app
