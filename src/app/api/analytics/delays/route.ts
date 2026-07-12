import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const delays = await prisma.trip.groupBy({
      by: ['lineId'],
      _avg: { delayMinutes: true },
      _count: { id: true },
      where: { delayMinutes: { gt: 0 } },
      orderBy: { _avg: { delayMinutes: 'desc' } },
    })

    const lineIds = delays.map((d) => d.lineId)
    const lines = await prisma.line.findMany({
      where: { id: { in: lineIds } },
      select: { id: true, nameEn: true, nameAr: true, color: true, colorHex: true },
    })

    const lineMap = new Map(lines.map((l) => [l.id, l]))

    const result = delays.map((d) => ({
      line: lineMap.get(d.lineId) ?? null,
      avgDelay: Math.round((d._avg.delayMinutes ?? 0) * 100) / 100,
      totalTrips: d._count.id,
    }))

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch delay data' },
      { status: 500 }
    )
  }
}
