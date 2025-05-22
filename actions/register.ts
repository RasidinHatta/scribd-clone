"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { RegisterSchema } from "@/lib/schemas";
import db from "@/prisma/prisma";
import { generateVerificationToken } from "@/lib/token";
import { sendVerificationEmail } from "@/lib/mail";
import { RoleName } from "@/lib/generated/prisma";

export const register = async (data: z.infer<typeof RegisterSchema>) => {
  try {
    const validatedData = RegisterSchema.parse(data);
    const { email, name, password, passwordConfirmation } = validatedData;

    if (password !== passwordConfirmation) {
      return { error: "Passwords do not match" };
    }

    const lowerCaseEmail = email.toLowerCase();

    // Check if user already exists
    const userExists = await db.user.findFirst({
      where: { email: lowerCaseEmail },
    });

    if (userExists) {
      return { error: "Email is already in use. Please try another one." };
    }

    // Determine role
    const roleName: RoleName = lowerCaseEmail.endsWith("@graduate.utm.my")
      ? RoleName.USER
      : RoleName.PUBLICUSER;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    await db.user.create({
      data: {
        email: lowerCaseEmail,
        name,
        password: hashedPassword,
        roleName,
      },
    });

    // Generate and send verification token
    const verificationToken = await generateVerificationToken(lowerCaseEmail);
    await sendVerificationEmail(lowerCaseEmail, verificationToken.token);

    return { success: "Verification email sent successfully." };
  } catch (error) {
    console.error("Register error:", error);

    const errorCode = (error as { code?: string }).code;
    if (errorCode === "ETIMEDOUT") {
      return { error: "Database timeout. Try again later." };
    } else if (errorCode === "503") {
      return { error: "Service unavailable. Try again later." };
    } else {
      return { error: "An unexpected error occurred. Please try again." };
    }
  }
};