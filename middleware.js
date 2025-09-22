import { withAuth } from "next-auth/middleware"

export default withAuth({
  pages: {
    signIn: "/", // The sign-in page is your root page
  },
  callbacks: {
    authorized: ({ token }) => {
      // If token exists (user is authenticated), allow access
      // If no token, they'll be automatically redirected to signIn page
      return !!token
    },
  },
})

export const config = {
  matcher: [
    "/editor/:path*",
    "/home/:path*",
    // Add any other private routes here
  ]
}