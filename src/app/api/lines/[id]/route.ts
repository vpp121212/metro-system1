import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const line = await prisma.line.findUnique({
      where: { id: params.id },
      include: {
        stations: {
          orderBy: { order: 'asc' },
        },
        _count: {
          select: { trains: true, trips: true },
        },
      },
    })

    if (!line) {
      return NextResponse.json(
        { error: 'Line not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(line)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch line' },
      { status: 500 }
    )
  }
}
