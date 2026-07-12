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
        <div className="space-y-10">
          <div>
            <Skeleton className="h-5 w-48 mb-5" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-36 rounded-2xl" />
              ))}
            </div>
          </div>
          <div>
            <Skeleton className="h-5 w-40 mb-5" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-2xl" />
              ))}
            </div>
          </div>
          <div>
            <Skeleton className="h-5 w-32 mb-5" />
            <Skeleton className="h-52 rounded-2xl" />
          </div>
          <div>
            <Skeleton className="h-5 w-44 mb-5" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <Skeleton className="h-80 rounded-2xl" />
              <Skeleton className="h-80 rounded-2xl" />
            </div>
          </div>
        </div>
      ) : summary ? (
        <>
          {/* Section 1: Key Metrics */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-8 w-1 rounded-full bg-gradient-to-b from-t-cyan to-t-blue" />
              <div>
                <h2 className="text-lg font-bold text-white">المؤشرات الرئيسية</h2>
                <p className="text-xs text-gray-500">أهم مؤشرات أداء الشبكة في الوقت الفعلي</p>
              </div>
            </div>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
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
                  subtitle={`من أصل ${summary.totalTrains}`}
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
          </div>

          {/* Section 2: System Status */}
          <div>
            <div className="flex items-center gap-3 mb-5 mt-8">
              <div className="h-8 w-1 rounded-full bg-gradient-to-b from-t-green to-t-cyan" />
              <div>
                <h2 className="text-lg font-bold text-white">حالة النظام</h2>
                <p className="text-xs text-gray-500">حالة التشغيل والصحة العامة للشبكة</p>
              </div>
            </div>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
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
                  subtitle={summary.criticalAlerts > 0 ? `${summary.criticalAlerts} حرجة` : undefined}
                />
              </motion.div>
              <motion.div variants={fadeIn}>
                <div className="relative rounded-2xl p-5 overflow-hidden bg-t-panel/60 backdrop-blur-md border border-t-border/40 border-l-[3px] border-l-t-cyan h-full">
                  <div className="flex items-start justify-between h-full">
                    <div className="min-w-0 flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-sm text-gray-400 font-medium">صحة النظام</p>
                        <p className="text-3xl md:text-4xl font-bold text-white mt-2 tabular-nums">{summary.systemHealth}%</p>
                      </div>
                      <div>
                        <Progress value={summary.systemHealth} className="mt-4 h-2.5 bg-t-card/50 rounded-full" />
                        <p className="text-xs text-gray-500 mt-2">
                          {summary.systemHealth >= 98 ? 'ممتاز' : summary.systemHealth >= 90 ? 'جيد' : 'بحاجة للانتباه'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-t-cyan/20 to-t-cyan/5 border border-t-cyan/30 text-t-cyan shrink-0">
                      <Activity className="h-6 w-6" />
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
          </div>

          {/* Section 3: Line Status */}
          <div>
            <div className="flex items-center gap-3 mb-5 mt-8">
              <div className="h-8 w-1 rounded-full bg-gradient-to-b from-t-purple to-t-blue" />
              <div>
                <h2 className="text-lg font-bold text-white">حالة الخطوط</h2>
                <p className="text-xs text-gray-500">مؤشرات أداء خطوط المترو الستة</p>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-t-panel/60 backdrop-blur-md border-t-border/40 rounded-2xl">
                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {lines.map((line) => (
                      <div
                        key={line.id}
                        className="flex items-center gap-4 p-4 rounded-xl bg-t-card/40 border border-t-border/30 hover:border-t-border/60 hover:bg-t-card/60 transition-all"
                      >
                        <div
                          className="w-4 h-4 rounded-full shrink-0 shadow-lg"
                          style={{ backgroundColor: line.colorHex, boxShadow: `0 0 12px ${line.colorHex}44` }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-white truncate">{line.nameAr}</span>
                            <StatusBadge status={line.status as 'normal' | 'delayed'} size="sm" />
                          </div>
                          <div className="flex items-center gap-4 mt-1.5 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-t-blue/60" />
                              {line.stationCount} محطة
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-t-green/60" />
                              {line.activeTrains} قطار
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Section 4: Analytics & Alerts */}
          <div>
            <div className="flex items-center gap-3 mb-5 mt-8">
              <div className="h-8 w-1 rounded-full bg-gradient-to-b from-t-orange to-t-yellow" />
              <div>
                <h2 className="text-lg font-bold text-white">التحليلات والتنبيهات</h2>
                <p className="text-xs text-gray-500">تحليلات حركة الركاب وآخر التنبيهات</p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="bg-t-panel/60 backdrop-blur-md border-t-border/40 rounded-2xl h-full">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base text-white">تدفق الركاب (24 ساعة)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[280px]">
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
                <Card className="bg-t-panel/60 backdrop-blur-md border-t-border/40 rounded-2xl h-full">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base text-white">توزيع الركاب حسب الخط</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[280px]">
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
          </div>

          {/* Recent Alerts */}
          {recentAlerts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-5 mt-8">
                <div className="h-8 w-1 rounded-full bg-gradient-to-b from-t-red to-t-orange" />
                <div>
                  <h2 className="text-lg font-bold text-white">آخر التنبيهات</h2>
                  <p className="text-xs text-gray-500">أحدث 5 تنبيهات على الشبكة</p>
                </div>
              </div>
              <Card className="bg-t-panel/60 backdrop-blur-md border-t-border/40 rounded-2xl">
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    {recentAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        className="flex items-center gap-4 p-4 rounded-xl bg-t-card/40 border border-t-border/30 hover:border-t-border/60 transition-all"
                      >
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-t-card/60 border border-t-border/30 shrink-0">
                          {alertTypeIcon(alert.type)}
                        </div>
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
