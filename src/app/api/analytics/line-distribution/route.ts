import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const distribution = await prisma.passengerRecord.groupBy({
      by: ['lineId'],
      _sum: { count: true },
      orderBy: { _sum: { count: 'desc' } },
    })

    const lineIds = distribution.map((d) => d.lineId)
    const lines = await prisma.line.findMany({
      where: { id: { in: lineIds } },
      select: { id: true, nameEn: true, nameAr: true, color: true, colorHex: true },
    })

    const lineMap = new Map(lines.map((l) => [l.id, l]))

    const result = distribution.map((d) => ({
      line: lineMap.get(d.lineId) ?? null,
      passengerCount: d._sum.count ?? 0,
    }))

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch line distribution' },
      { status: 500 }
    )
  }
}
