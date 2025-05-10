// components/auth/AutoLogout.tsx
"use client"

import { useEffect } from "react"
import { signOut } from "next-auth/react"
import { toast } from "sonner"

export default function AutoLogout({ timeout = 60 * 1000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      toast.warning("Session expired. Logging you out.")
      signOut()
    }, timeout)

    return () => clearTimeout(timer)
  }, [timeout])

  return null
}
