'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, Plus, Filter, Search, CheckCircle, Clock, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import PageHeader from '@/components/layout/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/lib/auth-context'
import { toast } from 'sonner'

interface Incident {
  id: string
  type: string
  description: string
  status: string
  priority: string
  stationId: string | null
  station: { nameAr: string; nameEn: string } | null
  reportedBy: { name: string } | null
  assignedTo: { name: string } | null
  createdAt: string
  resolvedAt: string | null
}

const typeLabels: Record<string, string> = {
  THEFT: 'سرقة', FIGHT: 'شجار', DAMAGE: 'تخريب', FIRE: 'حريق',
  SUSPICIOUS: 'مشبوه', MEDICAL: 'طبي', OTHER: 'آخر',
}

const statusLabels: Record<string, string> = { OPEN: 'مفتوح', INVESTIGATING: 'قيد التحقيق', RESOLVED: 'تم الحل' }
const priorityLabels: Record<string, string> = { LOW: 'منخفض', MEDIUM: 'متوسط', HIGH: 'عالي', CRITICAL: 'خطير' }
const statusColors: Record<string, string> = { OPEN: 'text-yellow-400 bg-yellow-400/10', INVESTIGATING: 'text-blue-400 bg-blue-400/10', RESOLVED: 'text-green-400 bg-green-400/10' }
const priorityColors: Record<string, string> = { LOW: 'text-gray-400', MEDIUM: 'text-yellow-400', HIGH: 'text-orange-400', CRITICAL: 'text-red-400' }

export default function IncidentsPage() {
  const { user } = useAuth()
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [showNewForm, setShowNewForm] = useState(false)
  const [newIncident, setNewIncident] = useState({ type: 'OTHER', description: '', stationId: '', priority: 'MEDIUM' })
  const [stations, setStations] = useState<{ id: string; nameAr: string }[]>([])

  useEffect(() => { fetchIncidents(); fetchStations() }, [])

  async function fetchIncidents() {
    try {
      const res = await fetch('/api/incidents')
      if (res.ok) setIncidents(await res.json())
    } catch {} finally { setLoading(false) }
  }

  async function fetchStations() {
    try {
      const res = await fetch('/api/stations')
      if (res.ok) setStations(await res.json())
    } catch {}
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/incidents', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newIncident),
    })
    if (res.ok) {
      toast.success('تم إنشاء البلاغ بنجاح')
      setShowNewForm(false)
      setNewIncident({ type: 'OTHER', description: '', stationId: '', priority: 'MEDIUM' })
      fetchIncidents()
    } else {
      toast.error('فشل في إنشاء البلاغ')
    }
  }

  async function updateStatus(id: string, status: string) {
    const res = await fetch(`/api/incidents/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }),
    })
    if (res.ok) { toast.success('تم تحديث البلاغ'); fetchIncidents() }
    else toast.error('فشل في تحديث البلاغ')
  }

  const filtered = incidents.filter(i => {
    if (filterStatus !== 'ALL' && i.status !== filterStatus) return false
    if (search && !i.description.includes(search) && !i.station?.nameAr.includes(search)) return false
    return true
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="تقارير الحوادث"
        description="إدارة بلاغات الحوادث والأمن"
        actions={
          <Button size="sm" onClick={() => setShowNewForm(true)}>
            <Plus className="h-4 w-4 ml-2" /> بلاغ جديد
          </Button>
        }
      />

      {showNewForm && (
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select value={newIncident.type} onValueChange={v => setNewIncident(p => ({ ...p, type: v }))}>
                  <SelectTrigger><SelectValue placeholder="نوع البلاغ" /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(typeLabels).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={newIncident.priority} onValueChange={v => setNewIncident(p => ({ ...p, priority: v }))}>
                  <SelectTrigger><SelectValue placeholder="الأولوية" /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(priorityLabels).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={newIncident.stationId} onValueChange={v => setNewIncident(p => ({ ...p, stationId: v }))}>
                  <SelectTrigger><SelectValue placeholder="المحطة (اختياري)" /></SelectTrigger>
                  <SelectContent>
                    {stations.map(s => (
                      <SelectItem key={s.id} value={s.id}>{s.nameAr}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <textarea
                value={newIncident.description}
                onChange={e => setNewIncident(p => ({ ...p, description: e.target.value }))}
                className="w-full px-4 py-3 bg-[#0f0f1a] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#6366f1] min-h-[100px]"
                placeholder="وصف البلاغ"
                required
              />
              <div className="flex gap-3 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowNewForm(false)}>إلغاء</Button>
                <Button type="submit">إرسال البلاغ</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-3 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث..." className="pr-10" />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[160px]"><Filter className="h-4 w-4 ml-2" /><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">الكل</SelectItem>
            <SelectItem value="OPEN">مفتوح</SelectItem>
            <SelectItem value="INVESTIGATING">قيد التحقيق</SelectItem>
            <SelectItem value="RESOLVED">تم الحل</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-t-cyan" /></div>
      ) : filtered.length === 0 ? (
        <Card className="p-12 text-center">
          <AlertTriangle className="h-12 w-12 mx-auto text-gray-600 mb-3" />
          <p className="text-gray-400">لا توجد بلاغات</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((incident, i) => (
            <motion.div key={incident.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <Card className="hover:border-white/20 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[incident.status]}`}>
                          {statusLabels[incident.status]}
                        </span>
                        <span className={`text-xs font-medium ${priorityColors[incident.priority]}`}>
                          {priorityLabels[incident.priority]}
                        </span>
                        <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded">
                          {typeLabels[incident.type] || incident.type}
                        </span>
                      </div>
                      <p className="text-sm text-white mb-1">{incident.description}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        {incident.station && <span>{incident.station.nameAr}</span>}
                        {incident.reportedBy && <span>بواسطة: {incident.reportedBy.name}</span>}
                        <span>{new Date(incident.createdAt).toLocaleString('ar-SA')}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {incident.status === 'OPEN' && (
                        <Button size="sm" variant="outline" onClick={() => updateStatus(incident.id, 'INVESTIGATING')}>
                          <Clock className="h-3 w-3 ml-1" /> بدء التحقيق
                        </Button>
                      )}
                      {incident.status === 'INVESTIGATING' && (
                        <Button size="sm" variant="outline" onClick={() => updateStatus(incident.id, 'RESOLVED')}>
                          <CheckCircle className="h-3 w-3 ml-1" /> تم الحل
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
