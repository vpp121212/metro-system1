import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const now = new Date()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    const [
      activeTrains,
      totalTrains,
      passengersToday,
      avgDelayResult,
      activeAlerts,
      criticalAlerts,
      activeTrips,
      totalStations,
      stationsOnline,
      systemHealth,
    ] = await Promise.all([
      prisma.train.count({ where: { status: 'ACTIVE' } }),
      prisma.train.count(),
      prisma.passengerRecord.aggregate({
        _sum: { count: true },
        where: { timestamp: { gte: startOfDay } },
      }),
      prisma.trip.aggregate({
        _avg: { delayMinutes: true },
        where: { status: { in: ['ACTIVE', 'COMPLETED'] }, delayMinutes: { gt: 0 } },
      }),
      prisma.alert.count({ where: { isAcknowledged: false } }),
      prisma.alert.count({ where: { isAcknowledged: false, type: 'CRITICAL' } }),
      prisma.trip.count({ where: { status: 'ACTIVE' } }),
      prisma.station.count(),
      prisma.camera.count({ where: { status: 'ACTIVE' } }),
      prisma.systemHealth.findFirst({ orderBy: { timestamp: 'desc' } }),
    ])

    const uptimeEntry = await prisma.systemHealth.findFirst({
      orderBy: { timestamp: 'desc' },
      select: { uptimeSeconds: true },
    })

    return NextResponse.json({
      activeTrains,
      totalTrains,
      passengersToday: passengersToday._sum.count ?? 0,
      avgDelay: avgDelayResult._avg.delayMinutes ?? 0,
      safetyScore: 98.5,
      systemHealth: systemHealth?.healthPercent ?? 99.5,
      activeAlerts,
      criticalAlerts,
      activeTrips,
      stationsOnline,
      totalStations,
      uptimeHours: uptimeEntry ? Math.floor(uptimeEntry.uptimeSeconds / 3600) : 0,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch dashboard summary' },
      { status: 500 }
    )
  }
}
