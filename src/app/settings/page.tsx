'use client'

import { useEffect, useState } from 'react'
import { Settings as SettingsIcon, Globe, Bell, Monitor, Shield, Save, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import PageHeader from '@/components/layout/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchSettings() }, [])

  async function fetchSettings() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/settings')
      if (!res.ok) throw new Error('Failed')
      setSettings(await res.json())
    } catch {
      setSettings({
        language: 'ar', theme: 'dark', auto_refresh_interval: '30',
        sound_alerts: 'true', push_notifications: 'true', email_reports: 'false',
        system_name: 'TrainEye AI', timezone: 'Asia/Riyadh', data_retention: '90',
        session_timeout: '30', two_factor: 'false', password_policy: 'medium',
      })
    } finally {
      setLoading(false)
    }
  }

  function updateSetting(key: string, value: string) {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      if (res.ok) {
        toast.success('تم حفظ الإعدادات بنجاح')
      } else {
        toast.error('فشل في حفظ الإعدادات')
      }
    } catch {
      toast.error('فشل في حفظ الإعدادات')
    } finally {
      setSaving(false)
    }
  }

  const sections = [
    {
      title: 'عام', icon: <Globe className="h-5 w-5 text-t-cyan" />,
      items: [
        { key: 'language', label: 'اللغة', type: 'select', options: [{ value: 'ar', label: 'العربية' }, { value: 'en', label: 'English' }] },
        { key: 'theme', label: 'المظهر', type: 'select', options: [{ value: 'dark', label: 'داكن' }, { value: 'light', label: 'فاتح' }] },
        { key: 'auto_refresh_interval', label: 'فترة التحديث التلقائي (ثانية)', type: 'input', inputType: 'number' },
      ],
    },
    {
      title: 'الإشعارات', icon: <Bell className="h-5 w-5 text-t-orange" />,
      items: [
        { key: 'sound_alerts', label: 'تنبيهات صوتية', type: 'toggle' },
        { key: 'push_notifications', label: 'إشعارات فورية', type: 'toggle' },
        { key: 'email_reports', label: 'تقارير بالبريد الإلكتروني', type: 'toggle' },
      ],
    },
    {
      title: 'النظام', icon: <Monitor className="h-5 w-5 text-t-blue" />,
      items: [
        { key: 'system_name', label: 'اسم النظام', type: 'input' },
        { key: 'timezone', label: 'المنطقة الزمنية', type: 'select', options: [{ value: 'Asia/Riyadh', label: 'الرياض (GMT+3)' }, { value: 'UTC', label: 'UTC' }] },
        { key: 'data_retention', label: 'فترة الاحتفاظ بالبيانات (يوم)', type: 'input', inputType: 'number' },
      ],
    },
    {
      title: 'الأمان', icon: <Shield className="h-5 w-5 text-t-red" />,
      items: [
        { key: 'session_timeout', label: 'مهلة الجلسة (دقيقة)', type: 'input', inputType: 'number' },
        { key: 'two_factor', label: 'المصادقة الثنائية', type: 'toggle' },
        { key: 'password_policy', label: 'سياسة كلمة المرور', type: 'select', options: [{ value: 'low', label: 'منخفضة' }, { value: 'medium', label: 'متوسطة' }, { value: 'high', label: 'عالية' }] },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="الإعدادات"
        description="تكوين إعدادات النظام"
        actions={
          <Button size="sm" onClick={handleSave} disabled={saving || loading}>
            {saving ? <Loader2 className="h-4 w-4 ml-2 animate-spin" /> : <Save className="h-4 w-4 ml-2" />}
            {saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
          </Button>
        }
      />

      {error ? (
        <Card className="p-8 text-center">
          <p className="text-t-red mb-3">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchSettings}>إعادة المحاولة</Button>
        </Card>
      ) : loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-6"><Skeleton className="h-48" /></Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {sections.map((section, si) => (
            <motion.div key={section.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: si * 0.1 }}>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    {section.icon}
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {section.items.map(item => (
                    <div key={item.key} className="flex items-center justify-between">
                      <label className="text-sm text-gray-300">{item.label}</label>
                      {item.type === 'toggle' ? (
                        <Switch
                          checked={settings[item.key] === 'true'}
                          onCheckedChange={(v) => updateSetting(item.key, String(v))}
                        />
                      ) : item.type === 'select' ? (
                        <Select value={settings[item.key] || ''} onValueChange={(v) => updateSetting(item.key, v)}>
                          <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {item.options?.map(opt => (
                              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          type={item.inputType || 'text'}
                          value={settings[item.key] || ''}
                          onChange={(e) => updateSetting(item.key, e.target.value)}
                          className="w-[180px]"
                        />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
