"use client"

import { useAuthRedirect } from "@/hooks/useAuthRedirect"


export default function AccountPage() {
  useAuthRedirect()

  return <div>Net work</div>
}
