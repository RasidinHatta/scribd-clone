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

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const role = token?.roleName;
  const isAdmin = role === "ADMIN";
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;
  const basedUrl = process.env.BASED_URL;

  const path = nextUrl.pathname;
  const isProtectedRoute = protectedRoute.includes(path);
  const isAuthRoute = authRoute.includes(path);
  const isPublicRoute = publicRoute.includes(path);
  const isAdminRoute = adminRoute.includes(path);
  const isAdminLoginRoute = adminLoginRoute.includes(path);
  const isUserRoute = userRoute.includes(path);

  console.log(`Access Attempt: Role=${role}, Path=${path}`);

  // 1. Handle auth routes (login/signup) for already authenticated users
  if (isLoggedIn && isAuthRoute) {
    return Response.redirect(`${basedUrl}`);
  }

  // 2. Handle admin-specific routes
  if (isAdminRoute) {
    if (!isLoggedIn) {
      return Response.redirect(`${basedUrl}/admin-login`);
    }
    if (!isAdmin) {
      return Response.redirect(`${basedUrl}/access-denied`);
    }
    return; // Allow access
  }

  // 3. Handle admin login route for already logged-in admins
  if (isLoggedIn && isAdminLoginRoute) {
    return Response.redirect(`${basedUrl}/admin`);
  }

  // 4. Handle public routes for admins (redirect to admin dashboard)
  if (isPublicRoute && isAdmin) {
    return Response.redirect(`${basedUrl}/admin`);
  }

  // 5. Handle protected routes for unauthenticated users
  if (!isLoggedIn && isProtectedRoute) {
    return Response.redirect(`${basedUrl}/login`);
  }

  // 6. Handle user routes for public users
  if (isLoggedIn && role === "PUBLICUSER" && isUserRoute) {
    return Response.redirect(`${basedUrl}/access-denied`);
  }

  // Default allow (but consider adding more strict controls)
});

export const config = {
  matcher: ["/((?!.*\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};