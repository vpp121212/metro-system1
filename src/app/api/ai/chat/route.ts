import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/auth'
import { getAIResponse } from '@/lib/ai'

export async function POST(request: Request) {
  try {
    const perm = await requirePermission('view_dashboard')
    if (!perm.allowed) return perm.response
    const body = await request.json()
    const { message } = body

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    const [
      activeTrains,
      totalTrains,
      activeAlerts,
      criticalAlerts,
      delayedTrips,
      totalTrips,
      activeTrips,
      totalPassengers,
      avgDelay,
    ] = await Promise.all([
      prisma.train.count({ where: { status: 'ACTIVE' } }),
      prisma.train.count(),
      prisma.alert.count({ where: { isAcknowledged: false } }),
      prisma.alert.count({ where: { isAcknowledged: false, type: 'CRITICAL' } }),
      prisma.trip.count({ where: { status: 'DELAYED' } }),
      prisma.trip.count(),
      prisma.trip.count({ where: { status: 'ACTIVE' } }),
      prisma.passengerRecord.aggregate({ _sum: { count: true } }),
      prisma.trip.aggregate({
        _avg: { delayMinutes: true },
        where: { status: { in: ['ACTIVE', 'COMPLETED'] }, delayMinutes: { gt: 0 } },
      }),
    ])

    const totalPassengerCount = totalPassengers._sum.count ?? 0
    const avgDelayMinutes = Math.round((avgDelay._avg.delayMinutes ?? 0) * 100) / 100
    const fleetUtilization = totalTrains > 0 ? Math.round((activeTrains / totalTrains) * 100) : 0

    const systemData = {
      activeTrains,
      totalTrains,
      fleetUtilization,
      activeAlerts,
      criticalAlerts,
      delayedTrips,
      totalTrips,
      activeTrips,
      totalPassengerCount,
      avgDelayMinutes,
    }

    const response = await getAIResponse(message, systemData)

    await prisma.chatMessage.create({
      data: {
        role: 'user',
        content: message,
      },
    })

    await prisma.chatMessage.create({
      data: {
        role: 'assistant',
        content: response,
        metadata: JSON.stringify(systemData),
      },
    })

    return NextResponse.json({ response })
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    )
  }
}
