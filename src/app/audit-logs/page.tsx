'use client'

import { useEffect, useState } from 'react'
import { ScrollText, RefreshCw, ChevronLeft, ChevronRight, Clock, Filter } from 'lucide-react'
import { motion } from 'framer-motion'
import PageHeader from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'

interface AuditLog {
  id: string
  action: string
  details: string
  ipAddress: string | null
  userId: string | null
  createdAt: string
}

interface AuditResponse {
  logs: AuditLog[]
  total: number
  page: number
  limit: number
  totalPages: number
}

const actionLabels: Record<string, string> = {
  CREATE: 'إنشاء',
  UPDATE: 'تحديث',
  DELETE: 'حذف',
  LOGIN: 'تسجيل دخول',
  LOGOUT: 'تسجيل خروج',
  ACKNOWLEDGE: 'تأكيد',
  GENERATE: 'إنشاء تقرير',
}

const actionColors: Record<string, string> = {
  CREATE: 'bg-t-green/15 text-t-green border-t-green/25',
  UPDATE: 'bg-t-blue/15 text-t-blue border-t-blue/25',
  DELETE: 'bg-t-red/15 text-t-red border-t-red/25',
  LOGIN: 'bg-t-cyan/15 text-t-cyan border-t-cyan/25',
  LOGOUT: 'bg-gray-500/15 text-gray-400 border-gray-500/25',
  ACKNOWLEDGE: 'bg-t-orange/15 text-t-orange border-t-orange/25',
  GENERATE: 'bg-t-purple/15 text-t-purple border-t-purple/25',
}

export default function AuditLogsPage() {
  const [data, setData] = useState<AuditResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [userFilter, setUserFilter] = useState('')
  const [actionFilter, setActionFilter] = useState('all')

  useEffect(() => { fetchLogs() }, [page])

  useEffect(() => {
    if (!autoRefresh) return
    const interval = setInterval(fetchLogs, 10000)
    return () => clearInterval(interval)
  }, [autoRefresh, page])

  async function fetchLogs() {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ page: String(page), limit: '50' })
      const res = await fetch(`/api/audit-logs?${params}`)
      if (!res.ok) throw new Error('Failed')
      setData(await res.json())
    } catch {
      setError('فشل في تحميل سجل التدقيق')
    } finally {
      setLoading(false)
    }
  }

  const filtered = data?.logs.filter(log => {
    if (userFilter && log.userId && !log.userId.includes(userFilter)) return false
    if (actionFilter !== 'all' && log.action !== actionFilter) return false
    return true
  }) ?? []

  return (
    <div className="space-y-6">
      <PageHeader
        title="سجل التدقيق"
        description="سجل جميع العمليات والتغييرات في النظام"
        actions={
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">تحديث تلقائي</span>
              <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
            </div>
            <Button variant="outline" size="sm" onClick={fetchLogs}>
              <RefreshCw className={`h-4 w-4 ml-2 ${loading ? 'animate-spin' : ''}`} />
              تحديث
            </Button>
          </div>
        }
      />

      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="بحث بالمعرف..."
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="flex-1"
          />
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="نوع العملية" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع العمليات</SelectItem>
              <SelectItem value="CREATE">إنشاء</SelectItem>
              <SelectItem value="UPDATE">تحديث</SelectItem>
              <SelectItem value="DELETE">حذف</SelectItem>
              <SelectItem value="LOGIN">تسجيل دخول</SelectItem>
              <SelectItem value="ACKNOWLEDGE">تأكيد</SelectItem>
              <SelectItem value="GENERATE">إنشاء تقرير</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="overflow-hidden">
        {error ? (
          <div className="p-8 text-center">
            <p className="text-t-red mb-3">{error}</p>
            <Button variant="outline" size="sm" onClick={fetchLogs}>إعادة المحاولة</Button>
          </div>
        ) : loading && !data ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-5 w-20" />
              </div>
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>التاريخ والوقت</TableHead>
                <TableHead>المستخدم</TableHead>
                <TableHead>العملية</TableHead>
                <TableHead>التفاصيل</TableHead>
                <TableHead>عنوان IP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((log) => (
                <motion.tr key={log.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-t-border hover:bg-t-panel/50">
                  <TableCell className="text-xs text-gray-400 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString('ar-SA')}
                  </TableCell>
                  <TableCell className="text-sm text-gray-300">{log.userId ?? 'النظام'}</TableCell>
                  <TableCell>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${actionColors[log.action] || 'bg-gray-500/15 text-gray-400 border-gray-500/25'}`}>
                      {actionLabels[log.action] || log.action}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-gray-400 max-w-[300px] truncate">{log.details}</TableCell>
                  <TableCell className="text-xs text-gray-500 font-mono">{log.ipAddress ?? '-'}</TableCell>
                </motion.tr>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500 py-8">لا توجد سجلات</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Card>

      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400">صفحة {data.page} من {data.totalPages} ({data.total} سجل)</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
              <ChevronRight className="h-4 w-4" /> السابق
            </Button>
            <Button variant="outline" size="sm" disabled={page >= data.totalPages} onClick={() => setPage(p => p + 1)}>
              التالي <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
