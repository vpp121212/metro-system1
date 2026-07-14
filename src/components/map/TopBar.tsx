'use client'

import { useState, useEffect } from 'react'
import { Search, Bell, Clock, Wifi, Signal, ChevronDown } from 'lucide-react'

interface TopBarProps {
  onSearch?: (query: string) => void
  onToggleNotifications?: () => void
  onToggleProfile?: () => void
}

export default function TopBar({ onSearch, onToggleNotifications, onToggleProfile }: TopBarProps) {
  const [time, setTime] = useState(new Date())
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute top-0 left-0 right-0 z-30 pointer-events-none">
      <div className="pointer-events-auto mx-4 mt-3">
        <div className="glass rounded-2xl px-4 py-2.5 flex items-center justify-between">
          {/* Left: Logo + Status */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-t-cyan to-t-blue flex items-center justify-center">
                <span className="text-black text-xs font-black">T</span>
              </div>
              <span className="text-white font-bold text-sm hidden sm:inline">TrainEye AI</span>
            </div>
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-t-green/10 border border-t-green/20">
              <span className="w-1.5 h-1.5 rounded-full bg-t-green animate-pulse" />
              <span className="text-[10px] text-t-green font-medium">النظام يعمل بكفاءة</span>
            </div>
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-t-card/60 border border-t-border/40">
              <Wifi className="h-3 w-3 text-t-cyan" />
              <Signal className="h-3 w-3 text-t-green" />
              <span className="text-[10px] text-gray-400">24 قطار متصل</span>
            </div>
          </div>

          {/* Center: Search */}
          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
              <input
                type="text"
                placeholder="ابحث عن محطة، قطار، أو خط..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  onSearch?.(e.target.value)
                }}
                className="w-full bg-t-card/60 border border-t-border/40 rounded-xl py-1.5 pr-9 pl-3 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-t-cyan/40 transition-colors"
              />
            </div>
          </div>

          {/* Right: Time + Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-gray-400">
              <Clock className="h-3.5 w-3.5" />
              <span className="text-xs font-mono" dir="ltr">
                {time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden w-8 h-8 rounded-xl bg-t-card/60 border border-t-border/40 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            >
              <Search className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={onToggleNotifications}
              className="relative w-8 h-8 rounded-xl bg-t-card/60 border border-t-border/40 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            >
              <Bell className="h-3.5 w-3.5" />
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-t-red text-[7px] font-bold text-white flex items-center justify-center">3</span>
            </button>
            <button
              onClick={onToggleProfile}
              className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-t-card/60 border border-t-border/40 hover:bg-t-card transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-t-purple to-t-cyan flex items-center justify-center text-[9px] font-bold text-white">
                M
              </div>
              <span className="text-xs text-gray-300 hidden lg:inline">مدير النظام</span>
              <ChevronDown className="h-3 w-3 text-gray-500 hidden lg:block" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile search */}
      {searchOpen && (
        <div className="pointer-events-auto mx-4 mt-2 md:hidden">
          <div className="glass rounded-2xl p-3">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="ابحث عن محطة، قطار، أو خط..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  onSearch?.(e.target.value)
                }}
                className="w-full bg-t-card/60 border border-t-border/40 rounded-xl py-2 pr-10 pl-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-t-cyan/40 transition-colors"
                autoFocus
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
