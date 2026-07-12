import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const lines = await prisma.line.findMany({
      include: {
        stations: {
          select: {
            id: true,
            nameEn: true,
            nameAr: true,
            lat: true,
            lng: true,
            order: true,
            isInterchange: true,
          },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { order: 'asc' },
    })

    const result = lines.map((line) => ({
      id: line.id,
      nameAr: line.nameAr,
      nameEn: line.nameEn,
      color: line.color,
      colorHex: line.colorHex,
      order: line.order,
      stations: line.stations,
    }))

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch map lines' },
      { status: 500 }
    )
  }
}
