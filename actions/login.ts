"use server";

import { signIn } from "@/auth";
import { LoginSchema } from "@/lib/schemas";
import db from "@/prisma/prisma";
import { AuthError } from "next-auth";
import * as z from "zod";

export const login = async (data: z.infer<typeof LoginSchema>) => {
    const validatedData = LoginSchema.parse(data)

    if (!validatedData) {
        return { error: "Invalid input data" }
    }

    const { email, password } = validatedData

    const userExists = await db.user.findFirst({
        where: {
            email
        }
    })

    if (!userExists || !userExists.password || !userExists.email) {
        return { error: "User not found" }
    }

    try {
        await signIn('credentials', {
            email: userExists.email,
            password: password,
            redirectTo: '/'
        })
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.name) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials" }
                default:
                    return { error: "Please confirm your email address" }
            }
        }

        throw error
    }

    return { success: "User logged in successfully!" }
}