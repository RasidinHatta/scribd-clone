import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import db from "./prisma/prisma";
import { getUserById } from "./data/user";
import { getAccountByUserId } from "./data/account";
import { getTwoFactorConfirmationByUserId } from "./data/verification-token";
import { RoleName, Role } from "./lib/generated/prisma";
import { getRoleById } from "./data/role";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  basePath: "/api/auth",
  session: {
    strategy: "jwt",
    maxAge: 60 * 120, // 2 hours
    updateAge: 60 * 10, // 10 minutes
  },
  jwt: {
    maxAge: 60 * 120,
  },
  ...authConfig,
  callbacks: {
    async signIn({ user, account }) {
      const email = user.email?.toLowerCase();
      if (!email || !account) return false;

      const existingUser = await db.user.findUnique({
        where: { email },
        include: { accounts: true },
      });

      // 🌐 GOOGLE LOGIN
      if (account.provider === "google") {
        // ❌ Block Google login if user exists with credentials
        if (existingUser && existingUser.password) {
          throw new Error("OAuthAccountLinked"); // Redirects to error page
        }

        if (existingUser) {
          // ✅ Link Google account if not already linked
          const existingGoogleAccount = await db.account.findFirst({
            where: {
              userId: existingUser.id,
              provider: "google",
            },
          });

          if (!existingGoogleAccount) {
            await db.account.create({
              data: {
                userId: existingUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                token_type: account.token_type,
                id_token: account.id_token,
                expires_at: account.expires_at,
                refresh_token: account.refresh_token,
                scope: account.scope,
              },
            });
          }

          return true;
        } else {
          // ✅ Create new Google user if not existing

          const roleName = email.endsWith("@graduate.utm.my")
            ? RoleName.USER
            : RoleName.PUBLICUSER;
          const newUser = await db.user.create({
            data: {
              email,
              name: user.name ?? "",
              image: user.image,
              emailVerified: new Date(),
              role: {
                connect: {
                  name: roleName, // Connect by enum-based role name
                },
              },
            },
          });

          await db.account.create({
            data: {
              userId: newUser.id,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              access_token: account.access_token,
              token_type: account.token_type,
              id_token: account.id_token,
              expires_at: account.expires_at,
              refresh_token: account.refresh_token,
              scope: account.scope,
            },
          });

          return true;
        }
      }

      // 🔐 CREDENTIALS LOGIN
      if (account.provider === "credentials") {
        // ❌ Block credentials login if password not set (Google-only user)
        if (existingUser && !existingUser.password) {
          throw new Error("CredentialsAccountLinked");
        }

        if (!existingUser?.emailVerified) return false;

        if (existingUser.twoFactorEnabled) {
          const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
            existingUser.id
          );
          if (!twoFactorConfirmation) return false;

          await db.twoFactorConfirmation.delete({
            where: { id: twoFactorConfirmation.id },
          });
        }

        return true;
      }

      return false;
    },

    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser.id);
      token.isOauth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.image = existingUser.image;
      token.twoFactorEnabled = existingUser.twoFactorEnabled;
      token.emailVerified = existingUser.emailVerified;
      token.roleName = existingUser.roleName
      return token;
    },
    async session({ token, session }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          isOauth: token.isOauth,
          twoFactorEnabled: token.twoFactorEnabled,
          emailVerified: token.emailVerified,
          image: token.image as string,
          roleId: token.roleId,
        },
      };
    }
  },
});
