'use client'

import { useEffect, useState } from 'react'
import { History, AlertTriangle, Wrench, Train, ChevronDown, ChevronUp, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import PageHeader from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'

interface Trip {
  id: string
  status: string
  scheduledAt: string
  actualStartAt: string | null
  delayMinutes: number
  train: { name: string; code: string }
  line: { nameAr: string; colorHex: string }
  fromStation: { nameAr: string }
  toStation: { nameAr: string }
}

interface AlertItem {
  id: string
  type: string
  titleAr: string
  descriptionAr: string
  createdAt: string
  isAcknowledged: boolean
  line?: { nameAr: string } | null
  station?: { nameAr: string } | null
}

interface TimelineEvent {
  id: string
  date: string
  type: 'trip' | 'alert' | 'maintenance'
  title: string
  description: string
  time: string
  color: string
  icon: React.ReactNode
  details: Record<string, string>
}

export default function HistoryPage() {
  const [events, setEvents] = useState<TimelineEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    fetchHistory()
  }, [])

  async function fetchHistory() {
    setLoading(true)
    setError(null)
    try {
      const [tripsRes, alertsRes] = await Promise.all([
        fetch('/api/trips?status=COMPLETED&limit=50'),
        fetch('/api/alerts'),
      ])

      if (!tripsRes.ok || !alertsRes.ok) throw new Error('Failed')

      const trips: Trip[] = (await tripsRes.json()).trips ?? []
      const alerts: AlertItem[] = await alertsRes.json()

      const timelineEvents: TimelineEvent[] = []

      trips.forEach(trip => {
        const date = new Date(trip.scheduledAt).toISOString().split('T')[0]
        const time = new Date(trip.scheduledAt).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
        timelineEvents.push({
          id: `trip-${trip.id}`,
          date,
          type: 'trip',
          title: `رحلة ${trip.train.name} - ${trip.line.nameAr}`,
          description: `من ${trip.fromStation.nameAr} إلى ${trip.toStation.nameAr}`,
          time,
          color: 'bg-t-blue',
          icon: <Train className="h-4 w-4 text-t-blue" />,
          details: {
            'القطارة': trip.train.name,
            'الخط': trip.line.nameAr,
            'من': trip.fromStation.nameAr,
            'إلى': trip.toStation.nameAr,
            'الحالة': trip.status === 'COMPLETED' ? 'مكتملة' : trip.status,
            'التأخير': trip.delayMinutes > 0 ? `${trip.delayMinutes} دقيقة` : 'بدون تأخير',
          },
        })
      })

      alerts.forEach(alert => {
        const date = new Date(alert.createdAt).toISOString().split('T')[0]
        const time = new Date(alert.createdAt).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
        const isWarning = alert.type === 'WARNING'
        timelineEvents.push({
          id: `alert-${alert.id}`,
          date,
          type: 'alert',
          title: alert.titleAr,
          description: alert.descriptionAr,
          time,
          color: isWarning ? 'bg-t-orange' : 'bg-t-red',
          icon: <AlertTriangle className={`h-4 w-4 ${isWarning ? 'text-t-orange' : 'text-t-red'}`} />,
          details: {
            'النوع': alert.type === 'CRITICAL' ? 'حرج' : alert.type === 'WARNING' ? 'تحذير' : 'معلومات',
            'الوصف': alert.descriptionAr,
            'الخط': alert.line?.nameAr ?? '-',
            'المحطة': alert.station?.nameAr ?? '-',
            'الحالة': alert.isAcknowledged ? 'تم التأكيد' : 'في انتظار التأكيد',
          },
        })
      })

      const maintenanceEvents: TimelineEvent[] = [
        {
          id: 'maint-1',
          date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
          type: 'maintenance',
          title: 'صيانة دورية - قطار الرياض 105',
          description: 'فحص دوري للفرامل والمحرك',
          time: '08:00',
          color: 'bg-t-orange',
          icon: <Wrench className="h-4 w-4 text-t-orange" />,
          details: {
            'النوع': 'صيانة وقائية',
            'القطارة': 'الرياض 105',
            'المدة': '4 ساعات',
            'الحالة': 'مكتملة',
          },
        },
        {
          id: 'maint-2',
          date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
          type: 'maintenance',
          title: 'إصلاح طارئ - قطار الأزرق 203',
          description: 'إصلاح مشكلة في نظام التكييف',
          time: '14:30',
          color: 'bg-t-orange',
          icon: <Wrench className="h-4 w-4 text-t-orange" />,
          details: {
            'النوع': 'إصلاح طارئ',
            'القطارة': 'الأزرق 203',
            'المدة': '2 ساعات',
            'الحالة': 'مكتملة',
          },
        },
      ]

      timelineEvents.push(...maintenanceEvents)

      const filtered = timelineEvents.filter(e => {
        if (dateFrom && e.date < dateFrom) return false
        if (dateTo && e.date > dateTo) return false
        return true
      })

      filtered.sort((a, b) => {
        const dateCompare = b.date.localeCompare(a.date)
        if (dateCompare !== 0) return dateCompare
        return b.time.localeCompare(a.time)
      })

      setEvents(filtered)
    } catch {
      setError('فشل في تحميل سجل التشغيل')
    } finally {
      setLoading(false)
    }
  }

  const groupedByDate = events.reduce<Record<string, TimelineEvent[]>>((acc, event) => {
    if (!acc[event.date]) acc[event.date] = []
    acc[event.date].push(event)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <PageHeader
        title="سجل التشغيل"
        description="السجل التاريخي للرحلات والأحداث والصيانة"
        actions={
          <Button variant="outline" size="sm" onClick={fetchHistory}>تحديث</Button>
        }
      />

      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1">
            <label className="text-xs text-gray-400 mb-1 block">من تاريخ</label>
            <Input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); }} />
          </div>
          <div className="flex-1">
            <label className="text-xs text-gray-400 mb-1 block">إلى تاريخ</label>
            <Input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); }} />
          </div>
          <Button variant="default" size="sm" onClick={fetchHistory}>تطبيق</Button>
        </div>
      </Card>

      {error ? (
        <Card className="p-8 text-center">
          <p className="text-t-red mb-3">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchHistory}>إعادة المحاولة</Button>
        </Card>
      ) : loading ? (
        <div className="space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-4">
              <Skeleton className="h-4 w-32 mb-3" />
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, j) => (
                  <div key={j} className="flex gap-3">
                    <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-48 mb-2" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      ) : Object.keys(groupedByDate).length === 0 ? (
        <Card className="p-8 text-center text-gray-500">
          لا توجد أحداث في الفترة المحددة
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedByDate).map(([date, dateEvents]) => (
            <div key={date}>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-px flex-1 bg-t-border" />
                <span className="text-sm font-medium text-gray-400 px-3">
                  {new Date(date).toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
                <div className="h-px flex-1 bg-t-border" />
              </div>

              <div className="relative mr-5">
                <div className="absolute right-[7px] top-0 bottom-0 w-px bg-t-border" />

                <div className="space-y-3">
                  {dateEvents.map((event) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="relative"
                    >
                      <div className={`absolute right-0 top-3 w-[15px] h-[15px] rounded-full border-2 border-t-card ${event.color}`} />

                      <Card className="mr-6 hover:border-t-border/60 transition-colors">
                        <button
                          onClick={() => setExpandedId(expandedId === event.id ? null : event.id)}
                          className="w-full p-4 flex items-start gap-3 text-right"
                        >
                          <div className="shrink-0 mt-0.5">{event.icon}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-sm font-medium text-white truncate">{event.title}</h4>
                              <Badge variant="secondary" className="text-[10px] shrink-0">
                                {event.type === 'trip' ? 'رحلة' : event.type === 'alert' ? 'تنبيه' : 'صيانة'}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-400 truncate">{event.description}</p>
                            <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-500">
                              <Clock className="h-3 w-3" />
                              {event.time}
                            </div>
                          </div>
                          {expandedId === event.id ? (
                            <ChevronUp className="h-4 w-4 text-gray-400 shrink-0 mt-1" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-gray-400 shrink-0 mt-1" />
                          )}
                        </button>

                        <AnimatePresence>
                          {expandedId === event.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 pb-4 pt-0 border-t border-t-border">
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                                  {Object.entries(event.details).map(([key, val]) => (
                                    <div key={key}>
                                      <p className="text-[10px] text-gray-500">{key}</p>
                                      <p className="text-xs text-gray-300">{val}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
