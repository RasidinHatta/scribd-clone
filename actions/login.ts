"use server";

import { signIn } from "@/auth";
import { getUserByEmail } from "@/data/user";
import { LoginSchema } from "@/lib/schemas";
import { AuthError } from "next-auth";
import * as z from "zod";

export const login = async (data: z.infer<typeof LoginSchema>) => {
    const validatedData = LoginSchema.parse(data)

    if (!validatedData) {
        return { error: "Invalid input data" }
    }

    const { email, password } = validatedData

    const user = await getUserByEmail(email);

    if (!user || !user.password || !user.email) {
        return { error: "User not found" }
    }

    console.log(user)

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