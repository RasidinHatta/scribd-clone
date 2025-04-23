import { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { schema } from "./lib/schema";
import db from "./prisma/prisma";

export default {
    providers: [
        Google,
        Credentials({
          credentials: {
            email: {},
            password: {}
          },
          authorize: async (credentials) => {
            const validatedCredetials = schema.parse(credentials)
    
            const user = await db.user.findFirst({
              where: {
                email: validatedCredetials.email,
                password: validatedCredetials.password,
              },
            });
    
            if (!user) {
              throw new Error("Invalid Credentials")
            }
            return user
          },
        })
      ],
      pages: {
        signIn: "/login"
      },
} satisfies NextAuthConfig