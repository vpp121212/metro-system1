import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { createSession } from '@/lib/auth'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown'
  const { allowed, remaining } = checkRateLimit(ip)
  if (!allowed) {
    return NextResponse.json(
      { error: 'محاولات كثيرة جداً. الرجاء الانتظار دقيقة' },
      { status: 429, headers: { 'Retry-After': '60' } }
    )
  }

  try {
    const { employeeId, password } = await request.json()
    if (!employeeId || !password) {
      return NextResponse.json({ error: 'الرجاء إدخال رقم الموظف وكلمة المرور' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { employeeId },
      include: { role: { include: { permissions: true } }, station: { select: { nameAr: true } } },
    })

    if (!user || !user.isActive) {
      return NextResponse.json({ error: 'رقم الموظف أو كلمة المرور غير صحيحة' }, { status: 401 })
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return NextResponse.json({ error: 'رقم الموظف أو كلمة المرور غير صحيحة' }, { status: 401 })
    }

    const token = await createSession(user.id, user.role.name)

    const response = NextResponse.json({
      user: {
        id: user.id,
        employeeId: user.employeeId,
        name: user.name,
        email: user.email,
        role: user.role.name,
        permissions: user.role.permissions.map((p) => p.name),
        stationId: user.stationId,
        stationName: user.station?.nameAr || null,
      },
    })

    response.cookies.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24,
    })

    return response
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 })
  }
}
