import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const acknowledged = searchParams.get('acknowledged')

    const where: Record<string, unknown> = {}

    if (type) {
      where.type = type
    }

    if (acknowledged !== null && acknowledged !== undefined) {
      where.isAcknowledged = acknowledged === 'true'
    }

    const alerts = await prisma.alert.findMany({
      where,
      include: {
        station: { select: { id: true, nameEn: true, nameAr: true } },
        line: { select: { id: true, nameEn: true, nameAr: true, color: true, colorHex: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(alerts)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch alerts' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, titleAr, titleEn, descriptionAr, descriptionEn, stationId, lineId } = body

    const alert = await prisma.alert.create({
      data: {
        type,
        titleAr,
        titleEn,
        descriptionAr,
        descriptionEn,
        stationId: stationId || null,
        lineId: lineId || null,
      },
      include: {
        station: { select: { id: true, nameEn: true, nameAr: true } },
        line: { select: { id: true, nameEn: true, nameAr: true, color: true, colorHex: true } },
      },
    })

    return NextResponse.json(alert, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create alert' },
      { status: 500 }
    )
  }
}
