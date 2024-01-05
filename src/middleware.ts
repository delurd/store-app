import { NextRequest, NextResponse } from "next/server";
// import { withAuth } from "next-auth/middleware";


export async function middleware(request: NextRequest) {
    const urlPath = request.nextUrl.pathname;
    const search = request.nextUrl.search
    const cookie = request.cookies
    // console.log('middleraw');
    // console.log(urlPath);





    const isHasToken = (cookie.toString().includes('next-auth.session-token'));

    if (urlPath.includes('dashboard')) {
        if (!isHasToken) {
            return NextResponse.redirect(new URL('/signin', request.url))
        }
        // if (urlPath == '/dashboard/transactions') {
        //     console.log('masuk');

        //     return NextResponse.rewrite(new URL('/dashboard/transactions/buy', request.url))
        // }
    }
    if (urlPath == '/signin') {
        if (isHasToken) {
            return NextResponse.redirect(new URL('/', request.url))
        }
    }
    if (urlPath == '/signup') {
        if (isHasToken) {
            return NextResponse.redirect(new URL('/', request.url))
        }
    }

    if (urlPath == '/api/user') {
        if (isHasToken) {
            return NextResponse.rewrite(new URL('/404', request.url))
        }
    }


}


export const config = { matcher: ["/dashboard/:path*", '/signin', '/signup', '/api/user'] }