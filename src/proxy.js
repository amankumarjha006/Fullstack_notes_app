import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// Next.js 16 uses proxy.js instead of middleware.js for route interception.
// The exported function must be named "proxy" (not "middleware").
// Auth protection logic is handled in authConfig.callbacks.authorized

const { auth } = NextAuth(authConfig);

export const proxy = auth;

export const config = {
  matcher: [
    // Run on all routes except static files, images, and favicon
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
