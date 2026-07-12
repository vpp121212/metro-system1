import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const density = await prisma.passengerRecord.groupBy({
      by: ['stationId'],
      _sum: { count: true },
      _avg: { densityPercent: true },
      orderBy: { _sum: { count: 'desc' } },
      take: 20,
    })

    const stationIds = density.map((d) => d.stationId)
    const stations = await prisma.station.findMany({
      where: { id: { in: stationIds } },
      include: {
        line: { select: { id: true, nameEn: true, nameAr: true, colorHex: true } },
      },
    })

    const stationMap = new Map(stations.map((s) => [s.id, s]))

    const result = density.map((d, index) => ({
      rank: index + 1,
      station: stationMap.get(d.stationId) ?? null,
      totalPassengers: d._sum.count ?? 0,
      avgDensity: Math.round((d._avg.densityPercent ?? 0) * 100) / 100,
    }))

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch station density' },
      { status: 500 }
    )
  }
}
