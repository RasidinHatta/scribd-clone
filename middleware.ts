import NextAuth from "next-auth"
import { privateRoutes } from "./route"
import authConfig from "./auth.config"

const { auth } = NextAuth(authConfig)

export default auth(async (req) => {
    console.log('Request URL:', req.nextUrl.pathname);
    console.log('Is Logged In:', !!req.auth);

    const isLoggedIn = !!req.auth
    const { nextUrl } = req
    const basedUrl = process.env.BASED_URL
    const isPrivateRoutes = privateRoutes.includes(nextUrl.pathname)
    const isAuthRoute = nextUrl.pathname.includes("/register") || nextUrl.pathname.includes("/login")

    if(isLoggedIn && isAuthRoute) {
        return Response.redirect(`${basedUrl}`)
    }
    if (!isLoggedIn && isPrivateRoutes) {
        return Response.redirect(`${basedUrl}/login`)
    }
})

export const config = {
    matcher: ["/((?!.*\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}