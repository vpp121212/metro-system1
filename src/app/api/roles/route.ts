import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/auth'

const ALL_PERMISSIONS = [
  'view_dashboard', 'manage_trains', 'manage_stations', 'manage_alerts',
  'manage_users', 'view_analytics', 'manage_maintenance', 'manage_settings',
  'view_cameras', 'manage_cameras', 'view_audit_logs', 'manage_notifications',
  'view_passenger_data', 'manage_fleet', 'system_admin',
]

export async function GET() {
  const perm = await requirePermission('system_admin')
  if (!perm.allowed) return perm.response

  try {
    const roles = await prisma.role.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        permissions: { select: { id: true, name: true } },
        _count: { select: { users: true } },
      },
      orderBy: { createdAt: 'asc' },
    })

    return NextResponse.json({ roles, allPermissions: ALL_PERMISSIONS })
  } catch {
    return NextResponse.json({ error: 'فشل في جلب الأدوار' }, { status: 500 })
  }
}
