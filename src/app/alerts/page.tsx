'use client'

import { useEffect, useState } from 'react'
import { Bell, AlertTriangle, AlertCircle, Info, CheckCheck, Clock, MapPin } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import PageHeader from '@/components/layout/PageHeader'
import StatCard from '@/components/layout/StatCard'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'

interface Alert {
  id: string
  type: string
  titleAr: string
  descriptionAr: string
  isAcknowledged: boolean
  createdAt: string
  station?: { id: string; nameAr: string } | null
  line?: { id: string; nameAr: string; colorHex: string } | null
}

interface AlertStats {
  total: number
  acknowledged: number
  unacknowledged: number
  byType: Record<string, { total: number; acknowledged: number; unacknowledged: number }>
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'الآن'
  if (mins < 60) return `منذ ${mins} دقيقة`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `منذ ${hours} ساعة`
  const days = Math.floor(hours / 24)
  return `منذ ${days} يوم`
}

const typeIcon: Record<string, React.ReactNode> = {
  CRITICAL: <AlertCircle className="h-5 w-5 text-t-red" />,
  WARNING: <AlertTriangle className="h-5 w-5 text-t-orange" />,
  INFO: <Info className="h-5 w-5 text-t-blue" />,
}

const typeBg: Record<string, string> = {
  CRITICAL: 'bg-t-red/10 border-t-red/20',
  WARNING: 'bg-t-orange/10 border-t-orange/20',
  INFO: 'bg-t-blue/10 border-t-blue/20',
}

const typeBadge: Record<string, string> = {
  CRITICAL: 'bg-t-red/15 text-t-red border-t-red/25',
  WARNING: 'bg-t-orange/15 text-t-orange border-t-orange/25',
  INFO: 'bg-t-blue/15 text-t-blue border-t-blue/25',
}

const typeLabel: Record<string, string> = {
  CRITICAL: 'حرج',
  WARNING: 'تحذير',
  INFO: 'معلومات',
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [stats, setStats] = useState<AlertStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('all')
  const [detailAlert, setDetailAlert] = useState<string | null>(null)

  useEffect(() => { fetchAlerts() }, [])

  async function fetchAlerts() {
    setLoading(true)
    setError(null)
    try {
      const [alertsRes, statsRes] = await Promise.all([
        fetch('/api/alerts'),
        fetch('/api/alerts/stats'),
      ])
      if (!alertsRes.ok || !statsRes.ok) throw new Error('Failed')
      setAlerts(await alertsRes.json())
      setStats(await statsRes.json())
    } catch {
      setError('فشل في تحميل التنبيهات')
    } finally {
      setLoading(false)
    }
  }

  async function acknowledgeAlert(id: string) {
    try {
      const res = await fetch(`/api/alerts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAcknowledged: true }),
      })
      if (res.ok) {
        setAlerts(prev => prev.map(a => a.id === id ? { ...a, isAcknowledged: true } : a))
        setStats(prev => {
          if (!prev) return prev
          return { ...prev, unacknowledged: prev.unacknowledged - 1, acknowledged: prev.acknowledged + 1 }
        })
      }
    } catch { /* silent */ }
  }

  async function acknowledgeAll() {
    const unacked = alerts.filter(a => !a.isAcknowledged)
    await Promise.all(unacked.map(a => acknowledgeAlert(a.id)))
  }

  const filtered = alerts.filter(a => {
    if (activeTab === 'critical') return a.type === 'CRITICAL' && !a.isAcknowledged
    if (activeTab === 'warning') return a.type === 'WARNING' && !a.isAcknowledged
    if (activeTab === 'info') return a.type === 'INFO' && !a.isAcknowledged
    return true
  })

  const unackedCount = stats?.unacknowledged ?? alerts.filter(a => !a.isAcknowledged).length
  const criticalCount = stats?.byType?.CRITICAL?.unacknowledged ?? 0
  const warningCount = stats?.byType?.WARNING?.unacknowledged ?? 0
  const infoCount = stats?.byType?.INFO?.unacknowledged ?? 0

  return (
    <div className="space-y-6">
      <PageHeader
        title="مركز التنبيهات"
        description="مراقبة وإدارة جميع التنبيهات"
        actions={
          <Button variant="outline" size="sm" onClick={acknowledgeAll} disabled={unackedCount === 0}>
            <CheckCheck className="h-4 w-4 ml-2" />
            تأكيد الكل
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="حرج" value={criticalCount} icon={<AlertCircle className="h-5 w-5" />} color="red" />
        <StatCard title="تحذير" value={warningCount} icon={<AlertTriangle className="h-5 w-5" />} color="orange" />
        <StatCard title="معلومات" value={infoCount} icon={<Info className="h-5 w-5" />} color="blue" />
        <StatCard title="تم التأكيد" value={stats?.acknowledged ?? 0} icon={<CheckCheck className="h-5 w-5" />} color="green" />
      </div>

      {error ? (
        <Card className="p-8 text-center">
          <p className="text-t-red mb-3">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchAlerts}>إعادة المحاولة</Button>
        </Card>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">الكل ({alerts.length})</TabsTrigger>
            <TabsTrigger value="critical">الحرج ({criticalCount})</TabsTrigger>
            <TabsTrigger value="warning">التحذير ({warningCount})</TabsTrigger>
            <TabsTrigger value="info">المعلومات ({infoCount})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Card key={i} className="p-4"><Skeleton className="h-20 w-full" /></Card>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <Card className="p-8 text-center text-gray-500">
                لا توجد تنبيهات في هذا التصنيف
              </Card>
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {filtered.map((alert) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      layout
                    >
                      <Card className={`p-4 border ${alert.isAcknowledged ? 'opacity-60' : typeBg[alert.type] || ''}`}>
                        <div className="flex items-start gap-3">
                          <div className="shrink-0 mt-1">{typeIcon[alert.type] || <Info className="h-5 w-5 text-gray-400" />}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h4 className="text-sm font-medium text-white">{alert.titleAr}</h4>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full border ${typeBadge[alert.type]}`}>
                                {typeLabel[alert.type] || alert.type}
                              </span>
                              {alert.isAcknowledged && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-t-green/10 text-t-green border border-t-green/20">
                                  تم التأكيد
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-400 mb-2">{alert.descriptionAr}</p>
                            <div className="flex items-center gap-4 flex-wrap">
                              <span className="flex items-center gap-1 text-[10px] text-gray-500">
                                <Clock className="h-3 w-3" /> {timeAgo(alert.createdAt)}
                              </span>
                              {alert.line && (
                                <span className="flex items-center gap-1 text-[10px] text-gray-500">
                                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: alert.line.colorHex }} />
                                  {alert.line.nameAr}
                                </span>
                              )}
                              {alert.station && (
                                <span className="flex items-center gap-1 text-[10px] text-gray-500">
                                  <MapPin className="h-3 w-3" /> {alert.station.nameAr}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {!alert.isAcknowledged && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => acknowledgeAlert(alert.id)}
                              >
                                <CheckCheck className="h-3.5 w-3.5 ml-1" />
                                تأكيد
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDetailAlert(detailAlert === alert.id ? null : alert.id)}
                            >
                              التفاصيل
                            </Button>
                          </div>
                        </div>
                        <AnimatePresence>
                          {detailAlert === alert.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="mt-3 pt-3 border-t border-t-border/30 grid grid-cols-2 gap-3">
                                <div>
                                  <p className="text-[10px] text-gray-500">المعرف</p>
                                  <p className="text-xs text-gray-300 font-mono">{alert.id}</p>
                                </div>
                                <div>
                                  <p className="text-[10px] text-gray-500">النوع</p>
                                  <p className="text-xs text-gray-300">{alert.type}</p>
                                </div>
                                <div>
                                  <p className="text-[10px] text-gray-500">الوقت</p>
                                  <p className="text-xs text-gray-300">{new Date(alert.createdAt).toLocaleString('ar-SA')}</p>
                                </div>
                                <div>
                                  <p className="text-[10px] text-gray-500">الحالة</p>
                                  <p className="text-xs text-gray-300">{alert.isAcknowledged ? 'تم التأكيد' : 'غير مؤكد'}</p>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
