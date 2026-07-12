import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicPaths = ['/login', '/api/auth/login', '/api/auth/logout']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (publicPaths.some(p => pathname.startsWith(p))) return NextResponse.next()
  if (pathname.startsWith('/_next') || pathname.startsWith('/favicon') || pathname === '/') return NextResponse.next()
  if (pathname.startsWith('/api/')) return NextResponse.next()

  const session = request.cookies.get('session')
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
