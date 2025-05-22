import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { adminLoginRoute, adminRoute, authRoute, protectedRoute, publicRoute, userRoute } from "./route";
import { getToken } from "next-auth/jwt";
import { Role, RoleName } from "./lib/generated/prisma";


const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  console.log('Is Logged In:', !!req.auth);
  console.log('Request URL:', req.nextUrl.pathname);

  const role = token?.roleName as string || "PUBLIC";

  const isAdmin = role === "ADMIN";
  console.log(isAdmin, role)
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;
  const basedUrl = process.env.BASED_URL;

  const isProtectedRoutes = protectedRoute.includes(nextUrl.pathname);
  const isAuthRoute = authRoute.includes(nextUrl.pathname);
  const isPublicRoute = publicRoute.includes(nextUrl.pathname);
  const isAdminRoute = adminRoute.includes(nextUrl.pathname);
  const isAdminLoginRoute = adminLoginRoute.includes(nextUrl.pathname);
  const isUserRoute = userRoute.includes(nextUrl.pathname);

  if (isLoggedIn && isAuthRoute) {
    return Response.redirect(`${basedUrl}`);
  }
  if (isAdminRoute && !isAdmin && isLoggedIn) {
    return Response.redirect(`${basedUrl}`);
  }
  if (isLoggedIn && isAdminLoginRoute) {
    return Response.redirect(`${basedUrl}/admin`);
  }
  if (isPublicRoute && isAdmin) {
    return Response.redirect(`${basedUrl}/admin`);
  }
  if (!isLoggedIn && isProtectedRoutes) {
    return Response.redirect(`${basedUrl}/login`);
  }
  if (!isLoggedIn && isAdminRoute) {
    return Response.redirect(`${basedUrl}/admin-login`);
  }
  if (isLoggedIn && role === "PUBLICUSER" && isUserRoute) {
    return Response.redirect(`${basedUrl}/access-denied`);
  }
});

export const config = {
  matcher: ["/((?!.*\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
