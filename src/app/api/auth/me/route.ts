import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getSessionUser()
    if (!user) return NextResponse.json(null, { status: 401 })

    return NextResponse.json({
      id: user.id,
      employeeId: user.employeeId,
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
      stationId: user.stationId,
      stationName: user.stationName,
    })
  } catch {
    return NextResponse.json(null, { status: 500 })
  }
}
