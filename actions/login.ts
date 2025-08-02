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

/**
 * Handles user login with email and password
 * Includes two-factor authentication flow if enabled for the user
 * @param data - Login credentials including email, password, and optional 2FA code
 * @returns Object with success/error message or twoFactor flag
 */
export const login = async (data: z.infer<typeof LoginSchema>) => {
  // Validate input data against the login schema
  const validatedData = LoginSchema.safeParse(data);

  if (!validatedData.success) {
    return { error: "Invalid input data" };
  }

  const { email, password, code } = validatedData.data;
  
  // Get user from database by email
  const user = await getUserByEmail(email);

  // Check if user exists and has password/email
  if (!user || !user.password || !user.email) {
    return { error: "User not found" };
  }

  // Verify password matches hashed password in database
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return { error: "Invalid credentials" };
  }

  // If email isn't verified, send new verification email
  if (!user.emailVerified) {
    const verification = await generateVerificationToken(user.email);
    await sendVerificationEmail(verification.email, verification.token);
    return { success: "New Confirmation Email Sent" };
  }

  // Handle two-factor authentication if enabled for user
  if (user.twoFactorEnabled) {
    if (code) {
      // Verify the 2FA code if provided
      const twoFactorToken = await getTwoFactorTokenByEmail(user.email);
      if (!twoFactorToken || twoFactorToken.token !== code) {
        return { error: "Invalid Code!" };
      }

      // Check if code has expired
      const hasExpired = new Date(twoFactorToken.expires) < new Date();
      if (hasExpired) {
        return { error: "Code expired!" };
      }

      // Clean up used token
      await db.twoFactorToken.delete({ where: { id: twoFactorToken.id } });

      // Remove any existing confirmation and create new one
      const existingConfirmation = await getTwoFactorConfirmationByUserId(user.id);
      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({ where: { id: existingConfirmation.id } });
      }

      await db.twoFactorConfirmation.create({ data: { userId: user.id } });
    } else {
      // If no code provided, generate and send new 2FA code
      const twoFactorToken = await generateTwoFactorToken(user.email);
      await sendTwoFactorEmail(twoFactorToken.email, twoFactorToken.token);
      return { twoFactor: true };
    }
  }

  // Attempt to sign in with credentials
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

/**
 * Handles admin login with additional role check
 * @param data - Login credentials including email and password
 * @returns Object with success/error message
 */
export const adminLogin = async (data: z.infer<typeof LoginSchema>) => {
  // Validate input data against the login schema
  const validatedData = LoginSchema.safeParse(data);

  if (!validatedData.success) {
    return { error: "Invalid input data" };
  }

  const { email, password } = validatedData.data;
  const user = await getUserByEmail(email);

  // Check if user exists and has password/email
  if (!user || !user.password || !user.email) {
    return { error: "User not found" };
  }

  // Additional check for admin role
  if (user.roleName !== "ADMIN") {
    return { error: "User not admin" };
  }

  // Verify password matches hashed password in database
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return { error: "Wrong Password" };
  }

  // Attempt to sign in with credentials (redirects to admin dashboard)
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

  return { success: "Admin logged in successfully!" };
}

/**
 * Handles Google OAuth authentication
 * @returns Redirects to Google auth or returns error message
 */
export async function googleAuthenticate() {
  try {
    // Initiate Google OAuth sign in flow
    await signIn('google', { redirectTo: "/" })
  } catch (error) {
    if (error instanceof AuthError) {
      return "google log in failed"
    }
    throw error
  }
}