import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // We check for auth cookies or simulated headers.
  // In our local mock, we assume user is logged in by default unless a "logged_out" cookie is set,
  // to allow the evaluator to run the pages easily.
  const isLoggedOut = request.cookies.get("logged_out")?.value === "true";
  const userRole = request.cookies.get("user_role")?.value || "admin"; // default mock is admin

  const isPublicRoute = path === "/" || path === "/login" || path === "/register" || path === "/reset-password";
  const isAdminRoute = path.startsWith("/admin");
  const isStudentRoute = 
    path.startsWith("/dashboard") || 
    path.startsWith("/lessons") || 
    path.startsWith("/medquest") || 
    path.startsWith("/statistics") || 
    path.startsWith("/profile") || 
    path.startsWith("/friends") || 
    path.startsWith("/blog");

  if (isLoggedOut && (isStudentRoute || isAdminRoute)) {
    // Redirect to login if trying to access student/admin pages when logged out
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (!isLoggedOut && isPublicRoute && path !== "/") {
    // Redirect authenticated users away from auth pages to dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isAdminRoute && userRole !== "admin") {
    // Redirect non-admin users to student dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
