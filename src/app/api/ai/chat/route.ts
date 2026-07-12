import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
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

    const lowerMessage = message.toLowerCase()
    let response = ''

    if (lowerMessage.includes('status') || lowerMessage.includes('overview') || lowerMessage.includes('summary')) {
      response = `TrainEye AI Network Status Report:\n\n` +
        `The metro network currently has ${activeTrains} out of ${totalTrains} trains active (${fleetUtilization}% fleet utilization).\n` +
        `${activeTrips} trips are currently in progress.\n` +
        `Total passengers recorded: ${totalPassengerCount.toLocaleString()}.\n` +
        `Average delay: ${avgDelayMinutes} minutes.\n` +
        `Active alerts: ${activeAlerts} (${criticalAlerts} critical).\n` +
        `Network health: ${criticalAlerts === 0 ? 'Good' : 'Requires attention - ' + criticalAlerts + ' critical alert(s) active'}.`
    } else if (lowerMessage.includes('alert') || lowerMessage.includes('warning')) {
      response = `Alert Summary:\n\n` +
        `Active unacknowledged alerts: ${activeAlerts}\n` +
        `Critical alerts: ${criticalAlerts}\n` +
        `${criticalAlerts > 0 ? 'Immediate attention recommended. There are ' + criticalAlerts + ' critical alert(s) that need to be addressed.' : 'No critical alerts at this time. System is operating normally.'}`
    } else if (lowerMessage.includes('train') || lowerMessage.includes('fleet')) {
      response = `Fleet Status:\n\n` +
        `Total trains: ${totalTrains}\n` +
        `Active: ${activeTrains}\n` +
        `Fleet utilization: ${fleetUtilization}%\n` +
        `${activeTrains < totalTrains * 0.5 ? 'Warning: Fleet utilization is below 50%. Consider deploying more trains.' : 'Fleet utilization is at a healthy level.'}`
    } else if (lowerMessage.includes('passenger') || lowerMessage.includes('ridership')) {
      response = `Passenger Statistics:\n\n` +
        `Total passengers recorded: ${totalPassengerCount.toLocaleString()}\n` +
        `Active trips: ${activeTrips}\n` +
        `Average delay: ${avgDelayMinutes} minutes\n` +
        `${totalPassengerCount > 50000 ? 'High ridership detected. Consider increasing train frequency.' : 'Ridership levels are within normal range.'}`
    } else if (lowerMessage.includes('delay') || lowerMessage.includes('late')) {
      response = `Delay Report:\n\n` +
        `Trips currently delayed: ${delayedTrips}\n` +
        `Average delay: ${avgDelayMinutes} minutes\n` +
        `Total trips today: ${totalTrips}\n` +
        `${avgDelayMinutes > 5 ? 'Average delay exceeds 5 minutes. Investigation recommended.' : 'Delays are within acceptable limits.'}`
    } else {
      response = `I'm TrainEye AI, your metro network assistant. Here's a quick overview:\n\n` +
        `Network: ${activeTrains}/${totalTrains} trains active\n` +
        `Trips: ${activeTrips} active, ${delayedTrips} delayed\n` +
        `Passengers: ${totalPassengerCount.toLocaleString()} total\n` +
        `Alerts: ${activeAlerts} active (${criticalAlerts} critical)\n` +
        `Avg delay: ${avgDelayMinutes} min\n\n` +
        `You can ask me about: network status, alerts, trains/fleet, passengers, or delays.`
    }

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
        metadata: JSON.stringify({
          activeTrains,
          totalTrains,
          activeAlerts,
          criticalAlerts,
          totalPassengers: totalPassengerCount,
          avgDelay: avgDelayMinutes,
        }),
      },
    })

    return NextResponse.json({ response })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    )
  }
}
