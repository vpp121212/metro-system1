'use client'

import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Map,
  Train,
  Building2,
  Route,
  ArrowRightLeft,
  History,
  PlaySquare,
  BarChart3,
  FileText,
  BellDot,
  Wrench,
  Truck,
  Users,
  Shield,
  Key,
  ScrollText,
  Bot,
  Settings,
  Bell,
  ChevronDown,
  Eye,
  PanelLeftClose,
  PanelLeftOpen,
  Activity,
  LogOut,
  AlertTriangle,
  Camera,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth-context'

interface NavItem {
  labelAr: string
  labelEn: string
  href: string
  icon: ReactNode
  badge?: number
  roles?: string[]
}

interface NavGroup {
  titleAr: string
  titleEn: string
  items: NavItem[]
  roles?: string[]
}

const navigationGroups: NavGroup[] = [
  {
    titleAr: 'الرئيسية',
    titleEn: 'Main',
    items: [
      { labelAr: 'لوحة التحكم', labelEn: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
      { labelAr: 'الخريطة المباشرة', labelEn: 'Live Map', href: '/map', icon: <Map className="h-5 w-5" /> },
      { labelAr: 'الكاميرات', labelEn: 'Cameras', href: '/cameras', icon: <Camera className="h-5 w-5" /> },
    ],
  },
    {
      titleAr: 'التشغيل',
      titleEn: 'Operations',
      roles: ['ADMIN', 'SUPERVISOR'],
      items: [
        { labelAr: 'القطارات', labelEn: 'Trains', href: '/trains', icon: <Train className="h-5 w-5" /> },
        { labelAr: 'المحطات', labelEn: 'Stations', href: '/stations', icon: <Building2 className="h-5 w-5" /> },
        { labelAr: 'الخطوط', labelEn: 'Metro Lines', href: '/lines', icon: <Route className="h-5 w-5" /> },
        { labelAr: 'الرحلات', labelEn: 'Trips', href: '/trips', icon: <ArrowRightLeft className="h-5 w-5" /> },
        { labelAr: 'السجل', labelEn: 'History', href: '/history', icon: <History className="h-5 w-5" /> },
        { labelAr: 'إعادة التشغيل', labelEn: 'Playback', href: '/playback', icon: <PlaySquare className="h-5 w-5" /> },
      ],
    },
    {
      titleAr: 'التقارير والتحليلات',
      titleEn: 'Analytics & Reports',
      items: [
        { labelAr: 'التحليلات', labelEn: 'Analytics', href: '/analytics', icon: <BarChart3 className="h-5 w-5" /> },
        { labelAr: 'التقارير', labelEn: 'Reports', href: '/reports', icon: <FileText className="h-5 w-5" /> },
        { labelAr: 'التنبيهات', labelEn: 'Alerts', href: '/alerts', icon: <BellDot className="h-5 w-5" />, badge: 3 },
      ],
    },
    {
      titleAr: 'الأسطول والصيانة',
      titleEn: 'Fleet & Maintenance',
      roles: ['ADMIN', 'SUPERVISOR'],
      items: [
        { labelAr: 'الصيانة', labelEn: 'Maintenance', href: '/maintenance', icon: <Wrench className="h-5 w-5" /> },
        { labelAr: 'الأسطول', labelEn: 'Fleet', href: '/fleet', icon: <Truck className="h-5 w-5" /> },
      ],
    },
    {
      titleAr: 'الإدارة',
      titleEn: 'Administration',
      roles: ['ADMIN'],
      items: [
        { labelAr: 'لوحة الإدارة', labelEn: 'Admin Panel', href: '/admin', icon: <Shield className="h-5 w-5" /> },
        { labelAr: 'سجل التدقيق', labelEn: 'Audit Logs', href: '/audit-logs', icon: <ScrollText className="h-5 w-5" /> },
      ],
    },
    {
      titleAr: 'الأمن',
      titleEn: 'Security',
      roles: ['ADMIN', 'SUPERVISOR'],
      items: [
        { labelAr: 'تقارير الحوادث', labelEn: 'Incidents', href: '/incidents', icon: <AlertTriangle className="h-5 w-5" /> },
      ],
    },
    {
      titleAr: 'النظام',
      titleEn: 'System',
      items: [
        { labelAr: 'المساعد الذكي', labelEn: 'AI Assistant', href: '/ai', icon: <Bot className="h-5 w-5" /> },
        { labelAr: 'الإعدادات', labelEn: 'Settings', href: '/settings', icon: <Settings className="h-5 w-5" />, roles: ['ADMIN', 'SUPERVISOR'] },
        { labelAr: 'الإشعارات', labelEn: 'Notifications', href: '/notifications', icon: <Bell className="h-5 w-5" />, roles: ['ADMIN', 'SUPERVISOR'] },
      ],
    },
]

interface SidebarProps {
  open: boolean
  collapsed: boolean
  onClose: () => void
  onToggleCollapse: () => void
}

export default function Sidebar({ open, collapsed, onClose, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    Object.fromEntries(navigationGroups.map((g) => [g.titleEn, true]))
  )

  const toggleGroup = (groupTitle: string) => {
    setExpandedGroups((prev) => ({ ...prev, [groupTitle]: !prev[groupTitle] }))
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  const sidebarWidth = collapsed ? 'w-[72px]' : 'w-[260px]'

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          'fixed top-0 z-50 h-screen flex flex-col transition-transform duration-300 ease-in-out',
          'bg-t-panel/95 backdrop-blur-xl border-l border-t-border/50',
          'ltr:right-0 ltr:left-auto rtl:left-0 rtl:right-0',
          sidebarWidth,
          open ? 'translate-x-0' : 'ltr:translate-x-full rtl:-translate-x-full',
          'lg:!translate-x-0'
        )}
      >
        <div className={cn(
          'flex items-center gap-3 px-4 h-16 border-b border-t-border/50 shrink-0',
          collapsed && 'justify-center px-0'
        )}>
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-t-cyan/20 to-t-blue/20 border border-t-cyan/30">
            <Eye className="h-5 w-5 text-t-cyan" />
            <div className="absolute inset-0 rounded-xl animate-pulse-glow" />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-base font-bold text-white tracking-tight truncate">
                TrainEye AI
              </span>
              <span className="text-[10px] text-t-cyan/70 font-medium tracking-wider uppercase">
                Riyadh Metro
              </span>
            </div>
          )}
          <button
            onClick={onToggleCollapse}
            className={cn(
              'hidden lg:flex items-center justify-center w-8 h-8 rounded-lg',
              'text-gray-400 hover:text-white hover:bg-t-card transition-colors',
              collapsed && 'mt-2'
            )}
          >
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
          {navigationGroups.filter(group => !group.roles || !user || group.roles.includes(user.role)).map((group) => (
            <div key={group.titleEn} className="mb-1">
              {!collapsed && (
                <button
                  onClick={() => toggleGroup(group.titleEn)}
                  className="flex items-center justify-between w-full px-3 py-1.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-400 transition-colors"
                >
                  <span>{group.titleAr}</span>
                  <motion.div
                    animate={{ rotate: expandedGroups[group.titleEn] ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-3 w-3" />
                  </motion.div>
                </button>
              )}

              <AnimatePresence initial={false}>
                {(expandedGroups[group.titleEn] || collapsed) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    {group.items.filter(item => !item.roles || !user || item.roles.includes(user.role)).map((item) => {
                      const active = isActive(item.href)
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={onClose}
                          title={collapsed ? item.labelAr : undefined}
                          className={cn(
                            'group relative flex items-center gap-3 rounded-lg transition-all duration-200',
                            collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2',
                            active
                              ? 'bg-gradient-to-l from-t-cyan/15 to-t-blue/10 text-white'
                              : 'text-gray-400 hover:text-white hover:bg-t-card/60'
                          )}
                        >
                          {active && (
                            <motion.div
                              layoutId="sidebar-active"
                              className={cn(
                                'absolute top-1 bottom-1 w-[3px] rounded-full bg-gradient-to-b from-t-cyan to-t-blue',
                                'ltr:right-0 ltr:left-auto rtl:left-0 rtl:right-0'
                              )}
                              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                            />
                          )}

                          <div className={cn(
                            'relative flex items-center justify-center shrink-0',
                            active ? 'text-t-cyan' : 'text-gray-500 group-hover:text-t-cyan/70 transition-colors'
                          )}>
                            {item.icon}
                            {item.badge && item.badge > 0 && (
                              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-t-red text-[9px] font-bold text-white">
                                {item.badge}
                              </span>
                            )}
                          </div>

                          {!collapsed && (
                            <>
                              <span className={cn(
                                'text-sm font-medium truncate transition-colors',
                                active ? 'text-white' : 'text-gray-400 group-hover:text-white'
                              )}>
                                {item.labelAr}
                              </span>
                              <span className={cn(
                                'text-[10px] font-normal opacity-40 ltr:mr-auto rtl:ml-auto truncate hidden xl:inline',
                                active ? 'text-t-cyan/60' : 'text-gray-600'
                              )}>
                                {item.labelEn}
                              </span>
                            </>
                          )}
                        </Link>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        <div className={cn(
          'border-t border-t-border/50 p-3 shrink-0',
          collapsed && 'px-2'
        )}>
          <div className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2.5',
            'bg-gradient-to-l from-t-green/10 to-transparent border border-t-green/20',
            collapsed && 'justify-center px-2'
          )}>
            <div className="relative shrink-0">
              <Activity className="h-4 w-4 text-t-green" />
              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-t-green animate-pulse" />
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-medium text-t-green">
                  النظام يعمل
                </span>
                <span className="text-[10px] text-gray-500 truncate">
                  All systems operational
                </span>
              </div>
            )}
          </div>
        </div>

        <div className={cn(
          'border-t border-t-border/50 p-3 shrink-0',
          collapsed && 'px-2'
        )}>
          <button
            onClick={logout}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 w-full transition-colors',
              'text-gray-400 hover:text-t-red hover:bg-t-red/10',
              collapsed && 'justify-center px-2'
            )}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && (
              <span className="text-sm font-medium truncate">تسجيل الخروج</span>
            )}
          </button>
        </div>
      </aside>
    </>
  )
}

