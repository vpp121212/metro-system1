import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { employeeId, password } = await request.json()
    if (!employeeId || !password) {
      return NextResponse.json({ error: 'الرجاء إدخال رقم الموظف وكلمة المرور' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { employeeId },
      include: { role: true, station: { select: { nameAr: true } } },
    })

    if (!user || !user.isActive) {
      return NextResponse.json({ error: 'رقم الموظف أو كلمة المرور غير صحيحة' }, { status: 401 })
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return NextResponse.json({ error: 'رقم الموظف أو كلمة المرور غير صحيحة' }, { status: 401 })
    }

    const response = NextResponse.json({
      user: {
        id: user.id,
        employeeId: user.employeeId,
        name: user.name,
        email: user.email,
        role: user.role.name,
        stationId: user.stationId,
        stationName: user.station?.nameAr || null,
      },
    })

    response.cookies.set('session', user.id, {
      path: '/',
      maxAge: 60 * 60 * 24,
      sameSite: 'lax',
    })

    return response
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 })
  }
}
