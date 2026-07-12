'use client'

import { useState } from 'react'
import { Key, Save } from 'lucide-react'
import { motion } from 'framer-motion'
import PageHeader from '@/components/layout/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'

interface Feature {
  category: string
  features: string[]
}

const roles = [
  { id: 'admin', name: 'مدير النظام', color: 'text-t-red' },
  { id: 'operator', name: 'مشغّل', color: 'text-t-blue' },
  { id: 'viewer', name: 'مشاهد', color: 'text-t-green' },
  { id: 'maintenance', name: 'فني صيانة', color: 'text-t-orange' },
]

const features: Feature[] = [
  {
    category: 'العرض',
    features: ['لوحة التحكم', 'الخريطة المباشرة', 'إعادة التشغيل'],
  },
  {
    category: 'التشغيل',
    features: ['إدارة القطارات', 'إدارة المحطات', 'إدارة الخطوط', 'إدارة الرحلات', 'سجل التشغيل'],
  },
  {
    category: 'التقارير والتحليلات',
    features: ['عرض التحليلات', 'إنشاء التقارير', 'إدارة التنبيهات'],
  },
  {
    category: 'الأسطول والصيانة',
    features: ['عرض الأسطول', 'إدارة الصيانة', 'جدولة الصيانة'],
  },
  {
    category: 'الإدارة',
    features: ['إدارة المستخدمين', 'إدارة الأدوار', 'إدارة الأذونات', 'سجل التدقيق'],
  },
  {
    category: 'النظام',
    features: ['الإعدادات', 'المساعد الذكي', 'الإشعارات'],
  },
]

const initialPermissions: Record<string, Record<string, boolean>> = {
  admin: Object.fromEntries(features.flatMap(f => f.features.map(feat => [feat, true]))),
  operator: Object.fromEntries(features.flatMap(f => f.features.map(feat => [feat, ['لوحة التحكم', 'الخريطة المباشرة', 'إدارة القطارات', 'إدارة المحطات', 'الخطوط', 'الرحلات', 'التنبيهات', 'الأسطول'].includes(feat)]))),
  viewer: Object.fromEntries(features.flatMap(f => f.features.map(feat => [feat, ['لوحة التحكم', 'الخريطة المباشرة', 'عرض التحليلات', 'إنشاء التقارير', 'عرض الأسطول'].includes(feat)]))),
  maintenance: Object.fromEntries(features.flatMap(f => f.features.map(feat => [feat, ['لوحة التحكم', 'الخريطة المباشرة', 'عرض الأسطول', 'إدارة الصيانة', 'التنبيهات'].includes(feat)]))),
}

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState(initialPermissions)

  function togglePermission(roleId: string, feature: string) {
    setPermissions(prev => ({
      ...prev,
      [roleId]: { ...prev[roleId], [feature]: !prev[roleId]?.[feature] },
    }))
  }

  const totalPerRole = roles.map(r => ({
    ...r,
    count: Object.values(permissions[r.id] || {}).filter(Boolean).length,
  }))

  return (
    <div className="space-y-6">
      <PageHeader
        title="الأذونات"
        description="إدارة أذونات الوصول للنظام"
        actions={
          <Button size="sm">
            <Save className="h-4 w-4 ml-2" /> حفظ التغييرات
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {totalPerRole.map(r => (
          <Card key={r.id} className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <Key className="h-4 w-4 text-t-cyan" />
              <span className={`text-sm font-medium ${r.color}`}>{r.name}</span>
            </div>
            <p className="text-lg font-bold text-white">{r.count} / {features.flatMap(f => f.features).length}</p>
          </Card>
        ))}
      </div>

      <Card className="overflow-x-auto">
        <div className="min-w-[600px]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-t-border">
                <th className="text-right p-3 text-sm font-medium text-gray-400 w-[200px]">الميزة</th>
                {roles.map(r => (
                  <th key={r.id} className={`p-3 text-center text-sm font-medium ${r.color}`}>{r.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map(group => (
                <>
                  <tr key={group.category}>
                    <td colSpan={roles.length + 1} className="px-3 pt-4 pb-2">
                      <Badge variant="secondary" className="text-[10px]">{group.category}</Badge>
                    </td>
                  </tr>
                  {group.features.map((feature, fi) => (
                    <motion.tr
                      key={feature}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: fi * 0.02 }}
                      className="border-b border-t-border/50 hover:bg-t-panel/30"
                    >
                      <td className="p-3 text-sm text-gray-300">{feature}</td>
                      {roles.map(r => (
                        <td key={r.id} className="p-3 text-center">
                          <Checkbox
                            checked={permissions[r.id]?.[feature] ?? false}
                            onCheckedChange={() => togglePermission(r.id, feature)}
                          />
                        </td>
                      ))}
                    </motion.tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
