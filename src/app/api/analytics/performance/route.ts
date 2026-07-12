import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [totalTrips, completedTrips, onTimeTrips, totalTrains, activeTrains] = await Promise.all([
      prisma.trip.count(),
      prisma.trip.count({ where: { status: 'COMPLETED' } }),
      prisma.trip.count({ where: { status: 'COMPLETED', delayMinutes: 0 } }),
      prisma.train.count(),
      prisma.train.count({ where: { status: 'ACTIVE' } }),
    ])

    const avgDelay = await prisma.trip.aggregate({
      _avg: { delayMinutes: true },
      where: { status: { in: ['ACTIVE', 'COMPLETED'] } },
    })

    const totalPassengers = await prisma.passengerRecord.aggregate({
      _sum: { count: true },
    })

    const reliability = totalTrips > 0 ? Math.round((completedTrips / totalTrips) * 10000) / 100 : 100
    const punctuality = completedTrips > 0 ? Math.round((onTimeTrips / completedTrips) * 10000) / 100 : 100
    const fleetUtilization = totalTrains > 0 ? Math.round((activeTrains / totalTrains) * 10000) / 100 : 0

    return NextResponse.json({
      reliability,
      punctuality,
      safety: 98.5,
      avgDelay: Math.round((avgDelay._avg.delayMinutes ?? 0) * 100) / 100,
      fleetUtilization,
      totalPassengers: totalPassengers._sum.count ?? 0,
      totalTrips,
      completedTrips,
      activeTrains,
      totalTrains,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch performance metrics' },
      { status: 500 }
    )
  }
}
