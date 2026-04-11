// middleware.ts OR proxy.ts

// export function middleware(request: NextRequest) {
//     const isLoggedIn = false;
//
//     if (!isLoggedIn && request.nextUrl.pathname.startsWith('/dashboard')) {
//         return NextResponse.redirect(new URL('/login', request.url));
//     }
//
//     return NextResponse.next();
// }

// This function can be marked `async` if using `await` inside
export function proxy() {
  // return NextResponse.redirect(new URL('/', request.url))
}

// export const config = {
//     matcher: '/about/:path*',
// }