'use client'

import { motion, AnimatePresence } from 'framer-motion'
import {
  Train, ChevronUp, ChevronDown, Users, Gauge,
  ArrowUp, ArrowDown,
} from 'lucide-react'

interface TrainItem {
  id: string
  name: string
  line: string
  lineColor: string
  speed: number
  direction: string
  passengerCount: number
  capacity: number
  status: string
}

interface BottomPanelProps {
  trains: TrainItem[]
  open: boolean
  onToggle: () => void
  onTrainSelect?: (id: string) => void
}

export default function BottomPanel({ trains, open, onToggle, onTrainSelect }: BottomPanelProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
      <div className="pointer-events-auto mx-4 mb-3">
        <button
          onClick={onToggle}
          className="mx-auto flex items-center gap-1.5 px-4 py-1.5 rounded-t-xl glass text-xs text-gray-400 hover:text-white transition-colors"
        >
          {open ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
          {open ? 'إخفاء القائمة' : `${trains.length} قطار نشط`}
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="glass rounded-2xl p-3 max-h-48 overflow-y-auto">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-1.5">
                  {trains.map((train) => (
                    <button
                      key={train.id}
                      onClick={() => onTrainSelect?.(train.id)}
                      className="flex items-center gap-2 p-2 rounded-xl bg-t-card/40 border border-t-border/30 hover:border-t-border/60 transition-all text-right"
                    >
                      <div className="relative shrink-0">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${train.lineColor}20` }}
                        >
                          <Train className="h-3.5 w-3.5" style={{ color: train.lineColor }} />
                        </div>
                        <div
                          className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-t-bg-dark ${
                            train.status === 'ACTIVE' ? 'bg-t-green' : train.status === 'MAINTENANCE' ? 'bg-t-orange' : 'bg-t-red'
                          }`}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-white truncate">{train.name}</span>
                          <span className="text-[9px] text-gray-500 shrink-0">{train.line}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[9px] text-gray-500">
                          <span className="flex items-center gap-0.5">
                            <Gauge className="h-2.5 w-2.5" />
                            {train.speed}
                          </span>
                          <span className="flex items-center gap-0.5">
                            <Users className="h-2.5 w-2.5" />
                            {Math.round((train.passengerCount / train.capacity) * 100)}%
                          </span>
                          <span className="flex items-center gap-0.5">
                            {train.direction === 'forward'
                              ? <ArrowUp className="h-2.5 w-2.5 text-t-cyan" />
                              : <ArrowDown className="h-2.5 w-2.5 text-t-orange" />
                            }
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
