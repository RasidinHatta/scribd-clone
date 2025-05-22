"use server";

import { auth, signIn } from "@/auth";
import { getUserByEmail } from "@/data/user";
import { getTwoFactorConfirmationByUserId, getTwoFactorTokenByEmail } from "@/data/verification-token";
import { sendTwoFactorEmail, sendVerificationEmail } from "@/lib/mail";
import { LoginSchema } from "@/lib/schemas";
import { generateTwoFactorToken, generateVerificationToken } from "@/lib/token";
import db from "@/prisma/prisma";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import * as z from "zod";

export const login = async (data: z.infer<typeof LoginSchema>) => {
  const validatedData = LoginSchema.safeParse(data);

  if (!validatedData.success) {
    return { error: "Invalid input data" };
  }

  const { email, password, code } = validatedData.data;
  const user = await getUserByEmail(email);

  if (!user || !user.password || !user.email) {
    return { error: "User not found" };
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return { error: "Invalid credentials" };
  }

  if (!user.emailVerified) {
    const verification = await generateVerificationToken(user.email);
    await sendVerificationEmail(verification.email, verification.token);
    return { success: "New Confirmation Email Sent" };
  }

  if (user.twoFactorEnabled) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(user.email);
      if (!twoFactorToken || twoFactorToken.token !== code) {
        return { error: "Invalid Code!" };
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();
      if (hasExpired) {
        return { error: "Code expired!" };
      }

      await db.twoFactorToken.delete({ where: { id: twoFactorToken.id } });

      const existingConfirmation = await getTwoFactorConfirmationByUserId(user.id);
      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({ where: { id: existingConfirmation.id } });
      }

      await db.twoFactorConfirmation.create({ data: { userId: user.id } });
    } else {
      const twoFactorToken = await generateTwoFactorToken(user.email);
      await sendTwoFactorEmail(twoFactorToken.email, twoFactorToken.token);
      return { twoFactor: true };
    }
  }

  try {
    await signIn("credentials", {
      email: user.email,
      password,
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.name) {
        case "CredentialsSignin":
          return { error: "Invalid credentials" };
        default:
          return { error: "Please confirm your email address" };
      }
    }
    throw error;
  }

  return { success: "User logged in successfully!" };
};

export const adminLogin = async (data: z.infer<typeof LoginSchema>) => {
  const validatedData = LoginSchema.safeParse(data);

  if (!validatedData.success) {
    return { error: "Invalid input data" };
  }

  const { email, password } = validatedData.data;
  const user = await getUserByEmail(email);

  if (!user || !user.password || !user.email) {
    return { error: "User not found" };
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return { error: "Wrong Password" };
  }

  try {
    await signIn("credentials", {
      email: user.email,
      password,
      redirectTo: "/admin",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.name) {
        case "CredentialsSignin":
          return { error: "Invalid credentials" };
        default:
          return { error: "Please confirm your email address" };
      }
    }
    throw error;
  }

  return { success: "User logged in successfully!" };
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