'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Menu,
  Search,
  Bell,
  Globe,
  LogOut,
  Settings,
  Command,
  Sun,
  Moon,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth-context'

const pageTitles: Record<string, { ar: string; en: string }> = {
  '/dashboard': { ar: 'لوحة التحكم', en: 'Dashboard' },
  '/map': { ar: 'الخريطة المباشرة', en: 'Live Map' },
  '/trains': { ar: 'القطارات', en: 'Trains' },
  '/stations': { ar: 'المحطات', en: 'Stations' },
  '/lines': { ar: 'الخطوط', en: 'Metro Lines' },
  '/trips': { ar: 'الرحلات', en: 'Trips' },
  '/history': { ar: 'السجل', en: 'History' },
  '/playback': { ar: 'إعادة التشغيل', en: 'Playback' },
  '/analytics': { ar: 'التحليلات', en: 'Analytics' },
  '/reports': { ar: 'التقارير', en: 'Reports' },
  '/alerts': { ar: 'التنبيهات', en: 'Alerts' },
  '/maintenance': { ar: 'الصيانة', en: 'Maintenance' },
  '/fleet': { ar: 'الأسطول', en: 'Fleet' },
  '/users': { ar: 'المستخدمين', en: 'Users' },
  '/roles': { ar: 'الصلاحيات', en: 'Roles' },
  '/permissions': { ar: 'الأذونات', en: 'Permissions' },
  '/audit-logs': { ar: 'سجل التدقيق', en: 'Audit Logs' },
  '/ai': { ar: 'المساعد الذكي', en: 'AI Assistant' },
  '/settings': { ar: 'الإعدادات', en: 'Settings' },
  '/notifications': { ar: 'الإشعارات', en: 'Notifications' },
}

interface HeaderProps {
  onMenuClick: () => void
  sidebarCollapsed: boolean
}

export default function Header({ onMenuClick, sidebarCollapsed }: HeaderProps) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [time, setTime] = useState<string>('')

  useEffect(() => { setMounted(true) }, [])
  const [date, setDate] = useState<string>('')

  const pageTitle = pageTitles[pathname] || { ar: 'لوحة التحكم', en: 'Dashboard' }

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTime(
        now.toLocaleTimeString('ar-SA', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      )
      setDate(
        now.toLocaleDateString('ar-SA', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      )
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className={cn(
      'sticky top-0 z-30 h-16 flex items-center gap-4 px-4 md:px-6',
      'bg-t-panel/80 backdrop-blur-xl border-b border-t-border/50'
    )}>
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuClick}
        className="lg:hidden shrink-0 text-gray-400 hover:text-white"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex flex-col min-w-0">
        <h1 className="text-lg font-bold text-white truncate">{pageTitle.ar}</h1>
        <p className="text-[11px] text-gray-500 truncate hidden sm:block">{pageTitle.en}</p>
      </div>

      <div className="flex items-center gap-2 ltr:mr-auto rtl:ml-auto">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-t-card/60 border border-t-border/30 text-gray-500 hover:text-gray-400 hover:border-t-border/50 transition-all cursor-pointer min-w-[200px]">
          <Search className="h-3.5 w-3.5 shrink-0" />
          <span className="text-xs flex-1 text-left">بحث سريع...</span>
          <kbd className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-t-panel border border-t-border/50 text-[10px] text-gray-500 font-mono">
            <Command className="h-2.5 w-2.5" />K
          </kbd>
        </div>
      </div>

      <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-t-green/10 border border-t-green/20">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-t-green opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-t-green" />
        </span>
        <span className="text-xs font-medium text-t-green">Live</span>
      </div>

      <div className="hidden md:flex flex-col items-end min-w-0">
        <span className="text-sm font-medium text-white tabular-nums">{time}</span>
        <span className="text-[10px] text-gray-500 truncate">{date}</span>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="relative text-gray-400 hover:text-white shrink-0"
      >
        <Globe className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="relative text-gray-400 hover:text-white shrink-0"
        title={theme === 'dark' ? 'الوضع النهاري' : 'الوضع الليلي'}
      >
        {mounted && theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="relative text-gray-400 hover:text-white shrink-0"
      >
        <Bell className="h-4 w-4" />
        <span className="absolute top-1.5 left-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-t-red text-[9px] font-bold text-white">
          5
        </span>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-9 w-9 rounded-full shrink-0">
            <Avatar className="h-9 w-9 border-2 border-t-border/50">
              <AvatarFallback className="bg-gradient-to-br from-t-blue to-t-purple text-white text-sm font-bold">
                {user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56 bg-t-panel border-t-border/50 backdrop-blur-xl"
        >
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-white">{user?.name || 'مستخدم'}</p>
              <p className="text-xs text-gray-500">{user?.employeeId || ''}</p>
              <p className="text-xs text-t-cyan">{user?.role === 'ADMIN' ? 'أدمن' : user?.role === 'SUPERVISOR' ? 'مشرف' : user?.role === 'VIEWER' ? 'مشغل' : ''}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-t-border/50" />
          <DropdownMenuItem className="text-gray-400 focus:text-white focus:bg-t-card cursor-pointer gap-2" onClick={() => window.location.href = '/settings'}>
            <Settings className="h-4 w-4" />
            <span>الإعدادات</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-t-border/50" />
          <DropdownMenuItem className="text-t-red focus:text-t-red focus:bg-t-red/10 cursor-pointer gap-2" onClick={logout}>
            <LogOut className="h-4 w-4" />
            <span>تسجيل الخروج</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
