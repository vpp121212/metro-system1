import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get('session')
    if (!session) return NextResponse.json(null, { status: 401 })

    const user = await prisma.user.findUnique({
      where: { id: session.value },
      include: { role: true, station: { select: { nameAr: true } } },
    })

    if (!user || !user.isActive) {
      return NextResponse.json(null, { status: 401 })
    }

    return NextResponse.json({
      id: user.id,
      employeeId: user.employeeId,
      name: user.name,
      email: user.email,
      role: user.role.name,
      stationId: user.stationId,
      stationName: user.station?.nameAr || null,
    })
  } catch {
    return NextResponse.json(null, { status: 500 })
  }
}
