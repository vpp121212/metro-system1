'use client'

import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, ArrowRightLeft, Filter, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'
import PageHeader from '@/components/layout/PageHeader'
import StatCard from '@/components/layout/StatCard'
import StatusBadge from '@/components/layout/StatusBadge'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

interface Trip {
  id: string
  status: string
  scheduledAt: string
  actualStartAt: string | null
  delayMinutes: number
  train: { id: string; name: string; code: string }
  line: { id: string; nameAr: string; nameEn: string; color: string; colorHex: string }
  fromStation: { id: string; nameAr: string; nameEn: string }
  toStation: { id: string; nameAr: string; nameEn: string }
}

interface TripsResponse {
  trips: Trip[]
  total: number
  page: number
  limit: number
  totalPages: number
}

interface Line {
  id: string
  nameAr: string
  nameEn: string
  colorHex: string
}

const statusLabels: Record<string, string> = {
  SCHEDULED: 'مجدول',
  ON_TIME: 'في الوقت',
  DELAYED: 'متأخر',
  CANCELLED: 'ملغي',
  COMPLETED: 'مكتمل',
  ACTIVE: 'نشط',
}

const statusBadgeMap: Record<string, 'active' | 'warning' | 'critical' | 'completed' | 'inactive'> = {
  SCHEDULED: 'inactive',
  ON_TIME: 'active',
  DELAYED: 'warning',
  CANCELLED: 'critical',
  COMPLETED: 'completed',
  ACTIVE: 'active',
}

export default function TripsPage() {
  const [tripsData, setTripsData] = useState<TripsResponse | null>(null)
  const [lines, setLines] = useState<Line[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [lineFilter, setLineFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  useEffect(() => {
    fetchLines()
  }, [])

  useEffect(() => {
    fetchTrips()
  }, [page, lineFilter, statusFilter])

  async function fetchLines() {
    try {
      const res = await fetch('/api/lines')
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setLines(data)
    } catch {
      // silent
    }
  }

  async function fetchTrips() {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' })
      if (lineFilter !== 'all') params.set('line', lineFilter)
      if (statusFilter !== 'all') params.set('status', statusFilter)
      const res = await fetch(`/api/trips?${params}`)
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setTripsData(data)
    } catch {
      setError('فشل في تحميل الرحلات')
    } finally {
      setLoading(false)
    }
  }

  const totalTrips = tripsData?.total ?? 0
  const scheduled = tripsData?.trips.filter(t => t.status === 'SCHEDULED').length ?? 0
  const delayed = tripsData?.trips.filter(t => t.status === 'DELAYED').length ?? 0
  const completed = tripsData?.trips.filter(t => t.status === 'COMPLETED').length ?? 0

  return (
    <div className="space-y-6">
      <PageHeader
        title="الرحلات"
        description="إدارة ومتابعة رحلات المترو"
        actions={
          <Button variant="outline" size="sm" onClick={fetchTrips}>
            <Filter className="h-4 w-4 ml-2" />
            تحديث
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="إجمالي الرحلات" value={totalTrips} icon={<ArrowRightLeft className="h-5 w-5" />} color="cyan" />
        <StatCard title="مجدولة" value={scheduled} icon={<Calendar className="h-5 w-5" />} color="blue" />
        <StatCard title="متأخرة" value={delayed} icon={<ArrowRightLeft className="h-5 w-5" />} color="orange" />
        <StatCard title="مكتملة" value={completed} icon={<ArrowRightLeft className="h-5 w-5" />} color="green" />
      </div>

      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={lineFilter} onValueChange={setLineFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="الخط" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الخطوط</SelectItem>
              {lines.map(line => (
                <SelectItem key={line.id} value={line.id}>{line.nameAr}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="الحالة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الحالات</SelectItem>
              <SelectItem value="SCHEDULED">مجدول</SelectItem>
              <SelectItem value="ON_TIME">في الوقت</SelectItem>
              <SelectItem value="DELAYED">متأخر</SelectItem>
              <SelectItem value="CANCELLED">ملغي</SelectItem>
              <SelectItem value="COMPLETED">مكتمل</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-2 flex-1">
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="flex-1"
            />
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden">
        {error ? (
          <div className="p-8 text-center">
            <p className="text-t-red mb-3">{error}</p>
            <Button variant="outline" size="sm" onClick={fetchTrips}>إعادة المحاولة</Button>
          </div>
        ) : loading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
              </div>
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>القطارة</TableHead>
                <TableHead>من محطة</TableHead>
                <TableHead>إلى محطة</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>المجدول</TableHead>
                <TableHead>البداية الفعلية</TableHead>
                <TableHead>التأخير</TableHead>
                <TableHead>الركاب</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tripsData?.trips.map((trip) => (
                <motion.tr
                  key={trip.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-t-border hover:bg-t-panel/50"
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: trip.line.colorHex }} />
                      <span className="text-sm font-medium">{trip.train.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-300">{trip.fromStation.nameAr}</TableCell>
                  <TableCell className="text-sm text-gray-300">{trip.toStation.nameAr}</TableCell>
                  <TableCell>
                    <StatusBadge status={statusBadgeMap[trip.status] || 'inactive'} size="sm" />
                  </TableCell>
                  <TableCell className="text-sm text-gray-400">
                    {new Date(trip.scheduledAt).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                  </TableCell>
                  <TableCell className="text-sm text-gray-400">
                    {trip.actualStartAt
                      ? new Date(trip.actualStartAt).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
                      : '-'}
                  </TableCell>
                  <TableCell>
                    <span className={trip.delayMinutes > 0 ? 'text-t-orange text-sm font-medium' : 'text-gray-500 text-sm'}>
                      {trip.delayMinutes > 0 ? `${trip.delayMinutes} د` : '-'}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-400">-</TableCell>
                </motion.tr>
              ))}
              {(!tripsData?.trips || tripsData.trips.length === 0) && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-gray-500 py-8">
                    لا توجد رحلات
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Card>

      {tripsData && tripsData.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400">
            صفحة {tripsData.page} من {tripsData.totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage(p => p - 1)}
            >
              <ChevronRight className="h-4 w-4" />
              السابق
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= tripsData.totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              التالي
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
