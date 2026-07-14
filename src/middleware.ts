import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'traineye-dev-secret-do-not-use-in-production'
)

const PUBLIC_PATHS = ['/login', '/presentation', '/api/auth/login', '/api/health']
const PUBLIC_API_PREFIXES = ['/api/auth/']

// Role-based page access: which roles can access which page routes
const ROLE_PAGE_ACCESS: Record<string, string[]> = {
  ADMIN: [
    '/', '/map', '/dashboard', '/analytics', '/cameras', '/playback',
    '/trains', '/stations', '/lines', '/trips', '/history',
    '/alerts', '/reports', '/maintenance', '/fleet',
    '/settings', '/notifications', '/admin', '/audit-logs', '/incidents', '/ai',
  ],
  SUPERVISOR: [
    '/', '/map', '/dashboard', '/analytics', '/cameras', '/playback',
    '/trains', '/stations', '/lines', '/trips', '/history',
    '/alerts', '/reports', '/maintenance', '/fleet',
    '/settings', '/notifications', '/audit-logs', '/incidents', '/ai',
  ],
  VIEWER: [
    '/', '/map', '/dashboard', '/analytics', '/cameras', '/playback',
    '/lines', '/stations', '/alerts', '/reports', '/audit-logs', '/ai',
  ],
}

function getRoleFromToken(token: string): string | null {
  try {
    const payload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString()
    ) as { role?: string }
    return payload.role ?? null
  } catch {
    return null
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (PUBLIC_PATHS.some((p) => pathname === p)) {
    return NextResponse.next()
  }

  if (PUBLIC_API_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/api/')) {
    const token = request.cookies.get('session')?.value
    if (!token) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    try {
      await jwtVerify(token, SECRET)
      return NextResponse.next()
    } catch {
      const response = NextResponse.json({ error: 'الجلسة منتهية' }, { status: 401 })
      response.cookies.set('session', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 0,
      })
      return response
    }
  }

  if (pathname.startsWith('/_next/') || pathname.includes('.')) {
    return NextResponse.next()
  }

  const token = request.cookies.get('session')?.value
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    const { payload } = await jwtVerify(token, SECRET)
    const role = (payload as Record<string, unknown>).role as string | undefined
    const allowedPages = role ? ROLE_PAGE_ACCESS[role] : undefined

    if (!allowedPages) {
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.set('session', '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: 0 })
      return response
    }

    const pageRoot = `/${pathname.split('/')[1]}`
    if (!allowedPages.includes(pageRoot)) {
      return NextResponse.redirect(new URL('/map', request.url))
    }

    return NextResponse.next()
  } catch {
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.set('session', '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: 0 })
    return response
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
