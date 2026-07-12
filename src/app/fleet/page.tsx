'use client'

import { useEffect, useState } from 'react'
import { Truck, Train, Wrench, CheckCircle, Clock, Activity } from 'lucide-react'
import { motion } from 'framer-motion'
import PageHeader from '@/components/layout/PageHeader'
import StatCard from '@/components/layout/StatCard'
import StatusBadge from '@/components/layout/StatusBadge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

interface FleetSummary {
  total: number
  active: number
  maintenance: number
  available: number
  totalCapacity: number
  currentPassengers: number
  name: string
}

interface TrainItem {
  id: string
  name: string
  code: string
  status: string
  capacity: number
  passengerCount: number
  line: { id: string; nameAr: string; nameEn: string; colorHex: string } | null
  currentStation: { nameAr: string } | null
}

const statusBadgeMap: Record<string, 'active' | 'maintenance' | 'inactive' | 'warning'> = {
  ACTIVE: 'active',
  MAINTENANCE: 'maintenance',
  INACTIVE: 'inactive',
  DELAYED: 'warning',
}

function FleetGauge({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  const circumference = 2 * Math.PI * 54
  const offset = circumference - (pct / 100) * circumference

  return (
    <div className="relative flex items-center justify-center">
      <svg width="140" height="140" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="54" fill="none" stroke="#1e293b" strokeWidth="8" />
        <circle
          cx="60" cy="60" r="54" fill="none"
          stroke={pct > 70 ? '#22c55e' : pct > 40 ? '#f59e0b' : '#ef4444'}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 60 60)"
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-white">{pct}%</span>
        <span className="text-[10px] text-gray-400">صحة الأسطول</span>
      </div>
    </div>
  )
}

export default function FleetPage() {
  const [fleet, setFleet] = useState<FleetSummary | null>(null)
  const [trains, setTrains] = useState<TrainItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { fetchData() }, [])

  async function fetchData() {
    setLoading(true)
    setError(null)
    try {
      const [fleetRes, trainsRes] = await Promise.all([
        fetch('/api/fleet'),
        fetch('/api/trains'),
      ])
      if (!fleetRes.ok || !trainsRes.ok) throw new Error('Failed')
      setFleet(await fleetRes.json())
      setTrains(await trainsRes.json())
    } catch {
      setError('فشل في تحميل بيانات الأسطول')
    } finally {
      setLoading(false)
    }
  }

  const grouped = trains.reduce<Record<string, TrainItem[]>>((acc, train) => {
    const key = train.line?.nameAr ?? 'غير محدد'
    if (!acc[key]) acc[key] = []
    acc[key].push(train)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <PageHeader
        title="الأسطول"
        description="إدارة ومتابعة أسطول القطارات"
        actions={<Button variant="outline" size="sm" onClick={fetchData}>تحديث</Button>}
      />

      {error ? (
        <Card className="p-8 text-center">
          <p className="text-t-red mb-3">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchData}>إعادة المحاولة</Button>
        </Card>
      ) : loading ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <Card key={i} className="p-4"><Skeleton className="h-24" /></Card>)}
          </div>
          <Card className="p-4"><Skeleton className="h-64" /></Card>
        </>
      ) : fleet ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="إجمالي القطارات" value={fleet.total} icon={<Truck className="h-5 w-5" />} color="cyan" />
            <StatCard title="نشطة" value={fleet.active} icon={<Activity className="h-5 w-5" />} color="green" />
            <StatCard title="في الصيانة" value={fleet.maintenance} icon={<Wrench className="h-5 w-5" />} color="orange" />
            <StatCard title="متاحة" value={fleet.available} icon={<CheckCircle className="h-5 w-5" />} color="blue" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-1 p-6 flex flex-col items-center justify-center">
              <FleetGauge value={fleet.active} max={fleet.total} />
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-400">الإسم</p>
                <p className="text-lg font-bold text-white">{fleet.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4 w-full">
                <div className="text-center p-3 bg-t-panel rounded-lg">
                  <p className="text-lg font-bold text-t-cyan">{fleet.totalCapacity.toLocaleString()}</p>
                  <p className="text-[10px] text-gray-400">السعة الإجمالية</p>
                </div>
                <div className="text-center p-3 bg-t-panel rounded-lg">
                  <p className="text-lg font-bold text-t-blue">{fleet.currentPassengers.toLocaleString()}</p>
                  <p className="text-[10px] text-gray-400">الركاب الحاليون</p>
                </div>
              </div>
            </Card>

            <div className="lg:col-span-2 space-y-4">
              {Object.entries(grouped).map(([lineName, lineTrains]) => (
                <Card key={lineName}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: lineTrains[0]?.line?.colorHex }} />
                      {lineName}
                      <span className="text-xs text-gray-500 font-normal mr-auto">({lineTrains.length} قطار)</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {lineTrains.map(train => (
                      <motion.div
                        key={train.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-between p-3 bg-t-panel/50 rounded-lg border border-t-border/30"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${train.line?.colorHex}15` }}>
                            <Train className="h-4 w-4" style={{ color: train.line?.colorHex }} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{train.name}</p>
                            <p className="text-[10px] text-gray-500">{train.code}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-gray-400">{train.passengerCount}/{train.capacity}</span>
                          <StatusBadge status={statusBadgeMap[train.status] || 'inactive'} size="sm" />
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}
