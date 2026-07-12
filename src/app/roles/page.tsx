'use client'

import { useState } from 'react'
import { Shield, Plus, Users, Key, ChevronLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import PageHeader from '@/components/layout/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'

interface Role {
  id: string
  name: string
  nameAr: string
  description: string
  userCount: number
  permissionCount: number
  color: string
  permissions: string[]
}

const allPermissions = [
  'عرض لوحة التحكم', 'عرض الخريطة', 'إدارة القطارات', 'إدارة المحطات',
  'إدارة الرحلات', 'عرض التقارير', 'إنشاء التقارير', 'إدارة التنبيهات',
  'إدارة الصيانة', 'عرض الأسطول', 'إدارة المستخدمين', 'إدارة الصلاحيات',
  'عرض سجل التدقيق', 'الإعدادات', 'المساعد الذكي',
]

const initialRoles: Role[] = [
  { id: '1', name: 'ADMIN', nameAr: 'مدير النظام', description: 'صلاحيات كاملة على النظام', userCount: 2, permissionCount: 15, color: 'bg-t-red', permissions: allPermissions },
  { id: '2', name: 'OPERATOR', nameAr: 'مشغّل', description: 'إدارة العمليات اليومية والرحلات', userCount: 3, permissionCount: 10, color: 'bg-t-blue', permissions: allPermissions.slice(0, 10) },
  { id: '3', name: 'VIEWER', nameAr: 'مشاهد', description: 'عرض البيانات والتقارير فقط', userCount: 2, permissionCount: 5, color: 'bg-t-green', permissions: allPermissions.slice(0, 5) },
  { id: '4', name: 'MAINTENANCE', nameAr: 'فني صيانة', description: 'إدارة سجلات الصيانة والقاطارت', userCount: 1, permissionCount: 6, color: 'bg-t-orange', permissions: ['عرض لوحة التحكم', 'إدارة الصيانة', 'عرض الأسطول', 'عرض التنبيهات', 'عرض التقارير', 'عرض الخريطة'] },
]

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>(initialRoles)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState({ nameAr: '', name: '', description: '' })

  return (
    <div className="space-y-6">
      <PageHeader
        title="الصلاحيات"
        description="إدارة أدوار المستخدمين وصلاحياتهم"
        actions={
          <Button size="sm" onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 ml-2" /> إنشاء دور
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map((role, idx) => (
          <motion.div
            key={role.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card
              className={`hover:border-t-border/60 transition-all cursor-pointer ${selectedRole?.id === role.id ? 'border-t-cyan/40' : ''}`}
              onClick={() => setSelectedRole(selectedRole?.id === role.id ? null : role)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${role.color}/10 border ${role.color}/20 flex items-center justify-center`}>
                      <Shield className={`h-5 w-5 ${role.color.replace('bg-', 'text-')}`} />
                    </div>
                    <div>
                      <CardTitle className="text-sm">{role.nameAr}</CardTitle>
                      <p className="text-[10px] text-gray-500">{role.name}</p>
                    </div>
                  </div>
                  <ChevronLeft className={`h-4 w-4 text-gray-400 transition-transform ${selectedRole?.id === role.id ? '-rotate-90' : ''}`} />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-400 mb-3">{role.description}</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Users className="h-3.5 w-3.5" /> {role.userCount} مستخدم
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Key className="h-3.5 w-3.5" /> {role.permissionCount} إذن
                  </div>
                </div>

                <AnimatePresence>
                  {selectedRole?.id === role.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 pt-3 border-t border-t-border/30 space-y-2">
                        <p className="text-[10px] text-gray-500 font-medium">الصلاحيات:</p>
                        <div className="flex flex-wrap gap-1">
                          {role.permissions.map(p => (
                            <Badge key={p} variant="secondary" className="text-[10px]">{p}</Badge>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>إنشاء دور جديد</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">اسم الدور (عربي)</label>
              <Input value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} placeholder="اسم الدور بالعربي" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">اسم الدور (إنجليزي)</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Role Name" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">الوصف</label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="وصف الصلاحيات" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>إلغاء</Button>
            <Button onClick={() => {
              if (form.nameAr && form.name) {
                setRoles(prev => [...prev, {
                  id: Date.now().toString(),
                  ...form,
                  userCount: 0,
                  permissionCount: 0,
                  color: 'bg-t-purple',
                  permissions: [],
                }])
                setDialogOpen(false)
                setForm({ nameAr: '', name: '', description: '' })
              }
            }}>إنشاء</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
