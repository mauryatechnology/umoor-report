import { NextResponse } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, favicon.svg (favicon files)
     * - public files (images, fonts, etc)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|favicon.svg|assets|KANZ|Mss|bhpl|Fakhri).*)',
  ],
};

export default function middleware(req) {
  const url = req.nextUrl;
  const path = url.pathname;
  
  // Dashboard auth guard
  if (path.startsWith('/dashboard')) {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}
