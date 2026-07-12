'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, ChevronLeft } from 'lucide-react'

interface StationPopupProps {
  station: {
    id: string
    nameAr: string
    nameEn: string
    line?: string
    lineColor?: string
    isInterchange?: boolean
    order?: number
    lines?: string[]
    lineColors?: string[]
  } | null
  onClose: () => void
}

export default function StationPopup({ station, onClose }: StationPopupProps) {
  return (
    <AnimatePresence>
      {station && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="absolute bottom-24 max-sm:bottom-4 right-4 max-sm:right-2 z-30 w-72 max-sm:w-[calc(100%-1rem)] pointer-events-none"
        >
          <div className="pointer-events-auto glass-card rounded-2xl p-3">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-t-blue/20 flex items-center justify-center">
                  <MapPin className="h-3.5 w-3.5 text-t-blue" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{station.nameAr}</h3>
                  <p className="text-[10px] text-gray-500">{station.nameEn}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-6 h-6 rounded-lg bg-t-card/60 flex items-center justify-center text-gray-500 hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-2">
              {(station.lineColors || [station.lineColor]).map((color, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium text-white"
                  style={{ backgroundColor: `${color}20`, borderColor: `${color}40`, borderWidth: 1 }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                  {(station.lines || [station.line])?.[i] || station.line}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-1.5 mb-2">
              <div className="p-1.5 rounded-lg bg-t-card/40 border border-t-border/30">
                <p className="text-[8px] text-gray-500">الإحداثيات</p>
                <p className="text-[10px] text-white font-mono" dir="ltr">
                  {station.id?.length ? `${Number(station.id?.slice(-6)?.slice(0, 2) || '0') + 24}.${station.id?.slice(-4) || '0000'}` : '—'}
                </p>
              </div>
              <div className="p-1.5 rounded-lg bg-t-card/40 border border-t-border/30">
                <p className="text-[8px] text-gray-500">الترتيب</p>
                <p className="text-[10px] text-white">#{station.order || '—'}</p>
              </div>
            </div>

          <a
              href={`/stations`}
              className="flex items-center justify-center gap-1 w-full py-1.5 rounded-xl bg-t-cyan/10 text-t-cyan text-[10px] font-medium hover:bg-t-cyan/20 transition-colors"
            >
              <span>جميع المحطات</span>
              <ChevronLeft className="h-3 w-3" />
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
