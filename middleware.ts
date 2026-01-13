import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-key')

export async function middleware(request: NextRequest) {
    const session = request.cookies.get('session')?.value

    // Define public paths
    const publicPaths = ['/login', '/api/voice']
    if (publicPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
        return NextResponse.next()
    }

    if (!session) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
        const definedStart = Date.now();
        const { payload } = await jwtVerify(session, JWT_SECRET)

        // Role based access control
        const path = request.nextUrl.pathname

        if (path.startsWith('/admin') && payload.role !== 'MASTER_ADMIN') {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }

        // If master admin tries to go to dashboard (tenant view), maybe allow or redirect?
        // For now, let's keep them separate.
        if (path.startsWith('/dashboard') && payload.role === 'MASTER_ADMIN') {
            // Optional: Redirect admin to admin dashboard if they try to access user dashboard
            // return NextResponse.redirect(new URL('/admin', request.url)) 
        }

        return NextResponse.next()
    } catch (error) {
        // If token is invalid, clear it and redirect to login
        const response = NextResponse.redirect(new URL('/login', request.url))
        response.cookies.delete('session')
        return response
    }
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
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
}
