import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/contracts/:path*",
    "/customers/:path*",
    "/invoices/:path*",
    "/legal-consultations/:path*",
    "/lawyer/:path*",
  ],
};