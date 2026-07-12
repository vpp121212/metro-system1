'use client'

import { useEffect, useState } from 'react'
import { Wrench, Plus, Calendar, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import PageHeader from '@/components/layout/PageHeader'
import StatCard from '@/components/layout/StatCard'
import StatusBadge from '@/components/layout/StatusBadge'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'

interface MaintenanceRecord {
  id: string
  type: string
  description: string
  status: string
  scheduledAt: string
  completedAt: string | null
  train: { id: string; name: string; code: string; status: string }
}

interface Train {
  id: string
  name: string
  code: string
}

const statusBadgeMap: Record<string, 'active' | 'warning' | 'completed' | 'critical' | 'inactive'> = {
  SCHEDULED: 'warning',
  IN_PROGRESS: 'active',
  COMPLETED: 'completed',
  OVERDUE: 'critical',
}

const statusLabel: Record<string, string> = {
  SCHEDULED: 'مجدول',
  IN_PROGRESS: 'قيد التنفيذ',
  COMPLETED: 'مكتمل',
  OVERDUE: 'متأخر',
}

export default function MaintenancePage() {
  const [records, setRecords] = useState<MaintenanceRecord[]>([])
  const [trains, setTrains] = useState<Train[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState({ trainId: '', type: 'PREVENTIVE', description: '', scheduledAt: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => { fetchData() }, [])

  async function fetchData() {
    setLoading(true)
    setError(null)
    try {
      const [maintRes, trainsRes] = await Promise.all([
        fetch('/api/maintenance'),
        fetch('/api/trains'),
      ])
      if (!maintRes.ok || !trainsRes.ok) throw new Error('Failed')
      setRecords(await maintRes.json())
      setTrains(await trainsRes.json())
    } catch {
      setError('فشل في تحميل بيانات الصيانة')
    } finally {
      setLoading(false)
    }
  }

  async function handleSchedule() {
    if (!form.trainId || !form.description || !form.scheduledAt) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        const newRecord = await res.json()
        setRecords(prev => [newRecord, ...prev])
        setDialogOpen(false)
        setForm({ trainId: '', type: 'PREVENTIVE', description: '', scheduledAt: '' })
      }
    } catch { /* silent */ } finally {
      setSubmitting(false)
    }
  }

  const filtered = records.filter(r => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false
    if (typeFilter !== 'all' && r.type !== typeFilter) return false
    return true
  })

  const scheduled = records.filter(r => r.status === 'SCHEDULED').length
  const inProgress = records.filter(r => r.status === 'IN_PROGRESS').length
  const completed = records.filter(r => r.status === 'COMPLETED').length
  const overdue = records.filter(r => r.status === 'OVERDUE').length

  return (
    <div className="space-y-6">
      <PageHeader
        title="الصيانة"
        description="إدارة جدول الصيانة والسجلات"
        actions={
          <Button size="sm" onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 ml-2" /> جدولة صيانة
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="مجدولة" value={scheduled} icon={<Calendar className="h-5 w-5" />} color="blue" />
        <StatCard title="قيد التنفيذ" value={inProgress} icon={<Loader2 className="h-5 w-5" />} color="orange" />
        <StatCard title="مكتملة" value={completed} icon={<CheckCircle className="h-5 w-5" />} color="green" />
        <StatCard title="متأخرة" value={overdue} icon={<AlertCircle className="h-5 w-5" />} color="red" />
      </div>

      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="الحالة" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الحالات</SelectItem>
              <SelectItem value="SCHEDULED">مجدول</SelectItem>
              <SelectItem value="IN_PROGRESS">قيد التنفيذ</SelectItem>
              <SelectItem value="COMPLETED">مكتمل</SelectItem>
              <SelectItem value="OVERDUE">متأخر</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="النوع" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الأنواع</SelectItem>
              <SelectItem value="PREVENTIVE">وقائية</SelectItem>
              <SelectItem value="CORRECTIVE">تصحيحية</SelectItem>
              <SelectItem value="EMERGENCY">طارئة</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="overflow-hidden">
        {error ? (
          <div className="p-8 text-center">
            <p className="text-t-red mb-3">{error}</p>
            <Button variant="outline" size="sm" onClick={fetchData}>إعادة المحاولة</Button>
          </div>
        ) : loading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex gap-4"><Skeleton className="h-5 w-32" /><Skeleton className="h-5 w-24" /><Skeleton className="h-5 w-20" /></div>
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>القطارة</TableHead>
                <TableHead>النوع</TableHead>
                <TableHead>الوصف</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>تاريخ الجدولة</TableHead>
                <TableHead>تاريخ الإكمال</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((record) => (
                <motion.tr key={record.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-t-border hover:bg-t-panel/50">
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium">{record.train.name}</p>
                      <p className="text-[10px] text-gray-500">{record.train.code}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-[10px]">
                      {record.type === 'PREVENTIVE' ? 'وقائية' : record.type === 'CORRECTIVE' ? 'تصحيحية' : 'طارئة'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-300 max-w-[200px] truncate">{record.description}</TableCell>
                  <TableCell><StatusBadge status={statusBadgeMap[record.status] || 'inactive'} size="sm" /></TableCell>
                  <TableCell className="text-sm text-gray-400">
                    {new Date(record.scheduledAt).toLocaleDateString('ar-SA')}
                  </TableCell>
                  <TableCell className="text-sm text-gray-400">
                    {record.completedAt ? new Date(record.completedAt).toLocaleDateString('ar-SA') : '-'}
                  </TableCell>
                </motion.tr>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center text-gray-500 py-8">لا توجد سجلات صيانة</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>جدولة صيانة جديدة</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">القطارة</label>
              <Select value={form.trainId} onValueChange={(v) => setForm({ ...form, trainId: v })}>
                <SelectTrigger><SelectValue placeholder="اختر القطارة" /></SelectTrigger>
                <SelectContent>
                  {trains.map(t => (
                    <SelectItem key={t.id} value={t.id}>{t.name} ({t.code})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">النوع</label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="PREVENTIVE">وقائية</SelectItem>
                  <SelectItem value="CORRECTIVE">تصحيحية</SelectItem>
                  <SelectItem value="EMERGENCY">طارئة</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">الوصف</label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="وصف الصيانة المطلوبة" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">تاريخ الجدولة</label>
              <Input type="datetime-local" value={form.scheduledAt} onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>إلغاء</Button>
            <Button onClick={handleSchedule} disabled={submitting || !form.trainId || !form.description || !form.scheduledAt}>
              {submitting ? 'جاري الحفظ...' : 'جدولة'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
