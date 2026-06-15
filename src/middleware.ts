import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Define which routes are accessible by which roles
const roleRouteMap: Record<string, string[]> = {
  SUPERADMIN: ["/superadmin"],
  DOCTOR: ["/doctor"],
  STAFF: ["/staff"],
  CUSTOMER: ["/portal"],
};

const publicRoutes = [
  "/",
  "/login",
  "/register",
  "/layanan",
  "/dokter",
  "/artikel",
  "/kontak",
  "/booking",
];

const authRoutes = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  let res = NextResponse.next();
  const pathname = request.nextUrl.pathname;

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
            request.cookies.set(name, value)
          );
          res = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Allow public routes
  if (
    publicRoutes.some(
      (route) => pathname === route || pathname.startsWith(route + "/")
    )
  ) {
    // For auth routes, redirect to dashboard if already logged in
    if (authRoutes.some((route) => pathname.startsWith(route))) {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        const { data: user } = await supabase
          .from("users")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (user) {
          const dashboardPath = getDashboardPath(user.role);
          return NextResponse.redirect(new URL(dashboardPath, request.url));
        }
      }
    }
    return res;
  }

  // Check authentication
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Get user role
  const { data: user } = await supabase
    .from("users")
    .select("role")
    .eq("id", session.user.id)
    .single();

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Check role-based access
  const allowedRoutes = roleRouteMap[user.role] || [];
  const hasAccess = allowedRoutes.some((route) => pathname.startsWith(route));

  if (!hasAccess) {
    const dashboardPath = getDashboardPath(user.role);
    return NextResponse.redirect(new URL(dashboardPath, request.url));
  }

  return res;
}

function getDashboardPath(role: string): string {
  switch (role) {
    case "SUPERADMIN":
      return "/superadmin/dashboard";
    case "DOCTOR":
      return "/doctor/dashboard";
    case "STAFF":
      return "/staff/dashboard";
    case "CUSTOMER":
      return "/portal/dashboard";
    default:
      return "/";
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api).*)",
  ],
};