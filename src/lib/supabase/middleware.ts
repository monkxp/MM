import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  //   console.log("Middleware called for path:", request.nextUrl.pathname);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  //   console.log("user:", user);

  // Define public routes that don't require authentication
  const publicRoutes = [
    "/signin",
    "/signup",
    "/forgot-password",
    "/auth/callback",
  ];
  const isPublicRoute = publicRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route),
  );

  // console.log({
  //   path: request.nextUrl.pathname,
  //   isPublicRoute,
  //   hasUser: !!user,
  // });

  // Allow access to public routes
  if (isPublicRoute) {
    // If user is authenticated and trying to access auth pages, redirect to home
    if (user) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    // Allow access to public routes for non-authenticated users
    return supabaseResponse;
  }

  // Protected routes: redirect to signin if not authenticated
  if (!user) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  //   if (!user && !request.nextUrl.pathname.startsWith("/auth")) {
  //     // no user, potentially respond by redirecting the user to the login page
  //     const url = request.nextUrl.clone();
  //     url.pathname = "/auth";
  //     return NextResponse.redirect(url);
  //   }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
