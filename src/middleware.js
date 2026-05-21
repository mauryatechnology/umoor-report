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
  const hostname = req.headers.get('host') || '';
  
  // Get the current path
  const path = url.pathname;
  
  // Define main domain structure
  const rootDomain = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000').replace(/^https?:\/\//, '');
  
  // Exclude Vercel preview domains if necessary
  if (
    hostname.includes('---') || 
    hostname.endsWith('.vercel.app') && !hostname.includes('umoor-report.vercel.app')
  ) {
    return NextResponse.next();
  }
  
  // Determine if it's a subdomain
  let currentHost = hostname;
  
  // Prevent Vercel domains from being treated as tenant subdomains
  if (currentHost === 'umoor-report.vercel.app' || currentHost.endsWith('.vercel.app')) {
    currentHost = ''; // It's the main site or a preview URL
  } else if (currentHost.includes(rootDomain)) {
    // Extract subdomain
    currentHost = currentHost.replace(`.${rootDomain}`, '');
    currentHost = currentHost.replace(rootDomain, '');
  }
  
  // If we have a subdomain, and it's not www or empty
  if (currentHost && currentHost !== 'www') {
    const location = currentHost;
    
    // Auth guard for dashboard routes
    if (path.startsWith('/dashboard')) {
      const token = req.cookies.get('auth_token')?.value;
      if (!token) {
        // Redirect to login on main domain
        const loginUrl = new URL('/login', `https://${rootDomain}`);
        // Handle localhost http vs https
        if (rootDomain.includes('localhost')) {
          loginUrl.protocol = 'http:';
        }
        return NextResponse.redirect(loginUrl);
      }
      
      // Rewrite subdomain dashboard to internal dashboard structure
      return NextResponse.rewrite(new URL(`/dashboard/${location}${path.replace('/dashboard', '') || '/'}`, req.url));
    }
    
    // Rewrite subdomain root to internal report page
    if (path === '/' || path === '') {
      return NextResponse.rewrite(new URL(`/report/${location}`, req.url));
    }
    
    // Any other path under subdomain gets passed through
    // (You might want to handle other subdomain routes explicitly here)
  }
  
  // Regular domain handling (no subdomain)
  // Protected paths that shouldn't be accessed directly without location
  if (path.startsWith('/report/') || path.startsWith('/dashboard/')) {
    // Allow local fallbacks /r/:location and /d/:location which are handled by next.config.js rewrites
    // But direct access to internal /report/x and /dashboard/x is fine, the auth guard will catch dashboard
  }

  // Dashboard auth guard for path-based access (/d/location)
  if (path.startsWith('/d/')) {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}
