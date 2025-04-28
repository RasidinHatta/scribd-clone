import { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { LoginSchema } from "./lib/schemas";
import db from "./prisma/prisma";
import bcrypt from "bcryptjs";

export default {
  providers: [
    Google,
    Credentials({
      credentials: {
        email: {},
        password: {}
      },
      authorize: async (credentials) => {
        const validatedCredentials = LoginSchema.parse(credentials);

        const user = await db.user.findFirst({
          where: {
            email: validatedCredentials.email,
          },
        });

        if (!user || !user.password || !user.email) {
          return null;
        }

        const passwordMatch = await bcrypt.compare(validatedCredentials.password, user.password);
        if (!passwordMatch) {
          console.log("wrong password")
          return null
        };

        return user;
      },
    })
  ],
  pages: {
    signIn: "/login",
  },
} satisfies NextAuthConfig