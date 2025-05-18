import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { adminLoginRoute, adminRoute, authRoute, protectedRoute, publicRoute } from "./route";

const { auth } = NextAuth(authConfig)

export default auth(async (req) => {
    console.log('Is Logged In:', !!req.auth);
    console.log('Request URL:', req.nextUrl.pathname);

    const role = req.auth?.user?.role
    const isLoggedIn = !!req.auth
    const { nextUrl } = req
    const basedUrl = process.env.BASED_URL
    const isProtectedRoutes = protectedRoute.includes(nextUrl.pathname)
    const isAuthRoute = authRoute.includes(nextUrl.pathname)
    const isPublicRoute = publicRoute.includes(nextUrl.pathname)
    const isAdminRoute = adminRoute.includes(nextUrl.pathname)
    const isAdminLoginRoute = adminLoginRoute.includes(nextUrl.pathname)

    if(isLoggedIn && isAuthRoute) {
        return Response.redirect(`${basedUrl}`)
    }
    if (!isLoggedIn && isProtectedRoutes) {
        return Response.redirect(`${basedUrl}/login`)
    }
    if(isAdminRoute && role !== "ADMIN") {
        return Response.redirect(`${basedUrl}`)
    }
    if(!isLoggedIn && isAdminRoute) {
        return Response.redirect(`${basedUrl}/admin-login`)
    }
    if(isPublicRoute && role === "ADMIN") {
        return Response.redirect(`${basedUrl}/admin`)
    }
})

export const config = {
    matcher: ["/((?!.*\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}