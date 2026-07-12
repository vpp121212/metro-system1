'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Train, Gauge, Users, ArrowUp, ArrowDown,
  Circle, ChevronLeft,
} from 'lucide-react'

interface TrainPopupProps {
  train: {
    id: string
    name: string
    line: string
    lineColor: string
    speed: number
    direction: string
    passengerCount: number
    capacity: number
    status: string
  } | null
  onClose: () => void
}

const miniContent = (train: NonNullable<TrainPopupProps['train']>) => (
  <>
    <div className="flex items-start justify-between mb-2">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${train.lineColor}20` }}>
          <Train className="h-3.5 w-3.5" style={{ color: train.lineColor }} />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-white truncate">{train.name}</h3>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] text-gray-500 truncate">{train.line}</span>
            <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[8px] font-medium ${
              train.status === 'ACTIVE' ? 'bg-t-green/15 text-t-green border border-t-green/20'
              : train.status === 'MAINTENANCE' ? 'bg-t-orange/15 text-t-orange border border-t-orange/20'
              : 'bg-t-red/15 text-t-red border border-t-red/20'
            }`}>
              <span className={`w-1 h-1 rounded-full ${
                train.status === 'ACTIVE' ? 'bg-t-green'
                : train.status === 'MAINTENANCE' ? 'bg-t-orange'
                : 'bg-t-red'
              }`} />
              {train.status === 'ACTIVE' ? 'نشط' : train.status === 'MAINTENANCE' ? 'صيانة' : 'عطل'}
            </span>
          </div>
        </div>
      </div>
      <button
        onClick={() => {}}
        className="w-6 h-6 rounded-lg bg-t-card/60 flex items-center justify-center text-gray-500 hover:text-white shrink-0 max-sm:hidden"
      >
        <X className="h-3 w-3" />
      </button>
    </div>

    <div className="grid grid-cols-3 gap-1.5 mb-2">
      <div className="p-1.5 rounded-lg bg-t-card/40 border border-t-border/30 text-center">
        <Gauge className="h-3 w-3 mx-auto mb-0.5" style={{ color: train.lineColor }} />
        <p className="text-[11px] font-bold text-white">{train.speed}</p>
        <p className="text-[8px] text-gray-500">كم/س</p>
      </div>
      <div className="p-1.5 rounded-lg bg-t-card/40 border border-t-border/30 text-center">
        <Users className="h-3 w-3 mx-auto mb-0.5 text-t-cyan" />
        <p className="text-[11px] font-bold text-white">{Math.round((train.passengerCount / train.capacity) * 100)}%</p>
        <p className="text-[8px] text-gray-500">إشغال</p>
      </div>
      <div className="p-1.5 rounded-lg bg-t-card/40 border border-t-border/30 text-center">
        {train.direction === 'forward'
          ? <ArrowUp className="h-3 w-3 mx-auto mb-0.5 text-t-green" />
          : <ArrowDown className="h-3 w-3 mx-auto mb-0.5 text-t-orange" />
        }
        <p className="text-[11px] font-bold text-white">{train.direction === 'forward' ? 'مقدم' : 'رجعي'}</p>
        <p className="text-[8px] text-gray-500">اتجاه</p>
      </div>
    </div>

    <a
      href={`/trains`}
      className="flex items-center justify-center gap-1 w-full py-1.5 rounded-xl bg-t-cyan/10 text-t-cyan text-[10px] font-medium hover:bg-t-cyan/20 transition-colors"
    >
      <span>جميع القطارات</span>
      <ChevronLeft className="h-3 w-3" />
    </a>
  </>
)

export default function TrainPopup({ train, onClose }: TrainPopupProps) {
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
      {train && !isMobile && (
        <motion.div
          key="train-desktop"
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="absolute bottom-24 left-4 z-30 w-72 pointer-events-none"
        >
          <div className="pointer-events-auto glass-card rounded-2xl p-3" onClick={(e) => e.stopPropagation()}>
            {train && miniContent(train)}
          </div>
        </motion.div>
      )}
    </AnimatePresence>

    <AnimatePresence>
      {train && isMobile && (
        <motion.div
          key="train-backdrop"
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
      {train && isMobile && (
        <motion.div
          key="train-mobile"
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
              {train && miniContent(train)}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  )
}
