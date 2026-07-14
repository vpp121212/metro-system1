import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/auth'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const perm = await requirePermission('system_admin')
  if (!perm.allowed) return perm.response

  try {
    const body = await request.json()
    const { name, description, permissions } = body

    const existing = await prisma.role.findUnique({ where: { id: params.id } })
    if (!existing) {
      return NextResponse.json({ error: 'الدور غير موجود' }, { status: 404 })
    }

    if (existing.name === 'ADMIN' && permissions && !permissions.includes('system_admin')) {
      return NextResponse.json({ error: 'لا يمكن إزالة صلاحية system_admin من دور ADMIN' }, { status: 400 })
    }

    const data: Record<string, unknown> = {}
    if (name !== undefined) data.name = name
    if (description !== undefined) data.description = description

    const role = await prisma.$transaction(async (tx) => {
      if (Object.keys(data).length > 0) {
        await tx.role.update({ where: { id: params.id }, data })
      }

      if (permissions !== undefined && Array.isArray(permissions)) {
        await tx.permission.deleteMany({ where: { roleId: params.id } })
        for (const p of permissions) {
          await tx.permission.create({ data: { name: p, roleId: params.id } })
        }
      }

      return tx.role.findUnique({
        where: { id: params.id },
        select: {
          id: true,
          name: true,
          description: true,
          permissions: { select: { id: true, name: true } },
          _count: { select: { users: true } },
        },
      })
    })

    return NextResponse.json(role)
  } catch {
    return NextResponse.json({ error: 'فشل في تحديث الدور' }, { status: 500 })
  }
}
