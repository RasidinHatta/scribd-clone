"use server";

import * as z from "zod";
import { generateVerificationToken } from "@/lib/token";
import { NewPasswordSchema, ResetPasswordSchema } from "@/lib/schemas";
import { getUserByEmail } from "@/data/user";
import { sendResetPasswordEmail } from "@/lib/mail";
import { getVerificationTokenByToken } from "@/data/verification-token";
import bcrypt from "bcryptjs";
import db from "@/prisma/prisma";

export const forgotPassword = async (data: z.infer<typeof ResetPasswordSchema>) => {
    try {
        const validatedData = ResetPasswordSchema.parse(data)

        if (!validatedData) {
            return { error: "Invalid input data" }
        }

        const { email } = validatedData

        const user = await getUserByEmail(email)

        if (!user) {
            return { error: "User not found" }
        }

        const resetToken = await generateVerificationToken(email)
        await sendResetPasswordEmail(email, resetToken.token)

        return { success: "Forgot Password Email Was Sent" };

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
}

export const resetPassword = async (data: z.infer<typeof NewPasswordSchema> & { token?: string }) => {
  const { token, password, passwordConfirmation } = data;

  if (!token) {
    return { error: "Missing reset token" };
  }

  if (password !== passwordConfirmation) {
    return { error: "Passwords do not match" };
  }

  try {
    // Validate token
    const existingToken = await getVerificationTokenByToken(token);
    if (!existingToken) {
      return { error: "Invalid or expired token" };
    }

    // Check if token has expired
    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
      return { error: "Reset token has expired" };
    }

    // Find the user linked to the token
    const user = await getUserByEmail(existingToken.email);
    if (!user) {
      return { error: "User not found" };
    }

    // Check if new password is the same as the old password (only if password exists)
    if (user.password) {
      const isSamePassword = await bcrypt.compare(password, user.password);
      if (isSamePassword) {
        return { error: "New password cannot be the same as the old password" };
      }
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password
    await db.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // Delete the verification token to prevent reuse
    await db.verificationToken.delete({
      where: { id: existingToken.id },
    });

    return { success: "Password reset successful" };
  } catch (error) {
    console.error("Reset password error:", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
};