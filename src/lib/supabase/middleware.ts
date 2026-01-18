import { createServerClient, CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  const supabaseResponse = NextResponse.next({
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
        setAll(
          cookiesToSet: {
            name: string;
            value: string;
            options?: CookieOptions;
          }[]
        ) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);

            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Add condition to allow welcome page access for non-onboarded users
  if (request.nextUrl.pathname == "/welcome") {
    if (!user) {
      // If no user on welcome page, redirect to login
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    // Allow access to welcome page if user exists (onboarded or not)
    if (user.app_metadata.has_onboarded === true) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    console.log(user.app_metadata.has_onboarded);
    return NextResponse.next({ request });
  }

  // Handle non-authenticated routes
  if (
    !user &&
    !request.nextUrl.pathname.startsWith("/auth") &&
    request.nextUrl.pathname !== "/" &&
    request.nextUrl.pathname !== "/privacy-policy" &&
    request.nextUrl.pathname !== "/terms-of-service" &&
    !request.nextUrl.pathname.startsWith("/api/webhooks")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  // Handle non-onboarded users trying to access other pages
  if (user?.app_metadata.has_onboarded === false) {
    return NextResponse.redirect(new URL("/welcome", request.url));
  }

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
