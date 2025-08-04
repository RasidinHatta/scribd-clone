"use client"

import { signOut } from "next-auth/react"

/**
 * SignOutButton Component
 * 
 * A button that handles user sign-out functionality.
 * 
 * Features:
 * - Triggers NextAuth's signOut function when clicked
 * - Styled with hover effects and color transitions
 * - Uses destructive red coloring to indicate sign-out action
 * - Full width with proper padding and alignment
 * 
 * Usage:
 * - Should be used in dropdown menus or navigation bars
 * - Works with NextAuth.js authentication flow
 */
export function SignOutButton() {
  return (
    <button
      className="w-full text-sm text-left pl-2 py-1 text-red-500 hover:bg-muted hover:text-red-600 transition-colors rounded"
      onClick={() => {
        // Call NextAuth's signOut function
        // This will clear the session and redirect to the login page
        signOut()
      }}
    >
      Sign Out
    </button>
  )
}