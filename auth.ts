import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google"
import { LoginSchema } from "./lib/schemas";
import db from "./prisma/prisma";
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google,
        Credentials({
            credentials: {
                email: {},
                password: {}
            },
            async authorize(credentials) {
                const validatedData = LoginSchema.safeParse(credentials)
                if (!validatedData.success) return null

                const { email, password } = validatedData.data

                const user = await db.user.findFirst({
                    where: {
                        email
                    }
                })
                if (!user || !user.password || !user.email) {
                    return null
                }

                const passwordMatch = await bcrypt.compare(password, user.password)
                if (!passwordMatch) return null

                return user
            }
        })
    ],
    pages: {
        signIn: "/login"
    }
})