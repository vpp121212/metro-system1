'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Building2,
  Search,
  Train,
  ArrowRight,
  GitBranch,
} from 'lucide-react'
import PageHeader from '@/components/layout/PageHeader'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

interface StationData {
  id: string
  nameEn: string
  nameAr: string
  lat: number
  lng: number
  order: number
  isInterchange: boolean
  line: { id: string; nameEn: string; nameAr: string; color: string; colorHex: string }
  _count: { trains: number; cameras: number }
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

export default function StationsPage() {
  const [stations, setStations] = useState<StationData[]>([])
  const [lines, setLines] = useState<Line[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterLine, setFilterLine] = useState('all')

  useEffect(() => {
    async function fetchData() {
      try {
        const [stationsRes, linesRes] = await Promise.all([
          fetch('/api/stations'),
          fetch('/api/lines'),
        ])
        if (stationsRes.ok) setStations(await stationsRes.json())
        if (linesRes.ok) setLines(await linesRes.json())
      } catch {
        // handle error
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredStations = useMemo(() => {
    return stations.filter((s) => {
      const matchSearch = !search || s.nameAr.includes(search) || s.nameEn.toLowerCase().includes(search.toLowerCase())
      const matchLine = filterLine === 'all' || s.line.id === filterLine
      return matchSearch && matchLine
    })
  }, [stations, search, filterLine])

  const crowdDensity = (stationId: string) => {
    const hash = stationId.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
    return (hash % 85) + 10
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="المحطات"
        description="قائمة جميع محطات شبكة المترو"
        actions={
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="بحث عن محطة..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-52 pr-9 bg-t-card/60 border-t-border/40 text-white placeholder:text-gray-500 text-sm"
            />
          </div>
        }
      />

      {/* Line Filter */}
      <div className="flex flex-wrap items-center gap-2">
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
      </div>

      {/* Stations Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-44 rounded-xl" />
          ))}
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
        >
          {filteredStations.map((station) => {
            const density = crowdDensity(station.id)
            return (
              <motion.div key={station.id} variants={fadeIn}>
                <a href={`/stations/${station.id}`}>
                  <Card className="bg-t-panel/60 backdrop-blur-md border-t-border/40 hover:border-t-border/60 transition-all cursor-pointer group h-full">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `${station.line.colorHex}20` }}
                          >
                            <Building2 className="h-4 w-4" style={{ color: station.line.colorHex }} />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-sm font-bold text-white truncate">{station.nameAr}</h3>
                            <p className="text-xs text-gray-500 truncate">{station.nameEn}</p>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-600 group-hover:text-gray-400 transition-colors shrink-0 mt-1" />
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
                          style={{
                            backgroundColor: `${station.line.colorHex}15`,
                            color: station.line.colorHex,
                            border: `1px solid ${station.line.colorHex}25`,
                          }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: station.line.colorHex }} />
                          {station.line.nameAr}
                        </span>
                        {station.isInterchange && (
                          <Badge variant="outline" className="text-[10px] border-t-purple/40 text-t-purple bg-t-purple/10 gap-1">
                            <GitBranch className="h-2.5 w-2.5" />
                            تحويل
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">مستوى الازدحام</span>
                          <span className="text-white font-medium">{density}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-t-dark overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${density}%`,
                              backgroundColor: density > 75 ? '#ef4444' : density > 50 ? '#eab308' : '#22c55e',
                            }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Train className="h-3 w-3" />
                          {station._count.trains} قطار
                        </span>
                        <span>{station._count.cameras} كاميرا</span>
                      </div>
                    </CardContent>
                  </Card>
                </a>
              </motion.div>
            )
          })}
          {filteredStations.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-500">
              <Building2 className="h-12 w-12 mb-3 opacity-30" />
              <p className="text-sm">لا توجد محطات تطابق البحث</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}
