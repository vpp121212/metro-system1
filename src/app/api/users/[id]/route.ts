import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/auth'

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const perm = await requirePermission('system_admin')
  if (!perm.allowed) return perm.response

  try {
    const body = await request.json()
    const { roleId, isActive } = body

    const existing = await prisma.user.findUnique({ where: { id: params.id } })
    if (!existing) {
      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 })
    }

    const data: Record<string, unknown> = {}
    if (roleId !== undefined) {
      const role = await prisma.role.findUnique({ where: { id: roleId } })
      if (!role) return NextResponse.json({ error: 'الدور غير موجود' }, { status: 404 })
      data.roleId = roleId
    }
    if (isActive !== undefined) data.isActive = isActive

    const updated = await prisma.user.update({
      where: { id: params.id },
      data,
      select: {
        id: true,
        employeeId: true,
        name: true,
        email: true,
        role: { select: { id: true, name: true } },
        isActive: true,
      },
    })

    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'فشل في تحديث المستخدم' }, { status: 500 })
  }
}
