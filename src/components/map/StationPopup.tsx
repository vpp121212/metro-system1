'use client'

import { useState, useEffect } from 'react'
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

const miniContent = (station: NonNullable<StationPopupProps['station']>) => (
  <>
    <div className="flex items-start justify-between mb-2">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-t-blue/20 flex items-center justify-center shrink-0">
          <MapPin className="h-3.5 w-3.5 text-t-blue" />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-white truncate">{station.nameAr}</h3>
          <p className="text-[10px] text-gray-500 truncate">{station.nameEn}</p>
        </div>
      </div>
      <button
        onClick={() => {}}
        className="w-6 h-6 rounded-lg bg-t-card/60 flex items-center justify-center text-gray-500 hover:text-white shrink-0 max-sm:hidden"
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
  </>
)

export default function StationPopup({ station, onClose }: StationPopupProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return (
    <>
    <AnimatePresence>
      {station && !isMobile && (
        <motion.div
          key="station-desktop"
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="absolute bottom-24 right-4 z-30 w-72 pointer-events-none"
        >
          <div className="pointer-events-auto glass-card rounded-2xl p-3" onClick={(e) => e.stopPropagation()}>
            {miniContent(station)}
          </div>
        </motion.div>
      )}
    </AnimatePresence>

    <AnimatePresence>
      {station && isMobile && (
        <motion.div
          key="station-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}
    </AnimatePresence>

    <AnimatePresence>
      {station && isMobile && (
        <motion.div
          key="station-mobile"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none"
        >
          <div className="pointer-events-auto bg-t-panel/95 backdrop-blur-xl rounded-t-3xl border-t border-t-border/40 shadow-2xl">
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-gray-600" />
            </div>
            <div className="px-5 pb-6">
              {station && miniContent(station)}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  )
}
