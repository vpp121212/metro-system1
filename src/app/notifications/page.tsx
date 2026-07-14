'use client'

import { useEffect, useState } from 'react'
import { Bell, CheckCheck, Info, AlertTriangle, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import PageHeader from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'

interface Notification {
  id: string
  title: string
  message: string
  type: string
  isRead: boolean
  createdAt: string
  userId: string | null
}

const typeConfig: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  INFO: { icon: <Info className="h-4 w-4 text-t-blue" />, color: 'text-t-blue', bg: 'bg-t-blue/10 border-t-blue/20' },
  WARNING: { icon: <AlertTriangle className="h-4 w-4 text-t-orange" />, color: 'text-t-orange', bg: 'bg-t-orange/10 border-t-orange/20' },
  CRITICAL: { icon: <AlertCircle className="h-4 w-4 text-t-red" />, color: 'text-t-red', bg: 'bg-t-red/10 border-t-red/20' },
  SUCCESS: { icon: <CheckCircle className="h-4 w-4 text-t-green" />, color: 'text-t-green', bg: 'bg-t-green/10 border-t-green/20' },
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'الآن'
  if (mins < 60) return `منذ ${mins} دقيقة`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `منذ ${hours} ساعة`
  return `منذ ${Math.floor(hours / 24)} يوم`
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => { fetchNotifications() }, [])

  async function fetchNotifications() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/notifications')
      if (!res.ok) throw new Error('Failed')
      setNotifications(await res.json())
    } catch {
      setError('فشل في تحميل الإشعارات')
    } finally {
      setLoading(false)
    }
  }

  async function markAsRead(id: string) {
    try {
      const res = await fetch(`/api/notifications/${id}`, { method: 'PATCH' })
      if (res.ok) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
      }
    } catch { /* silent */ }
  }

  async function markAllRead() {
    const unread = notifications.filter(n => !n.isRead)
    await Promise.all(unread.map(n => markAsRead(n.id)))
  }

  const filtered = notifications.filter(n => {
    if (activeTab === 'unread') return !n.isRead
    if (activeTab === 'read') return n.isRead
    return true
  })

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <div className="space-y-6">
      <PageHeader
        title="الإشعارات"
        description="مركز إدارة الإشعارات"
        actions={
          <Button variant="outline" size="sm" onClick={markAllRead} disabled={unreadCount === 0}>
            <CheckCheck className="h-4 w-4 ml-2" />
            قراءة الكل
          </Button>
        }
      />

      {error ? (
        <Card className="p-8 text-center">
          <p className="text-t-red mb-3">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchNotifications}>إعادة المحاولة</Button>
        </Card>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">الكل ({notifications.length})</TabsTrigger>
            <TabsTrigger value="unread">غير مقروء ({unreadCount})</TabsTrigger>
            <TabsTrigger value="read">مقروء ({notifications.length - unreadCount})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="p-4"><Skeleton className="h-16 w-full" /></Card>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <Card className="p-8 text-center text-gray-500">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-30" />
                لا توجد إشعارات
              </Card>
            ) : (
              <div className="space-y-2">
                <AnimatePresence>
                  {filtered.map((notif, idx) => {
                    const config = typeConfig[notif.type] || typeConfig.INFO
                    return (
                      <motion.div
                        key={notif.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.03 }}
                      >
                        <Card
                          className={`p-4 hover:border-t-border/60 transition-all cursor-pointer ${!notif.isRead ? `border ${config.bg}` : ''}`}
                          onClick={() => !notif.isRead && markAsRead(notif.id)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="shrink-0 mt-1">
                              {config.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className={`text-sm font-medium ${!notif.isRead ? 'text-white' : 'text-gray-300'}`}>
                                  {notif.title}
                                </h4>
                                {!notif.isRead && (
                                  <span className="w-2 h-2 rounded-full bg-t-cyan shrink-0" />
                                )}
                              </div>
                              <p className="text-xs text-gray-400 mb-2">{notif.message}</p>
                              <div className="flex items-center gap-1 text-[10px] text-gray-500">
                                <Clock className="h-3 w-3" />
                                {timeAgo(notif.createdAt)}
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
