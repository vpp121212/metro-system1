import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/auth'

export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const perm = await requirePermission('manage_trains')
  if (!perm.allowed) return perm.response

  try {
    const train = await prisma.train.findUnique({ where: { id: params.id } })
    if (!train) {
      return NextResponse.json({ error: 'القطار غير موجود' }, { status: 404 })
    }
    if (train.status === 'STOPPED') {
      return NextResponse.json({ error: 'القطار متوقف بالفعل' }, { status: 409 })
    }

    const updated = await prisma.train.update({
      where: { id: params.id },
      data: { status: 'STOPPED', speed: 0 },
    })

    return NextResponse.json({ message: 'تم إيقاف القطار', train: updated })
  } catch {
    return NextResponse.json({ error: 'فشل إيقاف القطار' }, { status: 500 })
  }
}
