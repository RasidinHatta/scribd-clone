import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import db from "./prisma/prisma"
import { getUserById } from "./data/user"
import { getAccountByUserId } from "./data/account"
import { getTwoFactorConfirmationByUserId } from "./data/verification-token"

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(db),
    session: {
        strategy: 'jwt',
        maxAge: 20, // 20 seconds
    },
    jwt: {
        maxAge: 20, // 20 seconds
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

            if (existingUser.twoFactorEnabled) {
                const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id)

                console.log(twoFactorConfirmation)
                if (!twoFactorConfirmation) return false

                //delete twoFactorConfirmation
                await db.twoFactorConfirmation.delete({
                    where: {
                        id: twoFactorConfirmation.id
                    }
                })
            }

            return true
        },
        async jwt({ token }) {
            if (!token.sub) return token

            const existingUser = await getUserById(token.sub)
            if (!existingUser) return token

            const existingAccount = await getAccountByUserId(existingUser.id)

            token.isOauth = !!existingAccount
            token.name = existingUser.name
            token.email = existingUser.email
            token.image = existingUser.image
            token.twoFactorEnabled = existingUser.twoFactorEnabled
            token.emailVerified = existingUser.emailVerified

            return token
        },
        async session({ token, session }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.sub,
                    isOauth: token.isOauth,
                    twoFactorEnabled: token.twoFactorEnabled,
                    emailVerified: token.emailVerified,
                    image: token.image as string,
                }
            }
        }
    }
})