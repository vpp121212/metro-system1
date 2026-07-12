'use client'

import { ReactNode } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  icon: ReactNode
  trend?: { value: number; positive: boolean }
  subtitle?: string
  color?: string
  className?: string
}

const colorMap: Record<string, string> = {
  cyan: 'from-t-cyan/20 to-t-cyan/5 border-t-cyan/30 text-t-cyan',
  blue: 'from-t-blue/20 to-t-blue/5 border-t-blue/30 text-t-blue',
  green: 'from-t-green/20 to-t-green/5 border-t-green/30 text-t-green',
  red: 'from-t-red/20 to-t-red/5 border-t-red/30 text-t-red',
  orange: 'from-t-orange/20 to-t-orange/5 border-t-orange/30 text-t-orange',
  purple: 'from-t-purple/20 to-t-purple/5 border-t-purple/30 text-t-purple',
  yellow: 'from-t-yellow/20 to-t-yellow/5 border-t-yellow/30 text-t-yellow',
}

const accentBorderMap: Record<string, string> = {
  cyan: 'border-l-t-cyan',
  blue: 'border-l-t-blue',
  green: 'border-l-t-green',
  red: 'border-l-t-red',
  orange: 'border-l-t-orange',
  purple: 'border-l-t-purple',
  yellow: 'border-l-t-yellow',
}

export default function StatCard({ title, value, icon, trend, subtitle, color = 'cyan', className }: StatCardProps) {
  return (
    <div
      className={cn(
        'relative rounded-xl p-4 md:p-5 overflow-hidden',
        'bg-t-panel/60 backdrop-blur-md border border-t-border/40',
        'border-l-[3px]',
        accentBorderMap[color] || 'border-l-t-cyan',
        'hover:border-t-border/60 transition-colors',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-sm text-gray-400 font-medium truncate">{title}</p>
          <p className="text-2xl md:text-3xl font-bold text-white mt-1 tabular-nums">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className={cn(
              'flex items-center gap-1 mt-2 text-xs font-medium',
              trend.positive ? 'text-t-green' : 'text-t-red'
            )}>
              {trend.positive ? (
                <TrendingUp className="h-3.5 w-3.5" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5" />
              )}
              <span>{Math.abs(trend.value)}%</span>
              <span className="text-gray-500 font-normal">من الأمس</span>
            </div>
          )}
        </div>
        <div className={cn(
          'flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br border',
          colorMap[color] || colorMap.cyan
        )}>
          {icon}
        </div>
      </div>

      <div className={cn(
        'absolute inset-0 opacity-[0.03] pointer-events-none bg-gradient-to-br',
        color === 'cyan' ? 'from-t-cyan' :
        color === 'blue' ? 'from-t-blue' :
        color === 'green' ? 'from-t-green' :
        color === 'red' ? 'from-t-red' :
        color === 'orange' ? 'from-t-orange' :
        color === 'purple' ? 'from-t-purple' :
        'from-t-yellow'
      )} />
    </div>
  )
}
