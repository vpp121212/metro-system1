'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
  className?: string
}

export default function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between p-4 md:p-5 rounded-xl',
        'bg-t-panel/60 backdrop-blur-md border border-t-border/40',
        className
      )}
    >
      <div className="min-w-0">
        <h2 className="text-xl md:text-2xl font-bold text-white truncate">{title}</h2>
        {description && (
          <p className="text-sm text-gray-400 mt-1 truncate">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 mt-3 sm:mt-0 shrink-0">
          {actions}
        </div>
      )}
    </div>
  )
}
