'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain, Sparkles, X, Zap, BarChart3, Clock,
  TrendingUp, Activity, ChevronLeft,
} from 'lucide-react'

interface AIPanelProps {
  open: boolean
  onToggle: () => void
}

const insights = [
  {
    id: '1',
    title: 'ازدحام متوقع',
    desc: 'من المتوقع ازدحام على الخط الأزرق عند محطة المتحف الوطني الساعة 14:30',
    icon: TrendingUp,
    color: 'text-t-orange',
    bg: 'bg-t-orange/10',
    time: 'منذ 2 دقيقة',
  },
  {
    id: '2',
    title: 'كفاءة الطاقة',
    desc: 'توفير 12% في استهلاك الطاقة مقارنة بالأسبوع الماضي',
    icon: Zap,
    color: 'text-t-yellow',
    bg: 'bg-t-yellow/10',
    time: 'منذ 5 دقائق',
  },
  {
    id: '3',
    title: 'تحليل الازدحام',
    desc: 'معدل الإشغال الحالي 68% أقل من المتوقع بنسبة 5%',
    icon: Activity,
    color: 'text-t-cyan',
    bg: 'bg-t-cyan/10',
    time: 'منذ 10 دقائق',
  },
  {
    id: '4',
    title: 'صيانة تنبؤية',
    desc: 'القطار Y-002 يحتاج صيانة دورية خلال 48 ساعة',
    icon: Clock,
    color: 'text-t-purple',
    bg: 'bg-t-purple/10',
    time: 'منذ 15 دقيقة',
  },
]

export default function AIPanel({ open, onToggle }: AIPanelProps) {
  return (
    <>
      <button
        onClick={onToggle}
        className="absolute top-20 left-4 z-30 w-9 h-9 rounded-xl glass flex items-center justify-center text-t-purple hover:text-white transition-colors pointer-events-auto"
      >
        <Brain className="h-4 w-4" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-28 left-4 z-20 w-72 pointer-events-none"
          >
            <div className="pointer-events-auto glass-card rounded-2xl p-3 space-y-3">
              {/* Header */}
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

              {/* Insights */}
              <div className="space-y-1.5">
                {insights.map((insight) => (
                  <div
                    key={insight.id}
                    className="p-2 rounded-xl bg-t-card/40 border border-t-border/30 hover:border-t-border/50 transition-all"
                  >
                    <div className="flex items-start gap-2">
                      <div className={`w-6 h-6 rounded-lg ${insight.bg} flex items-center justify-center shrink-0`}>
                        <insight.icon className={`h-3 w-3 ${insight.color}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-white">{insight.title}</span>
                          <span className="text-[8px] text-gray-500">{insight.time}</span>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-0.5 leading-relaxed">{insight.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom CTA */}
              <button className="w-full flex items-center justify-center gap-1 py-1.5 rounded-xl bg-t-purple/10 border border-t-purple/20 text-[10px] text-t-purple hover:bg-t-purple/20 transition-colors">
                <BarChart3 className="h-3 w-3" />
                <span>تقرير تحليلي كامل</span>
                <ChevronLeft className="h-2.5 w-2.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
