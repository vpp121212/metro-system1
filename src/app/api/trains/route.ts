import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const lineId = searchParams.get('line')
    const status = searchParams.get('status')

    const where: Record<string, unknown> = {}

    if (lineId) {
      where.lineId = lineId
    }

    if (status) {
      where.status = status
    }

    const trains = await prisma.train.findMany({
      where,
      include: {
        line: {
          select: { id: true, nameEn: true, nameAr: true, color: true, colorHex: true },
        },
        currentStation: {
          select: { id: true, nameEn: true, nameAr: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(trains)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch trains' },
      { status: 500 }
    )
  }
}
