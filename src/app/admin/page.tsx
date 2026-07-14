'use client'

import { useEffect, useState } from 'react'
import { Users, Shield, Save, Loader2, UserCheck, UserX } from 'lucide-react'
import { motion } from 'framer-motion'
import PageHeader from '@/components/layout/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Switch } from '@/components/ui/switch'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

interface Role {
  id: string; name: string; description: string | null
  permissions: { id: string; name: string }[]
  _count: { users: number }
}

interface User {
  id: string; employeeId: string; name: string; email: string
  role: { id: string; name: string; description: string | null }
  station: { id: string; nameAr: string; nameEn: string } | null
  isActive: boolean; createdAt: string
}

const PERMISSION_LABELS: Record<string, string> = {
  view_dashboard: 'عرض لوحة التحكم',
  manage_trains: 'إدارة القطارات',
  manage_stations: 'إدارة المحطات',
  manage_alerts: 'إدارة التنبيهات',
  manage_users: 'إدارة المستخدمين',
  view_analytics: 'عرض التحليلات',
  manage_maintenance: 'إدارة الصيانة',
  manage_settings: 'إدارة الإعدادات',
  view_cameras: 'عرض الكاميرات',
  manage_cameras: 'إدارة الكاميرات',
  view_audit_logs: 'عرض سجل التتبع',
  manage_notifications: 'إدارة الإشعارات',
  view_passenger_data: 'عرض بيانات الركاب',
  manage_fleet: 'إدارة الأسطول',
  system_admin: 'صلاحية شاملة (System Admin)',
}

const ROLE_BADGE_COLORS: Record<string, string> = {
  ADMIN: 'bg-red-500/10 text-red-400 border-red-500/30',
  SUPERVISOR: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  VIEWER: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [allPermissions, setAllPermissions] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [savingRole, setSavingRole] = useState<string | null>(null)
  const [editingRolePerms, setEditingRolePerms] = useState<Record<string, string[]>>({})

  useEffect(() => { fetchData() }, [])

  async function fetchData() {
    setLoading(true)
    try {
      const [usersRes, rolesRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/roles'),
      ])
      if (usersRes.ok) setUsers(await usersRes.json())
      if (rolesRes.ok) {
        const data = await rolesRes.json()
        setRoles(data.roles)
        setAllPermissions(data.allPermissions)
        const permMap: Record<string, string[]> = {}
        for (const r of data.roles) {
          permMap[r.id] = r.permissions.map((p: { name: string }) => p.name)
        }
        setEditingRolePerms(permMap)
      }
    } catch {
      toast.error('فشل في تحميل البيانات')
    } finally {
      setLoading(false)
    }
  }

  async function updateUserRole(userId: string, roleId: string) {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleId }),
      })
      if (res.ok) {
        toast.success('تم تحديث دور المستخدم')
        fetchData()
      } else {
        const err = await res.json()
        toast.error(err.error || 'فشل التحديث')
      }
    } catch {
      toast.error('فشل الاتصال بالخادم')
    }
  }

  async function toggleUserActive(userId: string, current: boolean) {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !current }),
      })
      if (res.ok) {
        toast.success(current ? 'تم تعطيل المستخدم' : 'تم تفعيل المستخدم')
        fetchData()
      } else {
        toast.error('فشل التحديث')
      }
    } catch {
      toast.error('فشل الاتصال بالخادم')
    }
  }

  function togglePermission(roleId: string, perm: string) {
    setEditingRolePerms(prev => {
      const current = prev[roleId] || []
      const updated = current.includes(perm)
        ? current.filter(p => p !== perm)
        : [...current, perm]
      return { ...prev, [roleId]: updated }
    })
  }

  async function saveRolePermissions(roleId: string) {
    setSavingRole(roleId)
    try {
      const res = await fetch(`/api/roles/${roleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ permissions: editingRolePerms[roleId] || [] }),
      })
      if (res.ok) {
        toast.success('تم حفظ صلاحيات الدور')
        fetchData()
      } else {
        const err = await res.json()
        toast.error(err.error || 'فشل الحفظ')
      }
    } catch {
      toast.error('فشل الاتصال بالخادم')
    } finally {
      setSavingRole(null)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="الإدارة" description="إدارة المستخدمين والأدوار والصلاحيات" />

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-64" />
        </div>
      ) : (
        <Tabs defaultValue="users">
          <TabsList>
            <TabsTrigger value="users"><Users className="h-4 w-4 ml-2" />المستخدمين</TabsTrigger>
            <TabsTrigger value="roles"><Shield className="h-4 w-4 ml-2" />الأدوار والصلاحيات</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-4">
            <Card>
              <CardHeader><CardTitle className="text-sm">قائمة المستخدمين</CardTitle></CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الموظف</TableHead>
                      <TableHead>الاسم</TableHead>
                      <TableHead>البريد</TableHead>
                      <TableHead>الدور</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>المحطة</TableHead>
                      <TableHead className="text-left">إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user, i) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-mono text-xs">{user.employeeId}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell className="text-xs text-gray-400">{user.email}</TableCell>
                        <TableCell>
                          <Select
                            value={user.role.id}
                            onValueChange={(v) => updateUserRole(user.id, v)}
                          >
                            <SelectTrigger className="w-36 h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {roles.map(r => (
                                <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.isActive ? 'default' : 'secondary'} className="text-xs">
                            {user.isActive ? 'نشط' : 'موقف'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-gray-400">
                          {user.station?.nameAr || '—'}
                        </TableCell>
                        <TableCell className="text-left">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleUserActive(user.id, user.isActive)}
                          >
                            {user.isActive ? <UserX className="h-4 w-4 text-red-400" /> : <UserCheck className="h-4 w-4 text-green-400" />}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roles" className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {roles.map((role, ri) => (
                <motion.div key={role.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: ri * 0.1 }}>
                  <Card>
                    <CardHeader className="pb-3 flex flex-row items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={ROLE_BADGE_COLORS[role.name] || 'bg-gray-500/10 text-gray-400'}>
                          {role.name}
                        </Badge>
                        <span className="text-xs text-gray-500">{role._count.users} مستخدم</span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => saveRolePermissions(role.id)}
                        disabled={savingRole === role.id}
                      >
                        {savingRole === role.id ? <Loader2 className="h-3 w-3 animate-spin ml-1" /> : <Save className="h-3 w-3 ml-1" />}
                        حفظ
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-gray-400 mb-3">{role.description}</p>
                      <div className="space-y-2">
                        {allPermissions.map(perm => (
                          <div key={perm} className="flex items-center justify-between py-1">
                            <label className="text-xs text-gray-300">{PERMISSION_LABELS[perm] || perm}</label>
                            <Switch
                              checked={(editingRolePerms[role.id] || []).includes(perm)}
                              onCheckedChange={() => togglePermission(role.id, perm)}
                              disabled={role.name === 'ADMIN' && perm === 'system_admin'}
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
