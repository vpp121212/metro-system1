'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Route,
  MapPin,
  Train,
  Clock,
  ChevronLeft,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react'
import PageHeader from '@/components/layout/PageHeader'
import StatusBadge from '@/components/layout/StatusBadge'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface LineData {
  id: string
  nameAr: string
  nameEn: string
  color: string
  colorHex: string
  order: number
  stationCount: number
  totalTrains: number
  activeTrains: number
  tripCount: number
}

interface MapLine {
  id: string
  nameAr: string
  colorHex: string
  stations: { order: number }[]
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function LinesPage() {
  const [lines, setLines] = useState<LineData[]>([])
  const [mapLines, setMapLines] = useState<MapLine[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [linesRes, mapRes] = await Promise.all([
          fetch('/api/lines'),
          fetch('/api/map/lines'),
        ])
        if (linesRes.ok) setLines(await linesRes.json())
        if (mapRes.ok) setMapLines(await mapRes.json())
      } catch {
        // handle error
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const getLineStationCount = (lineId: string) => {
    const ml = mapLines.find((l) => l.id === lineId)
    return ml ? ml.stations.length : 0
  }

  const performanceMetrics = (line: LineData) => {
    const onTimeRate = line.tripCount > 0
      ? Math.max(85, 100 - (line.totalTrains - line.activeTrains) * 3)
      : 98
    const avgDelay = line.activeTrains > 0
      ? (Math.random() * 3 + 0.5).toFixed(1)
      : '0.0'
    return { onTimeRate, avgDelay }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="الخطوط" description="إدارة ومتابعة خطوط المترو الستة" />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-72 rounded-xl" />
          ))}
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        >
          {lines.map((line) => {
            const stationCount = getLineStationCount(line.id) || line.stationCount
            const metrics = performanceMetrics(line)
            const status = line.activeTrains > 0 ? 'normal' : 'delayed'
            return (
              <motion.div key={line.id} variants={fadeIn}>
                <a href={`/lines/${line.id}`}>
                  <Card className="bg-t-panel/60 backdrop-blur-md border-t-border/40 hover:border-t-border/60 transition-all cursor-pointer group h-full">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: `${line.colorHex}20`, border: `1px solid ${line.colorHex}30` }}
                          >
                            <Route className="h-5 w-5" style={{ color: line.colorHex }} />
                          </div>
                          <div>
                            <CardTitle className="text-base text-white">{line.nameAr}</CardTitle>
                            <p className="text-xs text-gray-500">{line.nameEn}</p>
                          </div>
                        </div>
                        <StatusBadge status={status as 'normal' | 'delayed'} size="sm" />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Stats Row */}
                      <div className="grid grid-cols-3 gap-2">
                        <div className="p-2 rounded-lg bg-t-card/40 border border-t-border/20 text-center">
                          <MapPin className="h-3.5 w-3.5 mx-auto mb-1 text-gray-500" />
                          <p className="text-xs text-white font-bold">{stationCount}</p>
                          <p className="text-[10px] text-gray-500">محطة</p>
                        </div>
                        <div className="p-2 rounded-lg bg-t-card/40 border border-t-border/20 text-center">
                          <Train className="h-3.5 w-3.5 mx-auto mb-1 text-gray-500" />
                          <p className="text-xs text-white font-bold">{line.activeTrains}</p>
                          <p className="text-[10px] text-gray-500">قطار نشط</p>
                        </div>
                        <div className="p-2 rounded-lg bg-t-card/40 border border-t-border/20 text-center">
                          <Clock className="h-3.5 w-3.5 mx-auto mb-1 text-gray-500" />
                          <p className="text-xs text-white font-bold">{metrics.onTimeRate}%</p>
                          <p className="text-[10px] text-gray-500">في الوقت</p>
                        </div>
                      </div>

                      {/* Performance */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500 flex items-center gap-1">
                            {metrics.onTimeRate >= 95 ? (
                              <CheckCircle className="h-3 w-3 text-t-green" />
                            ) : (
                              <AlertTriangle className="h-3 w-3 text-t-yellow" />
                            )}
                            الأداء
                          </span>
                          <span className="text-white">{metrics.avgDelay} دقيقة تأخير متوسط</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-t-dark overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${metrics.onTimeRate}%`,
                              backgroundColor: line.colorHex,
                            }}
                          />
                        </div>
                      </div>

                      {/* Mini Line Diagram */}
                      <div className="relative flex items-center gap-0 pt-2">
                        {Array.from({ length: Math.min(stationCount, 8) }).map((_, i) => (
                          <div key={i} className="flex items-center flex-1">
                            <div className="flex flex-col items-center">
                              <div
                                className="w-2.5 h-2.5 rounded-full border-2"
                                style={{
                                  borderColor: line.colorHex,
                                  backgroundColor: i === 0 || i === Math.min(stationCount, 8) - 1 ? line.colorHex : 'transparent',
                                }}
                              />
                            </div>
                            {i < Math.min(stationCount, 8) - 1 && (
                              <div className="flex-1 h-0.5 -mx-0.5" style={{ backgroundColor: line.colorHex }} />
                            )}
                          </div>
                        ))}
                      </div>

                      {/* View Detail Link */}
                      <div className="flex items-center justify-end text-xs group-hover:text-white text-gray-500 transition-colors">
                        <span>عرض التفاصيل</span>
                        <ChevronLeft className="h-3.5 w-3.5 group-hover:translate-x-[-2px] transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </a>
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </div>
  )
}
