import NextAuth from "next-auth";
import authConfig from "./auth.config";
import {
  adminLoginRoute,
  adminRoute,
  authRoute,
  protectedRoute,
  publicRoute,
  userRoute
} from "./route";
import { getToken } from "next-auth/jwt";
import { RoleName } from "./lib/generated/prisma";

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const basedUrl = process.env.BASED_URL;
  const { nextUrl } = req;
  const path = nextUrl.pathname;

  const matchesAny = (routes: string[], p: string): boolean =>
    routes.some((route: string) => p === route || p.startsWith(route + "/"));

  const isPublicRoute = matchesAny(publicRoute, path);
  const isAuthRoute = matchesAny(authRoute, path);
  const isAdminRoute = matchesAny(adminRoute, path);
  const isProtectedRoute = matchesAny(protectedRoute, path);
  const isUserRoute = matchesAny(userRoute, path);

  // 1. Public routes - check if admin is trying to access
  if (isPublicRoute) {
    try {
      const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
        secureCookie: process.env.NODE_ENV === 'production'
      });

      if (token?.roleName === "ADMIN") {
        return Response.redirect(`${basedUrl}/admin`);
      }
    } catch (error) {
      console.error('Token check error:', error);
    }
    return; // Allow non-admin access to public routes
  }

  // 2. Get token safely for other routes
  let token;
  try {
    token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: process.env.NODE_ENV === 'production'
    });
  } catch (error) {
    console.error('Token retrieval error:', error);
    if (path.startsWith('/api')) {
      return new Response(JSON.stringify({
        error: 'Authentication error',
        message: 'Could not verify your session'
      }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }
    return Response.redirect(`${basedUrl}/auth-error`);
  }

  const role = token?.roleName as RoleName;
  const isAdmin = role === RoleName.ADMIN;
  const isPublic = role === RoleName.PUBLICUSER;
  const canUpload = token?.role.createDocument
  const isLoggedIn = !!token;

  // 3. Auth routes (login/register/admin-login) - redirect logged in users
  if (isLoggedIn && (isAuthRoute || matchesAny(adminLoginRoute, path))) {
    return Response.redirect(isAdmin ? `${basedUrl}/admin` : `${basedUrl}`);
  }

  // 4. Admin routes
  if (isAdminRoute) {
    if (!isLoggedIn) return Response.redirect(`${basedUrl}/admin-login`);
    if (!isAdmin) return Response.redirect(`${basedUrl}/access-denied`);
    return;
  }

  // 5. Protected routes - redirect unauthenticated users
  if (!isLoggedIn && isProtectedRoute) {
    return Response.redirect(`${basedUrl}/login`);
  }

  // 6. User routes - restrict PUBLICUSER role without upload permissions
  if (isLoggedIn && isUserRoute && isPublic && !canUpload) {
    return Response.redirect(`${basedUrl}/access-denied`);
  }
});

export const config = {
  matcher: ["/((?!.*\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};