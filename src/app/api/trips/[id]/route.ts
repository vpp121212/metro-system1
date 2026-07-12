import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const trip = await prisma.trip.findUnique({
      where: { id: params.id },
      include: {
        train: true,
        line: true,
        fromStation: true,
        toStation: true,
      },
    })

    if (!trip) {
      return NextResponse.json(
        { error: 'Trip not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(trip)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch trip' },
      { status: 500 }
    )
  }
}
