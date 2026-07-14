import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { prisma } from './prisma'
import { NextResponse } from 'next/server'

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'traineye-dev-secret-do-not-use-in-production'
)

const COOKIE_NAME = 'session'

export interface SessionPayload {
  userId: string
  role: string
}

export async function createSession(userId: string, role: string): Promise<string> {
  const token = await new SignJWT({ userId, role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(SECRET)
  return token
}

export async function verifySession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)
    if (!token?.value) return null
    const { payload } = await jwtVerify(token.value, SECRET)
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}

export async function getSessionUser() {
  const session = await verifySession()
  if (!session) return null

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { role: { include: { permissions: true } }, station: { select: { nameAr: true } } },
  })
  if (!user || !user.isActive) return null

  return {
    id: user.id,
    employeeId: user.employeeId,
    name: user.name,
    email: user.email,
    role: user.role.name,
    permissions: user.role.permissions.map((p) => p.name),
    stationId: user.stationId,
    stationName: user.station?.nameAr ?? null,
  }
}

export function hasPermission(
  userPermissions: string[] | undefined,
  required: string | string[]
): boolean {
  if (!userPermissions) return false
  if (userPermissions.includes('system_admin')) return true
  const requiredPerms = Array.isArray(required) ? required : [required]
  return requiredPerms.every((p) => userPermissions.includes(p))
}

export async function requirePermission(
  permission: string
): Promise<{ allowed: false; response: NextResponse } | { allowed: true; user: NonNullable<Awaited<ReturnType<typeof getSessionUser>>> }> {
  const user = await getSessionUser()
  if (!user) {
    return { allowed: false, response: NextResponse.json({ error: 'غير مصرح' }, { status: 401 }) }
  }
  if (!hasPermission(user.permissions, permission)) {
    return { allowed: false, response: NextResponse.json({ error: 'لا تملك الصلاحية لهذه العملية' }, { status: 403 }) }
  }
  return { allowed: true, user }
}
