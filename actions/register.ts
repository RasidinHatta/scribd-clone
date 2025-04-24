"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { RegisterSchema } from "@/lib/schemas";
import db from "@/prisma/prisma";
import { signIn } from "@/auth"; // use server-side signIn from auth.js

export const register = async (data: z.infer<typeof RegisterSchema>) => {
  try {
    const validatedData = RegisterSchema.parse(data);

    const { email, name, password, passwordConfirmation } = validatedData;

    if (password !== passwordConfirmation) {
      return { error: "Passwords do not match" };
    }

    const lowerCaseEmail = email.toLowerCase();
    const hashedPassword = await bcrypt.hash(password, 10);

    const userExists = await db.user.findFirst({
      where: { email: lowerCaseEmail },
    });

    if (userExists) {
      return { error: "Email already is in use. Please try another one." };
    }

    const user = await db.user.create({
      data: {
        email: lowerCaseEmail,
        name,
        password: hashedPassword,
      },
    });

    // 🟢 Automatically log the user in after registration
    await signIn("credentials", {
      email: lowerCaseEmail,
      password,
      redirect: false, // Prevent immediate redirect — let form action handle that
    });

    return { success: "Registered and logged in!" };
  } catch (error) {
    console.error("Register error:", error);

    if ((error as { code: string }).code === "ETIMEDOUT") {
      return {
        error: "Unable to connect to the database. Please try again later.",
      };
    } else if ((error as { code: string }).code === "503") {
      return {
        error: "Service temporarily unavailable. Please try again later.",
      };
    } else {
      return {
        error: "An unexpected error occurred. Please try again later.",
      };
    }
  }
};
