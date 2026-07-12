import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const incident = await prisma.incidentReport.update({
      where: { id: params.id },
      data: {
        ...body,
        ...(body.status === 'RESOLVED' ? { resolvedAt: new Date() } : {}),
      },
    })
    return NextResponse.json(incident)
  } catch {
    return NextResponse.json({ error: 'خطأ في تحديث البلاغ' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.incidentReport.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'خطأ في حذف البلاغ' }, { status: 500 })
  }
}
