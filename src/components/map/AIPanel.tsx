'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain, Sparkles, X, Zap, BarChart3, Clock,
  TrendingUp, Activity, ChevronLeft,
} from 'lucide-react'

interface Insight {
  title: string
  desc: string
  type: string
}

interface AIPanelProps {
  open: boolean
  onToggle: () => void
}

const iconMap: Record<string, { icon: typeof Brain; color: string; bg: string }> = {
  fleet: { icon: TrendingUp, color: 'text-t-orange', bg: 'bg-t-orange/10' },
  alerts: { icon: Zap, color: 'text-t-yellow', bg: 'bg-t-yellow/10' },
  passengers: { icon: Activity, color: 'text-t-cyan', bg: 'bg-t-cyan/10' },
  delay: { icon: Clock, color: 'text-t-purple', bg: 'bg-t-purple/10' },
  lines: { icon: BarChart3, color: 'text-t-blue', bg: 'bg-t-blue/10' },
}

export default function AIPanel({ open, onToggle }: AIPanelProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [insights, setInsights] = useState<Insight[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    if (!open) return
    setLoading(true)
    fetch('/api/ai/insights')
      .then((r) => r.json())
      .then((data) => setInsights(data.insights ?? []))
      .catch(() => setInsights([]))
      .finally(() => setLoading(false))
  }, [open])

  const insightsContent = (
    <div className="space-y-1.5">
      {loading ? (
        <div className="text-[10px] text-gray-400 text-center py-4">جاري التحميل...</div>
      ) : insights.length === 0 ? (
        <div className="text-[10px] text-gray-400 text-center py-4">لا توجد رؤى متاحة حالياً</div>
      ) : (
        insights.map((insight, i) => {
          const meta = iconMap[insight.type] ?? { icon: Brain, color: 'text-t-purple', bg: 'bg-t-purple/10' }
          const Icon = meta.icon
          return (
            <div
              key={i}
              className="p-2 rounded-xl bg-t-card/40 border border-t-border/30 hover:border-t-border/50 transition-all"
            >
              <div className="flex items-start gap-2">
                <div className={`w-6 h-6 rounded-lg ${meta.bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`h-3 w-3 ${meta.color}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-bold text-white">{insight.title}</span>
                  <p className="text-[10px] text-gray-400 mt-0.5 leading-relaxed">{insight.desc}</p>
                </div>
              </div>
            </div>
          )
        })
      )}
    </div>
  )

  return (
    <>
      <button
        onClick={onToggle}
        className="absolute top-20 max-sm:top-4 left-4 z-30 w-10 h-10 max-sm:w-11 max-sm:h-11 rounded-xl glass flex items-center justify-center text-t-purple hover:text-white active:scale-95 transition-all pointer-events-auto"
      >
        <Brain className="h-4 w-4 max-sm:h-5 max-sm:w-5" />
      </button>

      <AnimatePresence>
        {open && isMobile && (
          <motion.div
            key="ai-mobile-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && !isMobile && (
          <motion.div
            key="ai-desktop"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-28 left-4 max-sm:left-2 z-20 w-72 max-sm:w-[calc(100%-1rem)] pointer-events-none"
          >
            <div className="pointer-events-auto glass-card rounded-2xl p-3 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-t-purple to-t-cyan flex items-center justify-center">
                    <Brain className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-xs font-bold text-white">AI Insights</span>
                </div>
                <div className="flex items-center gap-1 text-[9px] text-t-cyan">
                  <Sparkles className="h-2.5 w-2.5" />
                  <span>مباشر</span>
                </div>
              </div>
              {insightsContent}
              <button className="w-full flex items-center justify-center gap-1 py-1.5 rounded-xl bg-t-purple/10 border border-t-purple/20 text-[10px] text-t-purple hover:bg-t-purple/20 transition-colors">
                <BarChart3 className="h-3 w-3" />
                <span>تقرير تحليلي كامل</span>
                <ChevronLeft className="h-2.5 w-2.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && isMobile && (
          <motion.div
            key="ai-mobile-sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none"
          >
            <div className="pointer-events-auto bg-t-panel/95 backdrop-blur-xl rounded-t-3xl border-t border-t-border/40 shadow-2xl max-h-[70vh] flex flex-col">
              <div className="flex justify-center pt-3 pb-1 shrink-0">
                <div className="w-10 h-1 rounded-full bg-gray-600" />
              </div>
              <div className="flex items-center justify-between px-5 pb-3 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-t-purple to-t-cyan flex items-center justify-center">
                    <Brain className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="text-sm font-bold text-white">AI Insights</span>
                </div>
                <button
                  onClick={onToggle}
                  className="w-8 h-8 rounded-xl bg-t-card/60 flex items-center justify-center text-gray-400 hover:text-white active:scale-90 transition-all"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="overflow-y-auto px-5 pb-6">
                <div className="flex items-center gap-1 text-[10px] text-t-cyan mb-3">
                  <Sparkles className="h-3 w-3" />
                  <span>تحليلات مباشرة بالذكاء الاصطناعي</span>
                </div>
                {insightsContent}
                <button className="w-full flex items-center justify-center gap-1 py-2 rounded-xl bg-t-purple/10 border border-t-purple/20 text-xs text-t-purple hover:bg-t-purple/20 transition-colors mt-2">
                  <BarChart3 className="h-3.5 w-3.5" />
                  <span>تقرير تحليلي كامل</span>
                  <ChevronLeft className="h-3 w-3" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
