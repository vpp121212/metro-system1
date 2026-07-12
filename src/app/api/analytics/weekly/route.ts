import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const records = await prisma.passengerRecord.findMany({
      where: {
        timestamp: { gte: sevenDaysAgo },
      },
      orderBy: { timestamp: 'asc' },
    })

    const dailyMap: Record<string, number> = {}

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const key = d.toISOString().split('T')[0]
      dailyMap[key] = 0
    }

    for (const record of records) {
      const key = new Date(record.timestamp).toISOString().split('T')[0]
      if (key in dailyMap) {
        dailyMap[key] += record.count
      }
    }

    const result = Object.entries(dailyMap).map(([date, count]) => ({
      date,
      count,
    }))

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch weekly data' },
      { status: 500 }
    )
  }
}
