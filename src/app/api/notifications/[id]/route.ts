import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const existing = await prisma.notification.findUnique({
      where: { id: params.id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      )
    }

    const notification = await prisma.notification.update({
      where: { id: params.id },
      data: { isRead: true },
    })

    return NextResponse.json(notification)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    )
  }
}
