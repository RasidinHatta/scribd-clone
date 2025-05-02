// types/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user?: {
      id?: string
      isOauth?: boolean
      twoFactorEnabled?: boolean
      emailVerified?: string | Date | null
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    twoFactorEnabled?: boolean
    emailVerified?: string | Date | null
    isOauth?: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    isOauth?: boolean
    twoFactorEnabled?: boolean
    emailVerified?: string | Date | null
  }
}