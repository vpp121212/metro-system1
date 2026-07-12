'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  Train,
  Users,
  MapPin,
  GitBranch,
  Clock,
  AlertTriangle,
} from 'lucide-react'
import {
  LineChart,
  Line as ReLine,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import PageHeader from '@/components/layout/PageHeader'
import StatusBadge from '@/components/layout/StatusBadge'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Station {
  id: string
  nameEn: string
  nameAr: string
  lat: number
  lng: number
  order: number
  isInterchange: boolean
  density?: number
}

interface LineDetail {
  id: string
  nameAr: string
  nameEn: string
  color: string
  colorHex: string
  order: number
  stations: Station[]
  _count: { trains: number; trips: number }
}

interface TrainInfo {
  id: string
  name: string
  code: string
  status: string
  speed: number
  passengerCount: number
  capacity: number
  currentStation?: { nameAr: string } | null
}

interface Alert {
  id: string
  type: string
  titleAr: string
  isAcknowledged: boolean
  createdAt: string
  station?: { nameAr: string } | null
}

interface PassengerFlow {
  hour: number
  count: number
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function LineDetailPage() {
  const params = useParams()
  const lineId = params.id as string
  const [line, setLine] = useState<LineDetail | null>(null)
  const [trains, setTrains] = useState<TrainInfo[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [flowData, setFlowData] = useState<PassengerFlow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const lineRes = await fetch(`/api/lines/${lineId}`)
        if (lineRes.ok) {
          const lineData = await lineRes.json()
          setLine(lineData)
        }

        const [trainsRes, alertsRes, flowRes] = await Promise.all([
          fetch('/api/trains'),
          fetch('/api/alerts'),
          fetch('/api/analytics/passenger-flow'),
        ])

        if (trainsRes.ok) {
          const allTrains = await trainsRes.json()
          setTrains(allTrains.filter((t: TrainInfo & { line?: { id: string } }) => t.line?.id === lineId))
        }
        if (alertsRes.ok) {
          const allAlerts = await alertsRes.json()
          setAlerts(allAlerts.filter((a: Alert & { line?: { id: string } }) => a.line?.id === lineId).slice(0, 5))
        }
        if (flowRes.ok) setFlowData(await flowRes.json())
      } catch {
        // handle error
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [lineId])

  const chartData = flowData.map((d) => ({
    hour: `${d.hour}:00`,
    passengers: d.count,
  }))

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Skeleton className="h-96 rounded-xl" />
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </div>
    )
  }

  if (!line) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <AlertTriangle className="h-12 w-12 text-t-red" />
        <p className="text-t-red text-lg">الخط غير موجود</p>
        <Link href="/lines" className="text-t-cyan text-sm hover:underline">العودة للخطوط</Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={line.nameAr}
        description={`${line.nameEn} - ${line.stations.length} محطة`}
        actions={
          <div className="flex items-center gap-3">
            <StatusBadge status="normal" size="md" />
            <Link href="/lines">
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-t-card/60 border border-t-border/40 text-gray-400 hover:text-white text-sm transition-colors">
                <ArrowLeft className="h-4 w-4" />
                العودة
              </button>
            </Link>
          </div>
        }
      />

      {/* Line Color Bar */}
      <div className="h-1.5 rounded-full overflow-hidden bg-t-dark">
        <div className="h-full rounded-full" style={{ backgroundColor: line.colorHex, width: '100%' }} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Station List */}
        <motion.div
          className="lg:col-span-2"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
        >
          <Card className="bg-t-panel/60 backdrop-blur-md border-t-border/40">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <MapPin className="h-5 w-5" style={{ color: line.colorHex }} />
                المحطات ({line.stations.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {line.stations.map((station, idx) => (
                  <motion.div key={station.id} variants={fadeIn}>
                    <Link href={`/stations/${station.id}`}>
                      <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-t-card/40 transition-colors group cursor-pointer">
                        {/* Station Number */}
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border-2"
                          style={{
                            borderColor: line.colorHex,
                            backgroundColor: idx === 0 || idx === line.stations.length - 1 ? line.colorHex : 'transparent',
                            color: idx === 0 || idx === line.stations.length - 1 ? 'white' : line.colorHex,
                          }}
                        >
                          {idx + 1}
                        </div>

                        {/* Connector Line */}
                        {idx < line.stations.length - 1 && (
                          <div className="absolute right-[1.75rem] mt-8 w-0.5 h-4" style={{ backgroundColor: line.colorHex, opacity: 0.3 }} />
                        )}

                        {/* Station Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-white group-hover:text-white truncate">{station.nameAr}</span>
                            <span className="text-xs text-gray-500 truncate hidden sm:inline">{station.nameEn}</span>
                            {station.isInterchange && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-medium bg-t-purple/15 text-t-purple border border-t-purple/25">
                                <GitBranch className="h-2 w-2" />
                                تحويل
                              </span>
                            )}
                          </div>
                        </div>

                        <ArrowRight className="h-4 w-4 text-gray-600 group-hover:text-gray-400 transition-colors shrink-0" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Active Trains */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="bg-t-panel/60 backdrop-blur-md border-t-border/40">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-white flex items-center gap-2">
                  <Train className="h-4 w-4" style={{ color: line.colorHex }} />
                  القطارات النشطة ({trains.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {trains.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">لا توجد قطارات نشطة حالياً</p>
                ) : (
                  trains.map((train) => (
                    <div
                      key={train.id}
                      className="flex items-center gap-3 p-2.5 rounded-lg bg-t-card/40 border border-t-border/20"
                    >
                      <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ backgroundColor: `${line.colorHex}20` }}>
                        <Train className="h-3.5 w-3.5" style={{ color: line.colorHex }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-white truncate">{train.name}</p>
                        <p className="text-[10px] text-gray-500">{train.currentStation?.nameAr || 'في الطريق'}</p>
                      </div>
                      <StatusBadge status={train.status === 'ACTIVE' ? 'active' : 'delayed'} size="sm" />
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Passenger Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="bg-t-panel/60 backdrop-blur-md border-t-border/40">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-white flex items-center gap-2">
                  <Users className="h-4 w-4" style={{ color: line.colorHex }} />
                  تدفق الركاب
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e2a42" />
                      <XAxis dataKey="hour" stroke="#6b7280" fontSize={10} tickLine={false} interval={5} />
                      <YAxis stroke="#6b7280" fontSize={10} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0d1321',
                          border: '1px solid #1e2a42',
                          borderRadius: '8px',
                          color: '#e2e8f0',
                          fontSize: 12,
                        }}
                      />
                      <ReLine
                        type="monotone"
                        dataKey="passengers"
                        stroke={line.colorHex}
                        strokeWidth={2}
                        dot={false}
                        name="الركاب"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Alerts */}
          {alerts.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className="bg-t-panel/60 backdrop-blur-md border-t-border/40">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-white flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-t-orange" />
                    التنبيهات
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="p-2.5 rounded-lg bg-t-card/40 border border-t-border/20">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-white truncate">{alert.titleAr}</p>
                        <StatusBadge
                          status={alert.type === 'CRITICAL' ? 'critical' : alert.type === 'WARNING' ? 'warning' : 'info'}
                          size="sm"
                        />
                      </div>
                      {alert.station && (
                        <p className="text-[10px] text-gray-500 mt-1">{alert.station.nameAr}</p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
