"use client"

import { useAuthRedirect } from "@/shared/hooks/useAuthRedirect"


export default function AccountPage() {
  useAuthRedirect()

  return <div>Net work</div>
}
