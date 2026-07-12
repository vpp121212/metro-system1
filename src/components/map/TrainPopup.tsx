'use client'

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

export default function TrainPopup({ train, onClose }: TrainPopupProps) {
  return (
    <AnimatePresence>
      {train && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="absolute bottom-24 max-sm:bottom-4 left-4 max-sm:left-2 z-30 w-72 max-sm:w-[calc(100%-1rem)] pointer-events-none"
        >
          <div className="pointer-events-auto glass-card rounded-2xl p-3">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${train.lineColor}20` }}>
                  <Train className="h-3.5 w-3.5" style={{ color: train.lineColor }} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{train.name}</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] text-gray-500">{train.line}</span>
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
                onClick={onClose}
                className="w-6 h-6 rounded-lg bg-t-card/60 flex items-center justify-center text-gray-500 hover:text-white"
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
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
