'use client'

import { useEffect, useState } from 'react'
import { BarChart3, TrendingUp, Brain, Clock, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  PieChart, Pie, Cell,
  LineChart, Line, CartesianGrid,
} from 'recharts'
import PageHeader from '@/components/layout/PageHeader'
import StatCard from '@/components/layout/StatCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'

interface WeeklyData { date: string; count: number }
interface DelayData { line: { nameAr: string; colorHex: string } | null; avgDelay: number; totalTrips: number }
interface StationDensityData { rank: number; station: { nameAr: string } | null; totalPassengers: number; avgDensity: number }
interface PerformanceData { reliability: number; punctuality: number; safety: number; fleetUtilization: number; avgDelay: number; totalPassengers: number }
interface LineDistData { line: { nameAr: string; colorHex: string } | null; passengerCount: number }
interface PassengerFlowData { hour: number; count: number }
interface PredictionData { hour: string; predictedPassengers: number; confidence: number; trend: string }

const COLORS = ['#06b6d4', '#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([])
  const [delayData, setDelayData] = useState<DelayData[]>([])
  const [densityData, setDensityData] = useState<StationDensityData[]>([])
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null)
  const [lineDistData, setLineDistData] = useState<LineDistData[]>([])
  const [flowData, setFlowData] = useState<PassengerFlowData[]>([])
  const [predictions, setPredictions] = useState<PredictionData[]>([])

  useEffect(() => { fetchAllData() }, [])

  async function fetchAllData() {
    setLoading(true)
    setError(null)
    try {
      const [weekly, delays, density, perf, lineDist, flow, preds] = await Promise.all([
        fetch('/api/analytics/weekly').then(r => r.json()),
        fetch('/api/analytics/delays').then(r => r.json()),
        fetch('/api/analytics/station-density').then(r => r.json()),
        fetch('/api/analytics/performance').then(r => r.json()),
        fetch('/api/analytics/line-distribution').then(r => r.json()),
        fetch('/api/analytics/passenger-flow').then(r => r.json()),
        fetch('/api/analytics/predictions').then(r => r.json()),
      ])
      setWeeklyData(weekly)
      setDelayData(delays)
      setDensityData(density)
      setPerformanceData(perf)
      setLineDistData(lineDist)
      setFlowData(flow)
      setPredictions(preds)
    } catch {
      setError('فشل في تحميل بيانات التحليلات')
    } finally {
      setLoading(false)
    }
  }

  const radarData = performanceData ? [
    { subject: 'الموثوقية', value: performanceData.reliability },
    { subject: 'الدقة', value: performanceData.punctuality },
    { subject: 'السلامة', value: performanceData.safety },
    { subject: 'الأسطول', value: performanceData.fleetUtilization },
  ] : []

  return (
    <div className="space-y-6">
      <PageHeader
        title="التحليلات"
        description="تحليلات شاملة لأداء شبكة المترو"
        actions={<Button variant="outline" size="sm" onClick={fetchAllData}>تحديث</Button>}
      />

      {error ? (
        <Card className="p-8 text-center">
          <p className="text-t-red mb-3">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchAllData}>إعادة المحاولة</Button>
        </Card>
      ) : loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-4"><Skeleton className="h-64 w-full" /></Card>
          ))}
        </div>
      ) : (
        <>
          {performanceData && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="إجمالي الركاب" value={performanceData.totalPassengers.toLocaleString()} icon={<Users className="h-5 w-5" />} color="cyan" />
              <StatCard title="الموثوقية" value={`${performanceData.reliability}%`} icon={<TrendingUp className="h-5 w-5" />} color="green" />
              <StatCard title="التأخير المتوسط" value={`${performanceData.avgDelay} د`} icon={<Clock className="h-5 w-5" />} color="orange" />
              <StatCard title="استغلال الأسطول" value={`${performanceData.fleetUtilization}%`} icon={<BarChart3 className="h-5 w-5" />} color="blue" />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">حركة الركاب الأسبوعية</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 10 }} tickFormatter={v => v.slice(5)} />
                    <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, color: '#fff' }} />
                    <Bar dataKey="count" fill="#06b6d4" radius={[4, 4, 0, 0]} name="الركاب" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">التأخير حسب الخط</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={delayData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 10 }} />
                    <YAxis type="category" dataKey={d => d.line?.nameAr ?? '?'} tick={{ fill: '#6b7280', fontSize: 10 }} width={80} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, color: '#fff' }} />
                    <Bar dataKey="avgDelay" fill="#f59e0b" radius={[0, 4, 4, 0]} name="متوسط التأخير (د)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">تصنيف المحطات حسب الكثافة</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={densityData.slice(0, 8)} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 10 }} />
                    <YAxis type="category" dataKey={d => d.station?.nameAr ?? '?'} tick={{ fill: '#6b7280', fontSize: 10 }} width={80} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, color: '#fff' }} />
                    <Bar dataKey="totalPassengers" fill="#3b82f6" radius={[0, 4, 4, 0]} name="الركاب" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">أداء النظام</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#1e293b" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 9 }} />
                    <Radar name="الأداء" dataKey="value" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.3} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">توزيع الركاب حسب الخط</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={lineDistData.map(d => ({ name: d.line?.nameAr ?? '?', value: d.passengerCount }))}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={90}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {lineDistData.map((_, i) => (
                        <Cell key={i} fill={lineDistData[i].line?.colorHex || COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, color: '#fff' }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">حركة الركاب خلال 24 ساعة</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={flowData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="hour" tick={{ fill: '#6b7280', fontSize: 10 }} tickFormatter={v => `${v}:00`} />
                    <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, color: '#fff' }} />
                    <Line type="monotone" dataKey="count" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e', r: 3 }} name="الركاب" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Brain className="h-5 w-5 text-t-purple" />
              تنبؤات الذكاء الاصطناعي
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {predictions.slice(0, 3).map((pred, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <Card className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-t-purple/10 border border-t-purple/20 flex items-center justify-center">
                        <Brain className="h-5 w-5 text-t-purple" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">تنبؤ #{i + 1}</p>
                        <p className="text-sm font-medium text-white">
                          {i === 0 ? 'توقع التزاحم' : i === 1 ? 'صيانة مخططة' : 'توقع الركاب'}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">
                          {i === 0 ? 'الركاب المتوقعون' : i === 1 ? 'الثقة' : 'الركاب المتوقعون'}
                        </span>
                        <span className="text-white font-medium">
                          {i === 0 ? `${pred.predictedPassengers} راكب` : i === 1 ? `${pred.confidence}%` : `${pred.predictedPassengers} راكب`}
                        </span>
                      </div>
                      <Progress value={pred.confidence} className="h-2" />
                      <div className="flex justify-between text-[10px]">
                        <span className="text-gray-500">
                          {new Date(pred.hour).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className={pred.trend === 'increasing' ? 'text-t-orange' : pred.trend === 'decreasing' ? 'text-t-green' : 'text-gray-400'}>
                          {pred.trend === 'increasing' ? '↑ متزايد' : pred.trend === 'decreasing' ? '↓ متناقص' : '→ مستقر'}
                        </span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
