'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Train, MapPin, AlertTriangle, BarChart3, Menu, X, Clock,
} from 'lucide-react'
import { LINES, LINE_COLORS } from '@/lib/metro-data'

interface SidePanelProps {
  activeFilter: string | null
  onFilterChange: (id: string | null) => void
  stats: { trains: number; stations: number; alerts: number }
}

export default function SidePanel({ activeFilter, onFilterChange, stats }: SidePanelProps) {
  const [collapsed, setCollapsed] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const day = now.getDay()
  const isFriday = day === 5
  const minutes = now.getHours() * 60 + now.getMinutes()

  const openStart = isFriday ? 600 : 360
  const openEnd = 1440
  const isOpen = minutes >= openStart && minutes < openEnd

  const timeStr = now.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
  const dayNames = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']

  const content = (
    <div className="space-y-3">
      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-1.5">
        <div className="flex flex-col items-center p-2 rounded-xl bg-t-card/40 border border-t-border/30">
          <Train className="h-3.5 w-3.5 text-t-cyan mb-0.5" />
          <span className="text-white text-xs font-bold">{stats.trains}</span>
          <span className="text-[8px] text-gray-500">قطار</span>
        </div>
        <div className="flex flex-col items-center p-2 rounded-xl bg-t-card/40 border border-t-border/30">
          <MapPin className="h-3.5 w-3.5 text-t-purple mb-0.5" />
          <span className="text-white text-xs font-bold">{stats.stations}</span>
          <span className="text-[8px] text-gray-500">محطة</span>
        </div>
        <div className="flex flex-col items-center p-2 rounded-xl bg-t-card/40 border border-t-border/30">
          <AlertTriangle className="h-3.5 w-3.5 text-t-orange mb-0.5" />
          <span className="text-white text-xs font-bold">{stats.alerts}</span>
          <span className="text-[8px] text-gray-500">تنبيه</span>
        </div>
      </div>

      {/* Operating Hours */}
      <div className={`flex items-center gap-2 px-2.5 py-2 rounded-xl border ${isOpen ? 'bg-t-green/10 border-t-green/30' : 'bg-t-red/10 border-t-red/30'}`}>
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isOpen ? 'bg-t-green/15' : 'bg-t-red/15'}`}>
          <Clock className={`h-3.5 w-3.5 ${isOpen ? 'text-t-green' : 'text-t-red'}`} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-white">ساعات التشغيل</span>
            <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-medium ${
              isOpen ? 'bg-t-green/20 text-t-green' : 'bg-t-red/20 text-t-red'
            }`}>
              {isOpen ? 'مباشر' : 'مغلق'}
            </span>
          </div>
          <p className="text-[9px] text-gray-400 mt-0.5" dir="ltr">{timeStr}</p>
          <p className="text-[8px] text-gray-500">{dayNames[day]} | {isFriday ? '١٠:٠٠ ص - ١٢:٠٠ ص' : '٦:٠٠ ص - ١٢:٠٠ ص'}</p>
        </div>
      </div>

      {/* Line Filters */}
      <div className="space-y-1">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] text-gray-500 font-medium">تصفية الخطوط</span>
          <BarChart3 className="h-3 w-3 text-gray-600" />
        </div>
        <button
          onClick={() => onFilterChange(activeFilter === null ? null : null)}
          className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs transition-all ${
            activeFilter === null
              ? 'bg-white/10 text-white border border-white/20'
              : 'text-gray-400 hover:text-white hover:bg-t-card/40 border border-transparent'
          }`}
        >
          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-t-cyan to-t-blue" />
          <span>جميع الخطوط</span>
        </button>
        {LINES.map((line) => {
          const isActive = activeFilter === line.id
          return (
            <button
              key={line.id}
              onClick={() => onFilterChange(isActive ? null : line.id)}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs transition-all ${
                isActive
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'text-gray-400 hover:text-white hover:bg-t-card/40 border border-transparent'
              }`}
            >
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: LINE_COLORS[line.color].hex }} />
              <span>{line.nameAr}</span>
              <span className="mr-auto text-[9px] text-gray-600">{line.stations.length}</span>
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="pt-1 border-t border-t-border/30">
        <div className="flex items-center gap-2 text-[9px] text-gray-500 px-1">
          <span className="w-2 h-2 rounded-full bg-t-green" />
          <span>نشط</span>
          <span className="w-2 h-2 rounded-full bg-t-orange mr-2" />
          <span>صيانة</span>
          <span className="w-2 h-2 rounded-full bg-t-red mr-2" />
          <span>عطل</span>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-20 max-sm:top-4 right-4 z-30 w-10 h-10 max-sm:w-11 max-sm:h-11 rounded-xl glass flex items-center justify-center text-gray-400 hover:text-white active:scale-95 transition-all pointer-events-auto"
      >
        {collapsed ? <Menu className="h-4 w-4 max-sm:h-5 max-sm:w-5" /> : <X className="h-4 w-4 max-sm:h-5 max-sm:w-5" />}
      </button>

      <AnimatePresence>
        {!collapsed && isMobile && (
          <motion.div
            key="mobile-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => setCollapsed(true)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!collapsed && !isMobile && (
          <motion.div
            key="desktop-panel"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-36 right-4 z-20 w-56 pointer-events-none"
          >
            <div className="pointer-events-auto glass-card rounded-2xl p-3 max-h-[calc(100vh-200px)] overflow-y-auto">
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!collapsed && isMobile && (
          <motion.div
            key="mobile-panel"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none"
          >
            <div className="pointer-events-auto bg-t-panel/95 backdrop-blur-xl rounded-t-3xl border-t border-t-border/40 shadow-2xl max-h-[75vh] flex flex-col">
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1 shrink-0">
                <div className="w-10 h-1 rounded-full bg-gray-600" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 pb-3 shrink-0">
                <h2 className="text-sm font-bold text-white">مركز التحكم</h2>
                <button
                  onClick={() => setCollapsed(true)}
                  className="w-8 h-8 rounded-xl bg-t-card/60 flex items-center justify-center text-gray-400 hover:text-white active:scale-90 transition-all"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto px-5 pb-6">
                {content}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
