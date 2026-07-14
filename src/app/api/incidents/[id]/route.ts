import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/auth'

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const perm = await requirePermission('system_admin')
    if (!perm.allowed) return perm.response
    const existing = await prisma.incidentReport.findUnique({
      where: { id: params.id },
    })
    if (!existing) {
      return NextResponse.json({ error: 'البلاغ غير موجود' }, { status: 404 })
    }

    const body = await request.json()
    const { type, description, status, priority, stationId, assignedToId } = body

    const data: Record<string, unknown> = {}
    if (type !== undefined) data.type = type
    if (description !== undefined) data.description = description
    if (status !== undefined) data.status = status
    if (priority !== undefined) data.priority = priority
    if (stationId !== undefined) data.stationId = stationId
    if (assignedToId !== undefined) data.assignedToId = assignedToId
    if (status === 'RESOLVED') data.resolvedAt = new Date()

    const incident = await prisma.incidentReport.update({
      where: { id: params.id },
      data,
    })
    return NextResponse.json(incident)
  } catch {
    return NextResponse.json({ error: 'خطأ في تحديث البلاغ' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    const perm = await requirePermission('system_admin')
    if (!perm.allowed) return perm.response
    const existing = await prisma.incidentReport.findUnique({
      where: { id: params.id },
    })
    if (!existing) {
      return NextResponse.json({ error: 'البلاغ غير موجود' }, { status: 404 })
    }
    await prisma.incidentReport.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'خطأ في حذف البلاغ' }, { status: 500 })
  }
}
