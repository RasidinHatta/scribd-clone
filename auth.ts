import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import db from "./prisma/prisma"
import { getUserById } from "./data/user"
import { getAccountByUserId } from "./data/account"

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(db),
    session: {
        strategy: 'jwt',
    },
    ...authConfig,
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider !== 'credentials') {
                return true
            }

            if (!user.id) return false
            const existingUser = await getUserById(user.id)

            if (!existingUser?.emailVerified) {
                return false
            }

            return true
        },
        async jwt({ token }) {
            if (!token.sub) return token

            const existingUser = await getUserById(token.sub)
            if (!existingUser) return token

            const existingAccount = await getAccountByUserId(existingUser.id)

            token.isOauth = !!existingAccount
            token.namee = existingUser.name
            token.email = existingUser.email
            token.image = existingUser.image

            return token
        },
        async session({ token, session }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.sub,
                    isOauth: token.isOauth,
                }
            }
        },
    }
})