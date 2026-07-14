'use client'

import { useEffect, useState, useRef } from 'react'
import { AlertTriangle, Info, AlertCircle, X } from 'lucide-react'

interface TickerItem {
  id: string
  type: 'CRITICAL' | 'WARNING' | 'INFO'
  message: string
  line?: string
}

const alerts: TickerItem[] = [
  { id: '1', type: 'CRITICAL', message: 'عطل في الإشارات على الخط الأزرق عند محطة البنك الأول - يرجى توخي الحذر', line: 'Blue' },
  { id: '2', type: 'WARNING', message: 'ازدحام متوقع على الخط الأحمر في محطة جامعة الملك سعود الساعة 14:30', line: 'Red' },
  { id: '3', type: 'INFO', message: 'صيانة دورية على الخط البرتقالي غداً من 23:00 إلى 05:00', line: 'Orange' },
  { id: '4', type: 'WARNING', message: 'تأخير 5 دقائق على الخط الأصفر بسبب أعمال الصيانة في محطة المطار', line: 'Yellow' },
  { id: '5', type: 'INFO', message: 'القطار Y-002 يعود للخدمة بعد الصيانة - الخط الأصفر', line: 'Yellow' },
  { id: '6', type: 'CRITICAL', message: 'انقطاع التيار الكهربائي في محطة المتحف الوطني - الفرق الفنية في الموقع', line: 'Blue' },
]

const typeConfig = {
  CRITICAL: { bg: 'bg-t-red', border: 'border-t-red/50', icon: AlertCircle },
  WARNING: { bg: 'bg-t-orange', border: 'border-t-orange/50', icon: AlertTriangle },
  INFO: { bg: 'bg-t-blue', border: 'border-t-blue/50', icon: Info },
}

export default function TickerBar() {
  const [items] = useState(alerts)
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())
  const scrollRef = useRef<HTMLDivElement>(null)

  const visible = items.filter(i => !dismissed.has(i.id))

  return (
    <div className="relative w-full overflow-hidden" style={{ height: visible.length > 0 ? '44px' : '0px' }}>
      <div className="absolute inset-0 bg-gradient-to-l from-[#060b18] via-[#060b18]/95 to-[#060b18] border-b border-white/10 flex items-center overflow-hidden shadow-lg shadow-red-500/5">
        {/* Static label */}
        <div className="shrink-0 flex items-center gap-2 px-4 h-full bg-gradient-to-l from-t-red/30 to-t-red/20 border-l border-t-border/40 z-10">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-t-red opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-t-red" />
          </span>
          <span className="text-[13px] font-bold text-t-red uppercase tracking-wider">بلاغات عاجلة</span>
        </div>

        {/* Scrolling messages */}
        <div className="flex-1 overflow-hidden relative">
          <div
            ref={scrollRef}
            className="flex gap-12 whitespace-nowrap animate-ticker items-center h-full"
            style={{
              animation: 'ticker 35s linear infinite',
            }}
          >
            {visible.concat(visible).map((item, i) => {
              const cfg = typeConfig[item.type]
              const Icon = cfg.icon
              return (
                <div
                  key={`${item.id}-${i}`}
                  className={`inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-md ${cfg.bg} ${cfg.border} border`}
                  style={{ marginLeft: i === 0 ? '0' : undefined }}
                >
                  <Icon className="h-4 w-4 shrink-0 text-white-pure" />
                  <span className="text-[13px] font-medium whitespace-nowrap text-white-pure">{item.message}</span>
                  {item.line && (
                    <span className="text-[11px] opacity-80 whitespace-nowrap text-white-pure/80">• {item.line}</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Count */}
        <div className="shrink-0 flex items-center gap-1.5 px-4 h-full border-r border-t-border/40 bg-t-dark/80 z-10">
          <span className="text-[13px] font-bold text-t-red">{visible.length}</span>
          <span className="text-[11px] text-gray-400">بلاغ</span>
        </div>

        {/* Close all */}
        {visible.length > 0 && (
          <button
            onClick={() => setDismissed(new Set(items.map(i => i.id)))}
            className="shrink-0 flex items-center justify-center w-9 h-full hover:bg-t-card/40 transition-colors border-r border-t-border/40 group"
          >
            <X className="h-4 w-4 text-gray-500 group-hover:text-gray-300 transition-colors" />
          </button>
        )}
      </div>
    </div>
  )
}
