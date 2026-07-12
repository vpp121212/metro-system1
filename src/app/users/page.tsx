'use client'

import { useState } from 'react'
import { Users, Plus, Search, MoreHorizontal, Mail, Shield, Clock } from 'lucide-react'
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
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

interface User {
  id: string
  name: string
  email: string
  role: string
  isActive: boolean
  lastLogin: string | null
}

const mockUsers: User[] = [
  { id: '1', name: 'أحمدمحمد العلي', email: 'ahmed@metro.sa', role: 'ADMIN', isActive: true, lastLogin: new Date(Date.now() - 3600000).toISOString() },
  { id: '2', name: 'فاطمةحسين', email: 'fatima@metro.sa', role: 'OPERATOR', isActive: true, lastLogin: new Date(Date.now() - 7200000).toISOString() },
  { id: '3', name: 'خالد الشمري', email: 'khalid@metro.sa', role: 'VIEWER', isActive: true, lastLogin: new Date(Date.now() - 86400000).toISOString() },
  { id: '4', name: 'نورة السعيد', email: 'noura@metro.sa', role: 'OPERATOR', isActive: false, lastLogin: new Date(Date.now() - 604800000).toISOString() },
  { id: '5', name: 'عبدالله الحربي', email: 'abdullah@metro.sa', role: 'ADMIN', isActive: true, lastLogin: new Date(Date.now() - 1800000).toISOString() },
  { id: '6', name: 'ريم العنزي', email: 'reem@metro.sa', role: 'VIEWER', isActive: true, lastLogin: null },
  { id: '7', name: 'محمد العتيبي', email: 'mohammed@metro.sa', role: 'OPERATOR', isActive: true, lastLogin: new Date(Date.now() - 43200000).toISOString() },
  { id: '8', name: 'سارة الدوسري', email: 'sara@metro.sa', role: 'VIEWER', isActive: false, lastLogin: new Date(Date.now() - 259200000).toISOString() },
]

const roleLabel: Record<string, string> = { ADMIN: 'مدير', OPERATOR: 'مشغل', VIEWER: 'مشاهد' }
const roleBadgeColor: Record<string, string> = {
  ADMIN: 'bg-t-red/15 text-t-red border-t-red/25',
  OPERATOR: 'bg-t-blue/15 text-t-blue border-t-blue/25',
  VIEWER: 'bg-t-green/15 text-t-green border-t-green/25',
}

export default function UsersPage() {
  const [users] = useState<User[]>(mockUsers)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', role: 'VIEWER' })

  const filtered = users.filter(u => {
    if (search && !u.name.includes(search) && !u.email.includes(search)) return false
    if (roleFilter !== 'all' && u.role !== roleFilter) return false
    return true
  })

  const activeCount = users.filter(u => u.isActive).length
  const inactiveCount = users.filter(u => !u.isActive).length

  function timeAgo(dateStr: string | null): string {
    if (!dateStr) return 'لم يسجل دخول'
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `منذ ${mins} دقيقة`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `منذ ${hours} ساعة`
    return `منذ ${Math.floor(hours / 24)} يوم`
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="المستخدمين"
        description="إدارة حسابات المستخدمين"
        actions={
          <Button size="sm" onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 ml-2" /> إضافة مستخدم
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="إجمالي المستخدمين" value={users.length} icon={<Users className="h-5 w-5" />} color="cyan" />
        <StatCard title="نشط" value={activeCount} icon={<Users className="h-5 w-5" />} color="green" />
        <StatCard title="غير نشط" value={inactiveCount} icon={<Users className="h-5 w-5" />} color="red" />
      </div>

      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="بحث بالاسم أو البريد..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-9"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="الدور" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الأدوار</SelectItem>
              <SelectItem value="ADMIN">مدير</SelectItem>
              <SelectItem value="OPERATOR">مشغل</SelectItem>
              <SelectItem value="VIEWER">مشاهد</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الاسم</TableHead>
              <TableHead>البريد</TableHead>
              <TableHead>الدور</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>آخر دخول</TableHead>
              <TableHead>الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((user) => (
              <motion.tr key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-t-border hover:bg-t-panel/50">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-t-panel flex items-center justify-center text-sm font-medium text-white">
                      {user.name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium">{user.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-400">{user.email}</TableCell>
                <TableCell>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${roleBadgeColor[user.role]}`}>
                    {roleLabel[user.role]}
                  </span>
                </TableCell>
                <TableCell>
                  <StatusBadge status={user.isActive ? 'active' : 'inactive'} size="sm" />
                </TableCell>
                <TableCell className="text-xs text-gray-500">{timeAgo(user.lastLogin)}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>إضافة مستخدم جديد</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">الاسم</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="اسم المستخدم" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">البريد الإلكتروني</label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="user@metro.sa" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">الدور</label>
              <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">مدير</SelectItem>
                  <SelectItem value="OPERATOR">مشغل</SelectItem>
                  <SelectItem value="VIEWER">مشاهد</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>إلغاء</Button>
            <Button onClick={() => setDialogOpen(false)}>إضافة</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
