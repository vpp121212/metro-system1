import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/auth'

export async function GET() {
  try {
    const perm = await requirePermission('view_dashboard')
    if (!perm.allowed) return perm.response

    const [
      activeTrains,
      totalTrains,
      activeAlerts,
      criticalAlerts,
      totalPassengers,
      avgDelay,
      lineStatuses,
    ] = await Promise.all([
      prisma.train.count({ where: { status: 'ACTIVE' } }),
      prisma.train.count(),
      prisma.alert.count({ where: { isAcknowledged: false } }),
      prisma.alert.count({ where: { isAcknowledged: false, type: 'CRITICAL' } }),
      prisma.passengerRecord.aggregate({ _sum: { count: true } }),
      prisma.trip.aggregate({
        _avg: { delayMinutes: true },
        where: { status: { in: ['ACTIVE', 'COMPLETED'] }, delayMinutes: { gt: 0 } },
      }),
      prisma.line.findMany({
        include: {
          stations: true,
          trains: { select: { status: true } },
        },
      }),
    ])

    const totalPassengerCount = totalPassengers._sum.count ?? 0
    const avgDelayMinutes = Math.round((avgDelay._avg.delayMinutes ?? 0) * 10) / 10

    const insights = [
      {
        title: 'حالة الأسطول',
        desc: `${activeTrains} من أصل ${totalTrains} قطار نشط (${totalTrains > 0 ? Math.round((activeTrains / totalTrains) * 100) : 0}%)`,
        type: 'fleet',
      },
      {
        title: 'التنبيهات النشطة',
        desc: `${activeAlerts} تنبيه (${criticalAlerts} حرج)`,
        type: 'alerts',
      },
      {
        title: 'حركة الركاب',
        desc: `${totalPassengerCount.toLocaleString()} راكب مسجل`,
        type: 'passengers',
      },
      {
        title: 'متوسط التأخير',
        desc: `${avgDelayMinutes} دقيقة`,
        type: 'delay',
      },
      {
        title: 'الخطوط النشطة',
        desc: lineStatuses.map((l) => `${l.nameAr}: ${l.trains.filter((t) => t.status === 'ACTIVE').length} قطار`).join(' | '),
        type: 'lines',
      },
    ]

    return NextResponse.json({ insights })
  } catch (error) {
    console.error('Insights error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch insights' },
      { status: 500 }
    )
  }
}
