'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Train, MapPin, AlertTriangle, BarChart3, Menu, X,
} from 'lucide-react'
import { LINES, LINE_COLORS } from '@/lib/metro-data'

interface SidePanelProps {
  activeFilter: string | null
  onFilterChange: (id: string | null) => void
  stats: { trains: number; stations: number; alerts: number }
}

export default function SidePanel({ activeFilter, onFilterChange, stats }: SidePanelProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <>
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-20 right-4 z-30 w-9 h-9 rounded-xl glass flex items-center justify-center text-gray-400 hover:text-white transition-colors pointer-events-auto"
      >
        {collapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
      </button>

      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-36 right-4 z-20 w-56 pointer-events-none"
          >
            <div className="pointer-events-auto glass-card rounded-2xl p-3 space-y-3">
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
