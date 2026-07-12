import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const station = await prisma.station.findUnique({
      where: { id: params.id },
      include: {
        line: true,
        trains: {
          select: {
            id: true,
            name: true,
            code: true,
            status: true,
            speed: true,
            direction: true,
            passengerCount: true,
            capacity: true,
          },
        },
        cameras: true,
        _count: {
          select: { trains: true, cameras: true, passengerRecords: true },
        },
      },
    })

    if (!station) {
      return NextResponse.json(
        { error: 'Station not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(station)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch station' },
      { status: 500 }
    )
  }
}
