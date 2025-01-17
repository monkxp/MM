import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(req: NextRequest) {
  return await updateSession(req);
}

export const config = {
  matcher: [
    // Match all paths
    // "/:path*",
    // Optional: Exclude specific paths if needed
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
