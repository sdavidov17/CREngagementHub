import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Create a local enum for UserRole until we can import properly
enum UserRole {
  ADMIN = "ADMIN",
  DELIVERY_LEAD = "DELIVERY_LEAD",
  ENGAGEMENT_LEAD = "ENGAGEMENT_LEAD",
  TEAM_MEMBER = "TEAM_MEMBER",
  PROJECT_COORDINATOR = "PROJECT_COORDINATOR",
  LEADERSHIP = "LEADERSHIP",
}

// Define which roles can access which paths
const rolePathMap: Record<UserRole, string[]> = {
  [UserRole.ADMIN]: ["/admin", "/dashboard", "/clients", "/engagements", "/team", "/okrs", "/meetings", "/reports"],
  [UserRole.DELIVERY_LEAD]: ["/dashboard", "/clients", "/engagements", "/team", "/okrs", "/meetings", "/reports"],
  [UserRole.ENGAGEMENT_LEAD]: ["/dashboard", "/clients", "/engagements", "/team", "/okrs", "/meetings", "/reports"],
  [UserRole.TEAM_MEMBER]: ["/dashboard", "/team", "/okrs", "/meetings"],
  [UserRole.PROJECT_COORDINATOR]: ["/dashboard", "/clients", "/engagements", "/team", "/meetings"],
  [UserRole.LEADERSHIP]: ["/dashboard", "/clients", "/engagements", "/reports"],
};

// Function to check if a user can access a path based on their role
function canAccessPath(path: string, role: UserRole): boolean {
  const allowedPaths = rolePathMap[role] || [];
  
  // Check if the current path starts with any of the allowed paths
  return allowedPaths.some(allowedPath => path.startsWith(allowedPath));
}

export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;
  
  // Paths that are accessible to everyone
  const publicPaths = ["/login", "/api/auth", "/"];
  const isPublicPath = publicPaths.some(pp => path.startsWith(pp));
  
  // If the path is public, allow access
  if (isPublicPath) {
    return NextResponse.next();
  }
  
  // Get the user's token
  const token = await getToken({ req: request });
  
  // If there's no token, redirect to login
  if (!token) {
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", encodeURI(request.url));
    return NextResponse.redirect(url);
  }
  
  // If the user's role doesn't have access to this path, redirect to dashboard
  if (!canAccessPath(path, token.role as UserRole)) {
    const url = new URL("/dashboard", request.url);
    return NextResponse.redirect(url);
  }
  
  // Otherwise, allow access
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)", "/"],
}; 