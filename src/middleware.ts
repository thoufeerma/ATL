import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('wp_jwt')?.value;
  const isLoginPage = request.nextUrl.pathname === '/engineer/login';
  const isEngineerRoute = request.nextUrl.pathname.startsWith('/engineer');

  if (isEngineerRoute) {
    if (!token && !isLoginPage) {
      // Redirect unauthenticated users to login page
      return NextResponse.redirect(new URL('/engineer/login', request.url));
    }

    if (token && isLoginPage) {
      // Redirect authenticated users trying to access login to dashboard
      return NextResponse.redirect(new URL('/engineer/dashboard', request.url));
    }

    if (token && request.nextUrl.pathname === '/engineer') {
      // Redirect /engineer to /engineer/dashboard
      return NextResponse.redirect(new URL('/engineer/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/engineer/:path*', '/engineer'],
};
