import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/auth'

export async function GET() {
  const perm = await requirePermission('system_admin')
  if (!perm.allowed) return perm.response

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        employeeId: true,
        name: true,
        email: true,
        role: { select: { id: true, name: true, description: true } },
        station: { select: { id: true, nameAr: true, nameEn: true } },
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    })

    return NextResponse.json(users)
  } catch {
    return NextResponse.json({ error: 'فشل في جلب المستخدمين' }, { status: 500 })
  }
}
