import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const now = new Date()
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

    const records = await prisma.passengerRecord.findMany({
      where: {
        timestamp: { gte: twentyFourHoursAgo },
      },
      orderBy: { timestamp: 'asc' },
    })

    const hourlyMap: Record<number, number> = {}

    for (let i = 0; i < 24; i++) {
      hourlyMap[i] = 0
    }

    for (const record of records) {
      const hour = new Date(record.timestamp).getHours()
      hourlyMap[hour] += record.count
    }

    const result = Object.entries(hourlyMap).map(([hour, count]) => ({
      hour: parseInt(hour, 10),
      count,
    }))

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch passenger flow' },
      { status: 500 }
    )
  }
}
