'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Train,
  Users,
  Clock,
  Shield,
  Bell,
  Activity,
  ArrowLeftRight,
  AlertTriangle,
  CheckCircle,
  Info,
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import PageHeader from '@/components/layout/PageHeader'
import StatCard from '@/components/layout/StatCard'
import StatusBadge from '@/components/layout/StatusBadge'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface DashboardSummary {
  activeTrains: number
  totalTrains: number
  passengersToday: number
  avgDelay: number
  safetyScore: number
  systemHealth: number
  activeAlerts: number
  criticalAlerts: number
  activeTrips: number
  stationsOnline: number
  totalStations: number
  uptimeHours: number
}

interface PassengerFlowData {
  hour: number
  count: number
}

interface LineDistributionItem {
  line: {
    id: string
    nameAr: string
    nameEn: string
    color: string
    colorHex: string
  } | null
  passengerCount: number
}

interface Alert {
  id: string
  type: string
  titleAr: string
  titleEn: string
  descriptionAr: string
  isAcknowledged: boolean
  createdAt: string
  station?: { nameAr: string } | null
  line?: { nameAr: string; colorHex: string } | null
}

interface LineStatus {
  id: string
  nameAr: string
  nameEn: string
  color: string
  colorHex: string
  stationCount: number
  activeTrains: number
  status: string
}

const LINE_COLORS = ['#2563eb', '#ef4444', '#f97316', '#eab308', '#22c55e', '#9333ea']

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [passengerFlow, setPassengerFlow] = useState<PassengerFlowData[]>([])
  const [lineDistribution, setLineDistribution] = useState<LineDistributionItem[]>([])
  const [recentAlerts, setRecentAlerts] = useState<Alert[]>([])
  const [lines, setLines] = useState<LineStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const [summaryRes, flowRes, distRes, alertsRes, linesRes] = await Promise.all([
          fetch('/api/dashboard/summary'),
          fetch('/api/analytics/passenger-flow'),
          fetch('/api/analytics/line-distribution'),
          fetch('/api/alerts'),
          fetch('/api/lines'),
        ])

        if (!summaryRes.ok) throw new Error('Failed to fetch summary')

        const summaryData = await summaryRes.json()
        setSummary(summaryData)

        if (flowRes.ok) setPassengerFlow(await flowRes.json())
        if (distRes.ok) setLineDistribution(await distRes.json())
        if (alertsRes.ok) {
          const alertsData = await alertsRes.json()
          setRecentAlerts(alertsData.slice(0, 5))
        }
        if (linesRes.ok) {
          const linesData = await linesRes.json()
          setLines(linesData.map((l: LineStatus & { tripCount: number; totalTrains: number; createdAt: string; updatedAt: string }) => ({
            id: l.id,
            nameAr: l.nameAr,
            nameEn: l.nameEn,
            color: l.color,
            colorHex: l.colorHex,
            stationCount: l.stationCount,
            activeTrains: l.activeTrains,
            status: 'normal',
          })))
        }
      } catch (err) {
        setError('فشل في تحميل البيانات')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const flowChartData = passengerFlow.map((d) => ({
    hour: `${d.hour}:00`,
    passengers: d.count,
  }))

  const pieData = lineDistribution
    .filter((d) => d.line)
    .map((d) => ({
      name: d.line!.nameAr,
      value: d.passengerCount,
      color: d.line!.colorHex,
    }))

  const alertTypeIcon = (type: string) => {
    switch (type) {
      case 'CRITICAL': return <AlertTriangle className="h-4 w-4 text-t-red" />
      case 'WARNING': return <Info className="h-4 w-4 text-t-orange" />
      case 'INFO': return <Info className="h-4 w-4 text-t-blue" />
      default: return <CheckCircle className="h-4 w-4 text-t-green" />
    }
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <AlertTriangle className="h-12 w-12 text-t-red" />
        <p className="text-t-red text-lg">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader title="لوحة التحكم" description="نظرة عامة على شبكة المetro" />

      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-64 rounded-xl" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Skeleton className="h-80 rounded-xl" />
            <Skeleton className="h-80 rounded-xl" />
          </div>
        </div>
      ) : summary ? (
        <>
          {/* Row 1: Main Stats */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          >
            <motion.div variants={fadeIn}>
              <StatCard
                title="القطارات النشطة"
                value={summary.activeTrains}
                icon={<Train className="h-5 w-5" />}
                color="blue"
                trend={{ value: 3, positive: true }}
              />
            </motion.div>
            <motion.div variants={fadeIn}>
              <StatCard
                title="الركاب اليوم"
                value={summary.passengersToday.toLocaleString('ar-SA')}
                icon={<Users className="h-5 w-5" />}
                color="green"
                trend={{ value: 8, positive: true }}
              />
            </motion.div>
            <motion.div variants={fadeIn}>
              <StatCard
                title="متوسط التأخير"
                value={`${summary.avgDelay.toFixed(1)} د`}
                icon={<Clock className="h-5 w-5" />}
                color="yellow"
                trend={{ value: 2, positive: false }}
              />
            </motion.div>
            <motion.div variants={fadeIn}>
              <StatCard
                title="مؤشر السلامة"
                value={`${summary.safetyScore}%`}
                icon={<Shield className="h-5 w-5" />}
                color="purple"
              />
            </motion.div>
          </motion.div>

          {/* Row 2: Secondary Stats */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          >
            <motion.div variants={fadeIn}>
              <StatCard
                title="التنبيهات النشطة"
                value={summary.activeAlerts}
                icon={<Bell className="h-5 w-5" />}
                color="red"
                trend={summary.criticalAlerts > 0 ? { value: summary.criticalAlerts, positive: false } : undefined}
              />
            </motion.div>
            <motion.div variants={fadeIn}>
              <div className="relative rounded-xl p-4 md:p-5 overflow-hidden bg-t-panel/60 backdrop-blur-md border border-t-border/40 border-l-[3px] border-l-t-cyan">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-400 font-medium">صحة النظام</p>
                    <p className="text-2xl md:text-3xl font-bold text-white mt-1 tabular-nums">{summary.systemHealth}%</p>
                    <Progress value={summary.systemHealth} className="mt-3 h-2 bg-t-card/50" />
                  </div>
                  <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-t-cyan/20 to-t-cyan/5 border border-t-cyan/30 text-t-cyan">
                    <Activity className="h-5 w-5" />
                  </div>
                </div>
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-gradient-to-br from-t-cyan" />
              </div>
            </motion.div>
            <motion.div variants={fadeIn}>
              <StatCard
                title="الرحلات النشطة"
                value={summary.activeTrips}
                icon={<ArrowLeftRight className="h-5 w-5" />}
                color="orange"
              />
            </motion.div>
          </motion.div>

          {/* Line Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-t-panel/60 backdrop-blur-md border-t-border/40">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-white">حالة الخطوط</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {lines.map((line) => (
                    <div
                      key={line.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-t-card/40 border border-t-border/30 hover:border-t-border/60 transition-colors"
                    >
                      <div
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: line.colorHex }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white truncate">{line.nameAr}</span>
                          <StatusBadge status={line.status as 'normal' | 'delayed'} size="sm" />
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                          <span>{line.stationCount} محطة</span>
                          <span>{line.activeTrains} قطار</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-t-panel/60 backdrop-blur-md border-t-border/40 h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-white">تدفق الركاب (24 ساعة)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={flowChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e2a42" />
                        <XAxis
                          dataKey="hour"
                          stroke="#6b7280"
                          fontSize={11}
                          tickLine={false}
                          interval={3}
                        />
                        <YAxis stroke="#6b7280" fontSize={11} tickLine={false} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#0d1321',
                            border: '1px solid #1e2a42',
                            borderRadius: '8px',
                            color: '#e2e8f0',
                          }}
                          labelStyle={{ color: '#9ca3af' }}
                        />
                        <Line
                          type="monotone"
                          dataKey="passengers"
                          stroke="#06b6d4"
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 4, fill: '#06b6d4', stroke: '#060b18', strokeWidth: 2 }}
                          name="الركاب"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="bg-t-panel/60 backdrop-blur-md border-t-border/40 h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-white">توزيع الركاب حسب الخط</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={3}
                          dataKey="value"
                          stroke="none"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#0d1321',
                            border: '1px solid #1e2a42',
                            borderRadius: '8px',
                            color: '#e2e8f0',
                          }}
                        />
                        <Legend
                          formatter={(value) => <span className="text-gray-300 text-sm">{value}</span>}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Recent Alerts */}
          {recentAlerts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="bg-t-panel/60 backdrop-blur-md border-t-border/40">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-white">آخر التنبيهات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {recentAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-t-card/40 border border-t-border/30"
                      >
                        {alertTypeIcon(alert.type)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{alert.titleAr}</p>
                          <p className="text-xs text-gray-500 truncate mt-0.5">
                            {alert.station?.nameAr || alert.line?.nameAr || 'النظام'}
                          </p>
                        </div>
                        <StatusBadge
                          status={alert.type === 'CRITICAL' ? 'critical' : alert.type === 'WARNING' ? 'warning' : 'info'}
                          size="sm"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </>
      ) : null}
    </div>
  )
}
