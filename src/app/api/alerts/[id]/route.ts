import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/auth'

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const alert = await prisma.alert.findUnique({
      where: { id: params.id },
      include: {
        station: true,
        line: true,
      },
    })

    if (!alert) {
      return NextResponse.json(
        { error: 'Alert not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(alert)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch alert' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const perm = await requirePermission('manage_alerts')
    if (!perm.allowed) return perm.response
    const body = await request.json()

    const existing = await prisma.alert.findUnique({
      where: { id: params.id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Alert not found' },
        { status: 404 }
      )
    }

    const alert = await prisma.alert.update({
      where: { id: params.id },
      data: {
        isAcknowledged: body.isAcknowledged ?? existing.isAcknowledged,
        type: body.type ?? existing.type,
        titleAr: body.titleAr ?? existing.titleAr,
        titleEn: body.titleEn ?? existing.titleEn,
        descriptionAr: body.descriptionAr ?? existing.descriptionAr,
        descriptionEn: body.descriptionEn ?? existing.descriptionEn,
      },
      include: {
        station: { select: { id: true, nameEn: true, nameAr: true } },
        line: { select: { id: true, nameEn: true, nameAr: true, color: true, colorHex: true } },
      },
    })

    return NextResponse.json(alert)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update alert' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const perm = await requirePermission('system_admin')
    if (!perm.allowed) return perm.response
    const existing = await prisma.alert.findUnique({
      where: { id: params.id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Alert not found' },
        { status: 404 }
      )
    }

    await prisma.alert.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Alert deleted successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete alert' },
      { status: 500 }
    )
  }
}
