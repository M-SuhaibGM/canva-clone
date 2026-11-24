import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Pages that only make sense for signed-out visitors.
const AUTH_PAGES = ["/", "/register"];

// Only allow same-site relative redirects (prevents open redirects).
function safeCallback(value) {
  if (value && value.startsWith("/") && !value.startsWith("//")) return value;
  return "/home";
}

export async function middleware(req) {
  const { pathname, search } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAuthPage = AUTH_PAGES.includes(pathname);

  // Signed in users should never see the login / register page.
  if (token && isAuthPage) {
    const target = safeCallback(req.nextUrl.searchParams.get("callbackUrl"));
    return NextResponse.redirect(new URL(target, req.url));
  }

  // Signed out users are sent to the login page and brought back afterwards.
  if (!token && !isAuthPage) {
    const loginUrl = new URL("/", req.url);
    loginUrl.searchParams.set("callbackUrl", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/register",
    "/home/:path*",
    "/editor/:path*",
    "/subscription/:path*",
  ],
};
