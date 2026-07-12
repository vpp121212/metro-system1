'use client'

import { cn } from '@/lib/utils'

type BadgeStatus = 'active' | 'inactive' | 'maintenance' | 'offline' | 'critical' | 'warning' | 'info' | 'normal' | 'delayed' | 'completed'
type BadgeSize = 'sm' | 'md' | 'lg'

interface StatusBadgeProps {
  status: BadgeStatus
  size?: BadgeSize
  className?: string
}

const statusConfig: Record<BadgeStatus, { color: string; labelAr: string; labelEn: string }> = {
  active:      { color: 'bg-t-green/15 text-t-green border-t-green/25',    labelAr: 'نشط',        labelEn: 'Active' },
  inactive:    { color: 'bg-gray-500/15 text-gray-400 border-gray-500/25', labelAr: 'غير نشط',    labelEn: 'Inactive' },
  maintenance: { color: 'bg-t-yellow/15 text-t-yellow border-t-yellow/25', labelAr: 'صيانة',      labelEn: 'Maintenance' },
  offline:     { color: 'bg-gray-600/15 text-gray-500 border-gray-600/25', labelAr: 'غير متصل',  labelEn: 'Offline' },
  critical:    { color: 'bg-t-red/15 text-t-red border-t-red/25',          labelAr: 'حرج',        labelEn: 'Critical' },
  warning:     { color: 'bg-t-orange/15 text-t-orange border-t-orange/25', labelAr: 'تحذير',      labelEn: 'Warning' },
  info:        { color: 'bg-t-blue/15 text-t-blue border-t-blue/25',       labelAr: 'معلومات',    labelEn: 'Info' },
  normal:      { color: 'bg-t-green/15 text-t-green border-t-green/25',    labelAr: 'عادي',       labelEn: 'Normal' },
  delayed:     { color: 'bg-t-orange/15 text-t-orange border-t-orange/25', labelAr: 'متأخر',      labelEn: 'Delayed' },
  completed:   { color: 'bg-t-cyan/15 text-t-cyan border-t-cyan/25',       labelAr: 'مكتمل',      labelEn: 'Completed' },
}

const dotColorMap: Record<BadgeStatus, string> = {
  active:      'bg-t-green',
  inactive:    'bg-gray-400',
  maintenance: 'bg-t-yellow',
  offline:     'bg-gray-500',
  critical:    'bg-t-red',
  warning:     'bg-t-orange',
  info:        'bg-t-blue',
  normal:      'bg-t-green',
  delayed:     'bg-t-orange',
  completed:   'bg-t-cyan',
}

const sizeStyles: Record<BadgeSize, { badge: string; dot: string; text: string }> = {
  sm: { badge: 'px-2 py-0.5 text-[10px]', dot: 'h-1.5 w-1.5', text: 'gap-1' },
  md: { badge: 'px-2.5 py-1 text-xs',      dot: 'h-2 w-2',     text: 'gap-1.5' },
  lg: { badge: 'px-3 py-1.5 text-sm',      dot: 'h-2.5 w-2.5', text: 'gap-2' },
}

export default function StatusBadge({ status, size = 'md', className }: StatusBadgeProps) {
  const config = statusConfig[status]
  const sizeConfig = sizeStyles[size]
  const dotColor = dotColorMap[status]

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-semibold',
        config.color,
        sizeConfig.badge,
        sizeConfig.text,
        className
      )}
    >
      <span className={cn('rounded-full shrink-0', dotColor, sizeConfig.dot)} />
      <span>{config.labelAr}</span>
    </span>
  )
}
