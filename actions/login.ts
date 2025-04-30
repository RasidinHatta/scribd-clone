"use server";

import { signIn } from "@/auth";
import { getUserByEmail } from "@/data/user";
import { getTwoFactorConfirmationByUserId, getTwoFactorTokenByEmail } from "@/data/verification-token";
import { sendTwoFactorEmail, sendVerificationEmail } from "@/lib/mail";
import { LoginSchema } from "@/lib/schemas";
import { generateTwoFactorToken, generateVerificationToken } from "@/lib/token";
import db from "@/prisma/prisma";
import { AuthError } from "next-auth";
import * as z from "zod";

export const login = async (data: z.infer<typeof LoginSchema>) => {
    const validatedData = LoginSchema.parse(data)

    if (!validatedData) {
        return { error: "Invalid input data" }
    }

    const { email, password, code } = validatedData

    const user = await getUserByEmail(email);

    if (!user || !user.password || !user.email) {
        return { error: "User not found" }
    }

    if (!user.emailVerified) {
        const verification = await generateVerificationToken(user.email)

        await sendVerificationEmail(
            verification.email,
            verification.token,
        )

        return { success: "New Confirmation Email Sent" }
    }

    if (user.twoFactorEnabled && user.email) {
        if (code) {
            const twoFactorToken = await getTwoFactorTokenByEmail(user.email)

            if (!twoFactorToken) {
                return { error: "Invalid Code!" }
            }

            if (twoFactorToken.token !== code) {
                return { error: "Invalid Code!" }
            }

            const hasExpired = new Date(twoFactorToken.expires) < new Date()

            if (hasExpired) {
                return { error: "Code expired!" }
            }

            await db.twoFactorToken.delete({
                where: {
                    id: twoFactorToken.id
                }
            })

            const existingConfirmation = await getTwoFactorConfirmationByUserId(user.id)

            if (existingConfirmation) {
                await db.twoFactorConfirmation.delete({
                    where: {
                        id: existingConfirmation.id
                    }
                })
            }

            await db.twoFactorConfirmation.create({
                data: {
                    userId: user.id
                }
            })
        } else {
            const twoFactorToken = await generateTwoFactorToken(user.email)

            await sendTwoFactorEmail(
                twoFactorToken.email,
                twoFactorToken.token
            )

            return { twoFactor: true }
        }
    }

    try {
        await signIn("credentials", {
            email: user.email,
            password: password,
            redirectTo: "/",
        })
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.name) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials" };
                default:
                    return { error: "Please confirm yours email address" };
            }
        }

        throw error
    }
    return { success: "User logged in successfully!" }
}

export async function googleAuthenticate() {
    try {
        await signIn('google', { redirectTo: "/" })
    } catch (error) {
        if (error instanceof AuthError) {
            return "google log in failed"
        }
        throw error
    }
}