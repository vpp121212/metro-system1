import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const lineId = searchParams.get('line')
    const search = searchParams.get('search')

    const where: Record<string, unknown> = {}

    if (lineId) {
      where.lineId = lineId
    }

    if (search) {
      where.OR = [
        { nameEn: { contains: search, mode: 'insensitive' } },
        { nameAr: { contains: search, mode: 'insensitive' } },
      ]
    }

    const stations = await prisma.station.findMany({
      where,
      include: {
        line: {
          select: { id: true, nameEn: true, nameAr: true, color: true, colorHex: true },
        },
        _count: {
          select: { trains: true, cameras: true },
        },
      },
      orderBy: [{ lineId: 'asc' }, { order: 'asc' }],
    })

    return NextResponse.json(stations)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch stations' },
      { status: 500 }
    )
  }
}
