import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const now = new Date()

    const recentRecords = await prisma.passengerRecord.findMany({
      where: {
        timestamp: { gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) },
      },
      orderBy: { timestamp: 'asc' },
    })

    const hourlyAvg: Record<number, number> = {}
    const hourlyCounts: Record<number, number> = {}

    for (const record of recentRecords) {
      const hour = new Date(record.timestamp).getHours()
      hourlyAvg[hour] = (hourlyAvg[hour] ?? 0) + record.count
      hourlyCounts[hour] = (hourlyCounts[hour] ?? 0) + 1
    }

    for (const hour of Object.keys(hourlyAvg)) {
      const h = parseInt(hour, 10)
      hourlyAvg[h] = hourlyCounts[h] > 0 ? Math.round(hourlyAvg[h] / 7) : 0
    }

    const predictions = []
    for (let i = 0; i < 12; i++) {
      const predictionHour = new Date(now.getTime() + i * 60 * 60 * 1000)
      const hour = predictionHour.getHours()
      const basePassengers = hourlyAvg[hour] ?? 0
      const variance = Math.floor(Math.random() * basePassengers * 0.2)
      const predictedPassengers = basePassengers + variance

      predictions.push({
        hour: predictionHour.toISOString(),
        predictedPassengers,
        confidence: Math.max(60, 95 - i * 3),
        trend: predictedPassengers > basePassengers * 1.1 ? 'increasing' :
               predictedPassengers < basePassengers * 0.9 ? 'decreasing' : 'stable',
      })
    }

    return NextResponse.json(predictions)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch predictions' },
      { status: 500 }
    )
  }
}
