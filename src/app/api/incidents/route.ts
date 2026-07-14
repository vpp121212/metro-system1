import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/auth'

export async function GET() {
  try {
    const incidents = await prisma.incidentReport.findMany({
      include: {
        station: { select: { nameAr: true, nameEn: true } },
        reportedBy: { select: { name: true } },
        assignedTo: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(incidents)
  } catch {
    return NextResponse.json({ error: 'خطأ في جلب البلاغات' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const perm = await requirePermission('system_admin')
    if (!perm.allowed) return perm.response
    const cookieStore = await cookies()
    const session = cookieStore.get('session')
    if (!session) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

    const body = await request.json()
    const { type, description, stationId, priority } = body

    if (!type || !description) {
      return NextResponse.json({ error: 'نوع البلاغ والوصف مطلوبان' }, { status: 400 })
    }

    const incident = await prisma.incidentReport.create({
      data: {
        type,
        description,
        stationId: stationId || null,
        priority: priority || 'MEDIUM',
        reportedById: session.value,
      },
    })

    return NextResponse.json(incident, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'خطأ في إنشاء البلاغ' }, { status: 500 })
  }
}
