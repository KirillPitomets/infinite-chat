import {neonAuthMiddleware} from "@neondatabase/auth/next/server"
import {AUTH_PAGES} from "./config/authPages.config"

export default neonAuthMiddleware({
  // Redirects unauthenticated users to sign-in page
  loginUrl: AUTH_PAGES.SIGN_IN
})

export const config = {
  matcher: [
    // Protected routes requiring authentication
    "/account/:path*"
  ]
}
