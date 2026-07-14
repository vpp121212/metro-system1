import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/auth'

export async function GET() {
  try {
    const settings = await prisma.settings.findMany({
      orderBy: { key: 'asc' },
    })

    const settingsMap: Record<string, string> = {}
    for (const setting of settings) {
      settingsMap[setting.key] = setting.value
    }

    return NextResponse.json(settingsMap)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const perm = await requirePermission('manage_settings')
    if (!perm.allowed) return perm.response
    const body = await request.json()

    const updates = Object.entries(body).map(([key, value]) =>
      prisma.settings.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      })
    )

    await Promise.all(updates)

    const settings = await prisma.settings.findMany({
      orderBy: { key: 'asc' },
    })

    const settingsMap: Record<string, string> = {}
    for (const setting of settings) {
      settingsMap[setting.key] = setting.value
    }

    return NextResponse.json(settingsMap)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}
