import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const stationId = searchParams.get('station')
    const status = searchParams.get('status')

    const where: Record<string, unknown> = {}

    if (stationId) {
      where.stationId = stationId
    }

    if (status) {
      where.status = status
    }

    const cameras = await prisma.camera.findMany({
      where,
      include: {
        station: {
          select: {
            id: true,
            nameEn: true,
            nameAr: true,
            line: { select: { id: true, nameEn: true, colorHex: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(cameras)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch cameras' },
      { status: 500 }
    )
  }
}
