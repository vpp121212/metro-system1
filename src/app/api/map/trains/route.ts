import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const trains = await prisma.train.findMany({
      where: { status: { in: ['ACTIVE', 'DELAYED'] } },
      select: {
        id: true,
        name: true,
        code: true,
        status: true,
        speed: true,
        direction: true,
        passengerCount: true,
        capacity: true,
        currentStation: {
          select: {
            id: true,
            nameEn: true,
            nameAr: true,
            lat: true,
            lng: true,
          },
        },
        line: {
          select: {
            id: true,
            nameEn: true,
            nameAr: true,
            color: true,
            colorHex: true,
          },
        },
      },
    })

    const result = trains.map((train) => ({
      id: train.id,
      name: train.name,
      code: train.code,
      status: train.status,
      speed: train.speed,
      direction: train.direction,
      passengerCount: train.passengerCount,
      capacity: train.capacity,
      lat: train.currentStation?.lat ?? 0,
      lng: train.currentStation?.lng ?? 0,
      currentStation: train.currentStation,
      line: train.line,
    }))

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch train positions' },
      { status: 500 }
    )
  }
}
