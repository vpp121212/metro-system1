import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const train = await prisma.train.findUnique({
      where: { id: params.id },
      include: {
        line: true,
        currentStation: true,
        trips: {
          orderBy: { createdAt: 'desc' },
          take: 20,
          include: {
            fromStation: { select: { id: true, nameEn: true, nameAr: true } },
            toStation: { select: { id: true, nameEn: true, nameAr: true } },
          },
        },
        maintenanceRecords: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    })

    if (!train) {
      return NextResponse.json(
        { error: 'Train not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(train)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch train' },
      { status: 500 }
    )
  }
}
