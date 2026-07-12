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
  Camera,
  AlertTriangle,
  Clock,
  Activity,
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
import { Progress } from '@/components/ui/progress'

interface StationDetail {
  id: string
  nameEn: string
  nameAr: string
  lat: number
  lng: number
  order: number
  isInterchange: boolean
  line: {
    id: string
    nameEn: string
    nameAr: string
    color: string
    colorHex: string
  }
  trains: {
    id: string
    name: string
    code: string
    status: string
    speed: number
    direction: string
    passengerCount: number
    capacity: number
  }[]
  cameras: { id: string; name: string; status: string }[]
  _count: { trains: number; cameras: number; passengerRecords: number }
}

interface Alert {
  id: string
  type: string
  titleAr: string
  descriptionAr: string
  isAcknowledged: boolean
  createdAt: string
}

interface PassengerFlow {
  hour: number
  count: number
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function StationDetailPage() {
  const params = useParams()
  const stationId = params.id as string
  const [station, setStation] = useState<StationDetail | null>(null)
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [flowData, setFlowData] = useState<PassengerFlow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const stationRes = await fetch(`/api/stations/${stationId}`)
        if (stationRes.ok) setStation(await stationRes.json())

        const [alertsRes, flowRes] = await Promise.all([
          fetch('/api/alerts'),
          fetch('/api/analytics/passenger-flow'),
        ])
        if (alertsRes.ok) {
          const allAlerts = await alertsRes.json()
          setAlerts(allAlerts.filter((a: Alert & { station?: { id: string } }) => a.station?.id === stationId).slice(0, 5))
        }
        if (flowRes.ok) setFlowData(await flowRes.json())
      } catch {
        // handle error
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [stationId])

  const chartData = flowData.map((d) => ({
    hour: `${d.hour}:00`,
    passengers: d.count,
  }))

  const crowdDensity = station ? Math.min(((station._count.trains * 15) + (Math.random() * 30) + 20), 95) : 0

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    )
  }

  if (!station) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <AlertTriangle className="h-12 w-12 text-t-red" />
        <p className="text-t-red text-lg">المحطة غير موجودة</p>
        <Link href="/stations" className="text-t-cyan text-sm hover:underline">العودة للمحطات</Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={station.nameAr}
        description={station.nameEn}
        actions={
          <div className="flex items-center gap-3">
            {station.isInterchange && (
              <StatusBadge status="info" size="md" />
            )}
            <Link href="/stations">
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
        <div className="h-full rounded-full" style={{ backgroundColor: station.line.colorHex }} />
      </div>

      {/* Station Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-t-panel/60 backdrop-blur-md border-t-border/40">
          <CardContent className="p-5">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${station.line.colorHex}20`, border: `1px solid ${station.line.colorHex}30` }}
                >
                  <MapPin className="h-6 w-6" style={{ color: station.line.colorHex }} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{station.nameAr}</h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className="text-xs font-medium"
                      style={{ color: station.line.colorHex }}
                    >
                      {station.line.nameAr}
                    </span>
                    {station.isInterchange && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-medium bg-t-purple/15 text-t-purple border border-t-purple/25">
                        <GitBranch className="h-2 w-2" />
                        محطة تحويل
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
      >
        <motion.div variants={fadeIn}>
          <Card className="bg-t-panel/60 backdrop-blur-md border-t-border/40 border-l-[3px] border-l-t-blue">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">القطارات الحالية</p>
                  <p className="text-2xl font-bold text-white mt-1">{station._count.trains}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-t-blue/15 flex items-center justify-center">
                  <Train className="h-5 w-5 text-t-blue" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={fadeIn}>
          <Card className="bg-t-panel/60 backdrop-blur-md border-t-border/40 border-l-[3px] border-l-t-green">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">الركاب (تقديري)</p>
                  <p className="text-2xl font-bold text-white mt-1">{Math.floor(crowdDensity * 12)}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-t-green/15 flex items-center justify-center">
                  <Users className="h-5 w-5 text-t-green" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={fadeIn}>
          <Card className="bg-t-panel/60 backdrop-blur-md border-t-border/40 border-l-[3px] border-l-t-cyan">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">مستوى الازدحام</p>
                  <p className="text-2xl font-bold text-white mt-1">{Math.round(crowdDensity)}%</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-t-cyan/15 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-t-cyan" />
                </div>
              </div>
              <Progress value={crowdDensity} className="mt-3 h-1.5" />
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={fadeIn}>
          <Card className="bg-t-panel/60 backdrop-blur-md border-t-border/40 border-l-[3px] border-l-t-purple">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">الكاميرات</p>
                  <p className="text-2xl font-bold text-white mt-1">{station._count.cameras}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-t-purple/15 flex items-center justify-center">
                  <Camera className="h-5 w-5 text-t-purple" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Trains at Station */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1"
        >
          <Card className="bg-t-panel/60 backdrop-blur-md border-t-border/40 h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-white flex items-center gap-2">
                <Train className="h-4 w-4" style={{ color: station.line.colorHex }} />
                القطارات ({station.trains.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {station.trains.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-6">لا توجد قطارات في المحطة حالياً</p>
              ) : (
                station.trains.map((train) => (
                  <div
                    key={train.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-t-card/40 border border-t-border/20"
                  >
                    <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ backgroundColor: `${station.line.colorHex}20` }}>
                      <Train className="h-4 w-4" style={{ color: station.line.colorHex }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white truncate">{train.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-gray-500">{train.speed} كم/س</span>
                        <span className="text-[10px] text-gray-500">
                          {train.direction === 'FORWARD' ? 'مقدم' : 'رجعي'}
                        </span>
                      </div>
                    </div>
                    <StatusBadge
                      status={train.status === 'ACTIVE' ? 'active' : train.status === 'MAINTENANCE' ? 'maintenance' : 'offline'}
                      size="sm"
                    />
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Passenger Flow Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card className="bg-t-panel/60 backdrop-blur-md border-t-border/40 h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-white flex items-center gap-2">
                <Users className="h-4 w-4" style={{ color: station.line.colorHex }} />
                تدفق الركاب (24 ساعة)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e2a42" />
                    <XAxis dataKey="hour" stroke="#6b7280" fontSize={11} tickLine={false} interval={3} />
                    <YAxis stroke="#6b7280" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0d1321',
                        border: '1px solid #1e2a42',
                        borderRadius: '8px',
                        color: '#e2e8f0',
                      }}
                    />
                    <ReLine
                      type="monotone"
                      dataKey="passengers"
                      stroke={station.line.colorHex}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4, fill: station.line.colorHex, stroke: '#060b18', strokeWidth: 2 }}
                      name="الركاب"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Location & Alerts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Location */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="bg-t-panel/60 backdrop-blur-md border-t-border/40">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-white flex items-center gap-2">
                <MapPin className="h-4 w-4" style={{ color: station.line.colorHex }} />
                الموقع
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-t-card/40 border border-t-border/20">
                  <p className="text-xs text-gray-500">خط العرض</p>
                  <p className="text-sm text-white font-medium mt-1">{station.lat.toFixed(6)}</p>
                </div>
                <div className="p-3 rounded-lg bg-t-card/40 border border-t-border/20">
                  <p className="text-xs text-gray-500">خط الطول</p>
                  <p className="text-sm text-white font-medium mt-1">{station.lng.toFixed(6)}</p>
                </div>
              </div>
              {/* Simple map representation */}
              <div className="relative h-48 rounded-lg overflow-hidden bg-t-card/40 border border-t-border/20">
                <svg width="100%" height="100%" viewBox="0 0 400 200">
                  <defs>
                    <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor={station.line.colorHex} stopOpacity="0.3" />
                      <stop offset="100%" stopColor={station.line.colorHex} stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <rect width="400" height="200" fill="#0d1321" />
                  {Array.from({ length: 10 }).map((_, i) => (
                    <line key={`h-${i}`} x1={0} y1={i * 20} x2={400} y2={i * 20} stroke="#1e2a42" strokeWidth={0.5} />
                  ))}
                  {Array.from({ length: 20 }).map((_, i) => (
                    <line key={`v-${i}`} x1={i * 20} y1={0} x2={i * 20} y2={200} stroke="#1e2a42" strokeWidth={0.5} />
                  ))}
                  <circle cx={200} cy={100} r={60} fill="url(#mapGlow)" />
                  <circle cx={200} cy={100} r={6} fill={station.line.colorHex} stroke="#060b18" strokeWidth={2} />
                  <circle cx={200} cy={100} r={12} fill="none" stroke={station.line.colorHex} strokeWidth={1} opacity={0.4}>
                    <animate attributeName="r" values="12;20;12" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.4;0;0.4" dur="3s" repeatCount="indefinite" />
                  </circle>
                  <text x={200} y={130} textAnchor="middle" fill="white" fontSize={11} fontFamily="Cairo">
                    {station.nameAr}
                  </text>
                </svg>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Alerts */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="bg-t-panel/60 backdrop-blur-md border-t-border/40 h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-white flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-t-orange" />
                التنبيهات الأخيرة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {alerts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                  <AlertTriangle className="h-8 w-8 mb-2 opacity-30" />
                  <p className="text-sm">لا توجد تنبيهات</p>
                </div>
              ) : (
                alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-3 rounded-lg bg-t-card/40 border border-t-border/20"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-white truncate">{alert.titleAr}</p>
                      <StatusBadge
                        status={alert.type === 'CRITICAL' ? 'critical' : alert.type === 'WARNING' ? 'warning' : 'info'}
                        size="sm"
                      />
                    </div>
                    {alert.descriptionAr && (
                      <p className="text-xs text-gray-500 line-clamp-2">{alert.descriptionAr}</p>
                    )}
                    <div className="flex items-center gap-1 mt-1.5 text-[10px] text-gray-600">
                      <Clock className="h-2.5 w-2.5" />
                      {new Date(alert.createdAt).toLocaleString('ar-SA', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
