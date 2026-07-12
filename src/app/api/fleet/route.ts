import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [total, active, maintenance, available] = await Promise.all([
      prisma.train.count(),
      prisma.train.count({ where: { status: 'ACTIVE' } }),
      prisma.train.count({ where: { status: 'MAINTENANCE' } }),
      prisma.train.count({ where: { status: { in: ['ACTIVE', 'INACTIVE'] } } }),
    ])

    const totalCapacity = await prisma.train.aggregate({
      _sum: { capacity: true },
    })

    const currentPassengers = await prisma.train.aggregate({
      _sum: { passengerCount: true },
      where: { status: 'ACTIVE' },
    })

    const fleet = await prisma.fleet.findFirst({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      total,
      active,
      maintenance,
      available: available - active,
      totalCapacity: totalCapacity._sum.capacity ?? 0,
      currentPassengers: currentPassengers._sum.passengerCount ?? 0,
      name: fleet?.name ?? 'Metro Fleet',
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch fleet summary' },
      { status: 500 }
    )
  }
}
