'use client'

import { ReactNode, useState } from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import Sidebar from './Sidebar'
import Header from './Header'

interface AppLayoutProps {
  children: ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const pathname = usePathname()
  const isAuthPage = pathname === '/login'
  const isMapPage = pathname === '/map'

  if (isAuthPage) {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen overflow-hidden bg-t-dark">
      <Sidebar
        open={sidebarOpen}
        collapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className={cn(
        'flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out',
        'lg:ps-[260px]',
        sidebarCollapsed && 'lg:ps-[72px]'
      )}>
        {!isMapPage && (
          <Header
            onMenuClick={() => setSidebarOpen(true)}
            sidebarCollapsed={sidebarCollapsed}
          />
        )}
        <main className={cn(
          'flex-1',
          isMapPage ? 'overflow-hidden' : 'overflow-y-auto p-4 md:p-6 lg:p-8'
        )}>
          {children}
        </main>
      </div>
    </div>
  )
}
