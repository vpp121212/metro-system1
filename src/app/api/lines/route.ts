import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const lines = await prisma.line.findMany({
      include: {
        _count: {
          select: { stations: true, trains: true, trips: true },
        },
        trains: {
          where: { status: 'ACTIVE' },
          select: { id: true },
        },
      },
      orderBy: { order: 'asc' },
    })

    const result = lines.map((line) => ({
      id: line.id,
      nameAr: line.nameAr,
      nameEn: line.nameEn,
      color: line.color,
      colorHex: line.colorHex,
      order: line.order,
      stationCount: line._count.stations,
      totalTrains: line._count.trains,
      activeTrains: line.trains.length,
      tripCount: line._count.trips,
      createdAt: line.createdAt,
      updatedAt: line.updatedAt,
    }))

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch lines' },
      { status: 500 }
    )
  }
}
