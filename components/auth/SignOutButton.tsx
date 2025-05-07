// app/components/auth/SignOutButton.tsx
"use client"

import { signOut } from "next-auth/react"

export function SignOutButton() {
  return <button className="w-full text-sm text-left pl-2 text-red-500" onClick={() => signOut()}>Sign Out</button>
}
