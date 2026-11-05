import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";

const clerk = clerkMiddleware({ signInUrl: "/sign-in" });

// This only makes the login session readable. The admin check itself runs on every
// dashboard page, action and upload. Public pages stay out of it so they stay static.
export default function proxy(request: NextRequest, event: NextFetchEvent) {
  if (!process.env.CLERK_SECRET_KEY || !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return NextResponse.next();
  }
  return clerk(request, event);
}

export const config = {
  matcher: ["/dashboard/:path*", "/sign-in/:path*", "/api/upload"],
};
