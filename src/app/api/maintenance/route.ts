import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const where: Record<string, unknown> = {}

    if (status) {
      where.status = status
    }

    const records = await prisma.maintenanceRecord.findMany({
      where,
      include: {
        train: {
          select: { id: true, name: true, code: true, status: true },
        },
      },
      orderBy: { scheduledAt: 'desc' },
    })

    return NextResponse.json(records)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch maintenance records' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { trainId, type, description, scheduledAt } = body

    const record = await prisma.maintenanceRecord.create({
      data: {
        trainId,
        type,
        description,
        scheduledAt: new Date(scheduledAt),
      },
      include: {
        train: {
          select: { id: true, name: true, code: true },
        },
      },
    })

    return NextResponse.json(record, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create maintenance record' },
      { status: 500 }
    )
  }
}
