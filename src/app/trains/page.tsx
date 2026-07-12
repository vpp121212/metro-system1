'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Train,
  Search,
  Filter,
  AlertTriangle,
  Wrench,
  WifiOff,
  ArrowRight,
  Gauge,
  MapPin,
} from 'lucide-react'
import PageHeader from '@/components/layout/PageHeader'
import StatCard from '@/components/layout/StatCard'
import StatusBadge from '@/components/layout/StatusBadge'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface TrainData {
  id: string
  name: string
  code: string
  status: string
  speed: number
  direction: string
  passengerCount: number
  capacity: number
  line: { id: string; nameEn: string; nameAr: string; color: string; colorHex: string }
  currentStation: { id: string; nameEn: string; nameAr: string } | null
  createdAt: string
}

interface Line {
  id: string
  nameAr: string
  colorHex: string
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function TrainsPage() {
  const [trains, setTrains] = useState<TrainData[]>([])
  const [lines, setLines] = useState<Line[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterLine, setFilterLine] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    async function fetchData() {
      try {
        const [trainsRes, linesRes] = await Promise.all([
          fetch('/api/trains'),
          fetch('/api/lines'),
        ])
        if (trainsRes.ok) setTrains(await trainsRes.json())
        if (linesRes.ok) setLines(await linesRes.json())
      } catch {
        // handle error
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const stats = useMemo(() => ({
    total: trains.length,
    active: trains.filter((t) => t.status === 'ACTIVE').length,
    maintenance: trains.filter((t) => t.status === 'MAINTENANCE').length,
    offline: trains.filter((t) => t.status === 'OFFLINE' || t.status === 'INACTIVE').length,
  }), [trains])

  const filteredTrains = useMemo(() => {
    return trains.filter((t) => {
      const matchSearch = !search || t.name.includes(search) || t.code.includes(search)
      const matchLine = filterLine === 'all' || t.line.id === filterLine
      const matchStatus = filterStatus === 'all' || t.status === filterStatus
      return matchSearch && matchLine && matchStatus
    })
  }, [trains, search, filterLine, filterStatus])

  const statusToBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'active' as const
      case 'MAINTENANCE': return 'maintenance' as const
      case 'OFFLINE': case 'INACTIVE': return 'offline' as const
      case 'DELAYED': return 'delayed' as const
      default: return 'inactive' as const
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="القطارات"
        description="إدارة ومتابعة أسطول القطارات"
        actions={
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="بحث بالاسم أو الكود..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-52 pr-9 bg-t-card/60 border-t-border/40 text-white placeholder:text-gray-500 text-sm"
              />
            </div>
          </div>
        }
      />

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
        >
          <motion.div variants={fadeIn}>
            <StatCard title="إجمالي القطارات" value={stats.total} icon={<Train className="h-5 w-5" />} color="cyan" />
          </motion.div>
          <motion.div variants={fadeIn}>
            <StatCard title="نشطة" value={stats.active} icon={<Train className="h-5 w-5" />} color="green" />
          </motion.div>
          <motion.div variants={fadeIn}>
            <StatCard title="في الصيانة" value={stats.maintenance} icon={<Wrench className="h-5 w-5" />} color="yellow" />
          </motion.div>
          <motion.div variants={fadeIn}>
            <StatCard title="غير متصلة" value={stats.offline} icon={<WifiOff className="h-5 w-5" />} color="red" />
          </motion.div>
        </motion.div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 text-sm text-gray-400">
          <Filter className="h-4 w-4" />
          <span>الخط:</span>
        </div>
        <button
          onClick={() => setFilterLine('all')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
            filterLine === 'all' ? 'bg-t-cyan/20 text-t-cyan border border-t-cyan/30' : 'bg-t-card/60 text-gray-400 border border-t-border/30 hover:text-white'
          }`}
        >
          الكل
        </button>
        {lines.map((line) => (
          <button
            key={line.id}
            onClick={() => setFilterLine(line.id)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
              filterLine === line.id ? 'bg-t-card text-white border border-t-border/60' : 'bg-t-card/60 text-gray-400 border border-t-border/30 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: line.colorHex }} />
            {line.nameAr}
          </button>
        ))}
        <div className="w-px h-5 bg-t-border/40 mx-1" />
        <div className="flex items-center gap-1.5 text-sm text-gray-400">
          <span>الحالة:</span>
        </div>
        {['all', 'ACTIVE', 'MAINTENANCE', 'OFFLINE'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              filterStatus === status ? 'bg-t-card text-white border border-t-border/60' : 'bg-t-card/60 text-gray-400 border border-t-border/30 hover:text-white'
            }`}
          >
            {status === 'all' ? 'الكل' : status === 'ACTIVE' ? 'نشط' : status === 'MAINTENANCE' ? 'صيانة' : 'غير متصل'}
          </button>
        ))}
      </div>

      {/* Trains Grid / Table */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-44 rounded-xl" />
          ))}
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
        >
          {filteredTrains.map((train) => (
            <motion.div key={train.id} variants={fadeIn}>
              <a href={`/trains/${train.id}`}>
                <Card className="bg-t-panel/60 backdrop-blur-md border-t-border/40 hover:border-t-border/60 transition-all cursor-pointer group h-full">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${train.line.colorHex}20` }}
                        >
                          <Train className="h-4 w-4" style={{ color: train.line.colorHex }} />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold text-white truncate">{train.name}</h3>
                          <p className="text-xs text-gray-500">{train.code}</p>
                        </div>
                      </div>
                      <StatusBadge status={statusToBadge(train.status)} size="sm" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: train.line.colorHex }} />
                          {train.line.nameAr}
                        </span>
                        <span className="text-gray-500 flex items-center gap-1">
                          <Gauge className="h-3 w-3" />
                          {train.speed} كم/س
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {train.currentStation?.nameAr || 'غير محدد'}
                        </span>
                        <span className="text-gray-500 flex items-center gap-1">
                          <ArrowRight className="h-3 w-3" />
                          {train.direction === 'FORWARD' ? 'مقدم' : 'رجعي'}
                        </span>
                      </div>
                      <div className="mt-2 p-2 rounded-md bg-t-card/40 border border-t-border/20">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">الركاب</span>
                          <span className="text-white font-medium">{train.passengerCount}/{train.capacity}</span>
                        </div>
                        <div className="mt-1 h-1.5 rounded-full bg-t-dark overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${Math.min((train.passengerCount / train.capacity) * 100, 100)}%`,
                              backgroundColor: train.passengerCount / train.capacity > 0.8 ? '#ef4444' : train.passengerCount / train.capacity > 0.5 ? '#eab308' : '#22c55e',
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </a>
            </motion.div>
          ))}
          {filteredTrains.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-500">
              <Train className="h-12 w-12 mb-3 opacity-30" />
              <p className="text-sm">لا توجد قطارات تطابق البحث</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}
