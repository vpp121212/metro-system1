import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [total, acknowledged, unacknowledged] = await Promise.all([
      prisma.alert.count(),
      prisma.alert.count({ where: { isAcknowledged: true } }),
      prisma.alert.count({ where: { isAcknowledged: false } }),
    ])

    const byType = await prisma.alert.groupBy({
      by: ['type'],
      _count: { id: true },
    })

    const byTypeAcknowledged = await prisma.alert.groupBy({
      by: ['type'],
      where: { isAcknowledged: true },
      _count: { id: true },
    })

    const byTypeUnacknowledged = await prisma.alert.groupBy({
      by: ['type'],
      where: { isAcknowledged: false },
      _count: { id: true },
    })

    const typeMap: Record<string, { total: number; acknowledged: number; unacknowledged: number }> = {}

    for (const item of byType) {
      typeMap[item.type] = { total: item._count.id, acknowledged: 0, unacknowledged: 0 }
    }

    for (const item of byTypeAcknowledged) {
      if (typeMap[item.type]) {
        typeMap[item.type].acknowledged = item._count.id
      }
    }

    for (const item of byTypeUnacknowledged) {
      if (typeMap[item.type]) {
        typeMap[item.type].unacknowledged = item._count.id
      }
    }

    return NextResponse.json({
      total,
      acknowledged,
      unacknowledged,
      byType: typeMap,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch alert stats' },
      { status: 500 }
    )
  }
}
