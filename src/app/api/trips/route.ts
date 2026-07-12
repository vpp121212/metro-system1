import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') ?? '1', 10)
    const limit = parseInt(searchParams.get('limit') ?? '20', 10)
    const status = searchParams.get('status')
    const trainId = searchParams.get('train')
    const lineId = searchParams.get('line')

    const where: Record<string, unknown> = {}

    if (status) {
      where.status = status
    }
    if (trainId) {
      where.trainId = trainId
    }
    if (lineId) {
      where.lineId = lineId
    }

    const skip = (page - 1) * limit

    const [trips, total] = await Promise.all([
      prisma.trip.findMany({
        where,
        skip,
        take: limit,
        orderBy: { scheduledAt: 'desc' },
        include: {
          train: { select: { id: true, name: true, code: true } },
          line: { select: { id: true, nameEn: true, nameAr: true, color: true, colorHex: true } },
          fromStation: { select: { id: true, nameEn: true, nameAr: true } },
          toStation: { select: { id: true, nameEn: true, nameAr: true } },
        },
      }),
      prisma.trip.count({ where }),
    ])

    return NextResponse.json({
      trips,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch trips' },
      { status: 500 }
    )
  }
}
