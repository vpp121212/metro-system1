'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MapPin,
  Train as TrainIcon,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  X,
  Filter,
  ChevronLeft,
  Users,
  ArrowRight,
} from 'lucide-react'
import PageHeader from '@/components/layout/PageHeader'
import StatusBadge from '@/components/layout/StatusBadge'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Station {
  id: string
  nameEn: string
  nameAr: string
  lat: number
  lng: number
  order: number
  isInterchange: boolean
}

interface LineData {
  id: string
  nameAr: string
  nameEn: string
  color: string
  colorHex: string
  order: number
  stations: Station[]
}

interface TrainPosition {
  id: string
  name: string
  code: string
  status: string
  speed: number
  direction: string
  passengerCount: number
  capacity: number
  lat: number
  lng: number
  currentStation: { id: string; nameEn: string; nameAr: string; lat: number; lng: number } | null
  line: { id: string; nameEn: string; nameAr: string; color: string; colorHex: string }
}

interface SelectedItem {
  type: 'station' | 'train'
  data: Station | TrainPosition
}

const LINE_FILTERS = [
  { id: 'all', labelAr: 'الكل', color: '#06b6d4' },
  { id: 'blue', labelAr: 'الأزرق', color: '#2563eb' },
  { id: 'red', labelAr: 'الأحمر', color: '#ef4444' },
  { id: 'orange', labelAr: 'البرتقالي', color: '#f97316' },
  { id: 'yellow', labelAr: 'الأصفر', color: '#eab308' },
  { id: 'green', labelAr: 'الأخضر', color: '#22c55e' },
  { id: 'purple', labelAr: 'البنفسجي', color: '#9333ea' },
]

const MAP_CENTER = { lat: 24.71, lng: 46.71 }
const MAP_BOUNDS = { minLat: 24.55, maxLat: 24.87, minLng: 46.55, maxLng: 46.87 }

function latLngToPixel(lat: number, lng: number, width: number, height: number) {
  const x = ((lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)) * width
  const y = ((MAP_BOUNDS.maxLat - lat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * height
  return { x, y }
}

export default function MapPage() {
  const [lines, setLines] = useState<LineData[]>([])
  const [trains, setTrains] = useState<TrainPosition[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('all')
  const [selected, setSelected] = useState<SelectedItem | null>(null)
  const [zoom, setZoom] = useState(1)
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })

  useEffect(() => {
    async function fetchMapData() {
      try {
        const [linesRes, trainsRes] = await Promise.all([
          fetch('/api/map/lines'),
          fetch('/api/map/trains'),
        ])
        if (linesRes.ok) setLines(await linesRes.json())
        if (trainsRes.ok) setTrains(await trainsRes.json())
      } catch {
        // handle error silently
      } finally {
        setLoading(false)
      }
    }
    fetchMapData()
  }, [])

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        })
      }
    }
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  const filteredLines = activeFilter === 'all'
    ? lines
    : lines.filter((l) => l.color === activeFilter)

  const filteredTrains = activeFilter === 'all'
    ? trains
    : trains.filter((t) => t.line.color === activeFilter)

  const w = dimensions.width * zoom
  const h = dimensions.height * zoom

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.3, 3))
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.3, 0.5))
  const handleReset = () => { setZoom(1); setSelected(null) }

  const renderLinePath = useCallback((stationList: Station[]) => {
    if (stationList.length < 2) return ''
    const points = stationList
      .sort((a, b) => a.order - b.order)
      .map((s) => latLngToPixel(s.lat, s.lng, w, h))
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  }, [w, h])

  return (
    <div className="space-y-4 h-full flex flex-col">
      <PageHeader
        title="الخريطة المباشرة"
        description="تتبع مباشر لمواقع القطارات والمحطات"
      />

      <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0">
        {/* Map Area */}
        <div className="flex-1 relative rounded-xl overflow-hidden border border-t-border/40 bg-t-panel/60 backdrop-blur-md">
          {/* Line Filters */}
          <div className="absolute top-3 right-3 z-20 flex flex-wrap gap-1.5">
            {LINE_FILTERS.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                  activeFilter === filter.id
                    ? 'bg-white/15 text-white border border-white/30 shadow-lg'
                    : 'bg-t-card/80 text-gray-400 border border-t-border/40 hover:text-white hover:bg-t-card'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: filter.color }}
                />
                {filter.labelAr}
              </button>
            ))}
          </div>

          {/* Zoom Controls */}
          <div className="absolute bottom-3 right-3 z-20 flex flex-col gap-1.5">
            <button
              onClick={handleZoomIn}
              className="w-9 h-9 rounded-lg bg-t-card/90 border border-t-border/40 flex items-center justify-center text-gray-400 hover:text-white hover:bg-t-card transition-colors"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="w-9 h-9 rounded-lg bg-t-card/90 border border-t-border/40 flex items-center justify-center text-gray-400 hover:text-white hover:bg-t-card transition-colors"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <button
              onClick={handleReset}
              className="w-9 h-9 rounded-lg bg-t-card/90 border border-t-border/40 flex items-center justify-center text-gray-400 hover:text-white hover:bg-t-card transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

          {/* SVG Map */}
          <div ref={containerRef} className="w-full h-full min-h-[500px]">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Skeleton className="w-full h-full rounded-none" />
              </div>
            ) : (
              <svg
                ref={svgRef}
                width={dimensions.width}
                height={dimensions.height}
                viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
                className="w-full h-full"
              >
                {/* Grid Lines */}
                {Array.from({ length: 8 }).map((_, i) => {
                  const y = (dimensions.height / 7) * i
                  return <line key={`hg-${i}`} x1={0} y1={y} x2={dimensions.width} y2={y} stroke="#1e2a42" strokeWidth={0.5} strokeDasharray="4 8" />
                })}
                {Array.from({ length: 10 }).map((_, i) => {
                  const x = (dimensions.width / 9) * i
                  return <line key={`vg-${i}`} x1={x} y1={0} x2={x} y2={dimensions.height} stroke="#1e2a42" strokeWidth={0.5} strokeDasharray="4 8" />
                })}

                {/* Metro Lines */}
                {filteredLines.map((line) => {
                  const path = renderLinePath(line.stations)
                  return (
                    <g key={line.id}>
                      <path
                        d={path}
                        fill="none"
                        stroke={line.colorHex}
                        strokeWidth={3}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity={0.3}
                      />
                      <path
                        d={path}
                        fill="none"
                        stroke={line.colorHex}
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity={0.8}
                      />
                    </g>
                  )
                })}

                {/* Station Markers */}
                {filteredLines.map((line) =>
                  line.stations.map((station) => {
                    const pos = latLngToPixel(station.lat, station.lng, w, h)
                    const isSelected = selected?.type === 'station' && selected.data.id === station.id
                    const radius = station.isInterchange ? 7 : 4.5
                    return (
                      <g
                        key={station.id}
                        className="cursor-pointer"
                        onClick={() => setSelected({ type: 'station', data: station })}
                      >
                        {station.isInterchange && (
                          <circle
                            cx={pos.x}
                            cy={pos.y}
                            r={radius + 3}
                            fill="none"
                            stroke={line.colorHex}
                            strokeWidth={1.5}
                            opacity={0.4}
                          />
                        )}
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r={isSelected ? radius + 2 : radius}
                          fill={isSelected ? line.colorHex : '#060b18'}
                          stroke={line.colorHex}
                          strokeWidth={isSelected ? 2.5 : 1.5}
                        />
                        {station.isInterchange && (
                          <circle
                            cx={pos.x}
                            cy={pos.y}
                            r={2}
                            fill={line.colorHex}
                          />
                        )}
                      </g>
                    )
                  })
                )}

                {/* Train Markers */}
                {filteredTrains.map((train) => {
                  const pos = latLngToPixel(train.lat, train.lng, w, h)
                  const isSelected = selected?.type === 'train' && selected.data.id === train.id
                  return (
                    <g
                      key={train.id}
                      className="cursor-pointer"
                      onClick={() => setSelected({ type: 'train', data: train })}
                    >
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={isSelected ? 10 : 7}
                        fill={train.line.colorHex}
                        opacity={0.2}
                      >
                        <animate
                          attributeName="r"
                          values={isSelected ? '10;14;10' : '7;10;7'}
                          dur="2s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          values="0.3;0.1;0.3"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                      </circle>
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={isSelected ? 6 : 4.5}
                        fill={train.line.colorHex}
                        stroke="#060b18"
                        strokeWidth={2}
                      />
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={1.5}
                        fill="white"
                      />
                    </g>
                  )
                })}
              </svg>
            )}
          </div>
        </div>

        {/* Info Panel Sidebar */}
        <AnimatePresence mode="wait">
          {selected && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-full lg:w-80 shrink-0"
            >
              <Card className="bg-t-panel/60 backdrop-blur-md border-t-border/40 h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base text-white">
                    {selected.type === 'station' ? 'تفاصيل المحطة' : 'تفاصيل القطار'}
                  </CardTitle>
                  <button
                    onClick={() => setSelected(null)}
                    className="w-7 h-7 rounded-md bg-t-card/60 flex items-center justify-center text-gray-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selected.type === 'station' && (
                    <>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: filteredLines.find(l => l.stations.some(s => s.id === selected.data.id))?.colorHex || '#06b6d4' }}
                          />
                          <h3 className="text-lg font-bold text-white">{(selected.data as Station).nameAr}</h3>
                        </div>
                        <p className="text-sm text-gray-400">{(selected.data as Station).nameEn}</p>
                        {(selected.data as Station).isInterchange && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-t-purple/15 text-t-purple border border-t-purple/25">
                            محطة تحويل
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg bg-t-card/40 border border-t-border/30">
                          <p className="text-xs text-gray-500">الإحداثيات</p>
                          <p className="text-sm text-white mt-1">{(selected.data as Station).lat.toFixed(4)}, {(selected.data as Station).lng.toFixed(4)}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-t-card/40 border border-t-border/30">
                          <p className="text-xs text-gray-500">الترتيب</p>
                          <p className="text-sm text-white mt-1">#{(selected.data as Station).order}</p>
                        </div>
                      </div>
                      <a
                        href={`/stations/${selected.data.id}`}
                        className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-t-cyan/15 text-t-cyan text-sm font-medium hover:bg-t-cyan/25 transition-colors"
                      >
                        <span>عرض التفاصيل</span>
                        <ChevronLeft className="h-4 w-4" />
                      </a>
                    </>
                  )}

                  {selected.type === 'train' && (
                    <>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <TrainIcon className="h-5 w-5" style={{ color: (selected.data as TrainPosition).line.colorHex }} />
                          <h3 className="text-lg font-bold text-white">{(selected.data as TrainPosition).name}</h3>
                        </div>
                        <p className="text-sm text-gray-400">كود: {(selected.data as TrainPosition).code}</p>
                        <StatusBadge
                          status={(selected.data as TrainPosition).status === 'ACTIVE' ? 'active' : 'delayed'}
                          size="md"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 rounded-lg bg-t-card/40">
                          <span className="text-xs text-gray-500">الخط</span>
                          <span className="text-sm text-white flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: (selected.data as TrainPosition).line.colorHex }} />
                            {(selected.data as TrainPosition).line.nameAr}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-lg bg-t-card/40">
                          <span className="text-xs text-gray-500">السرعة</span>
                          <span className="text-sm text-white">{(selected.data as TrainPosition).speed} كم/س</span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-lg bg-t-card/40">
                          <span className="text-xs text-gray-500">الاتجاه</span>
                          <span className="text-sm text-white">{(selected.data as TrainPosition).direction === 'FORWARD' ? 'مقدم' : 'رجعي'}</span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-lg bg-t-card/40">
                          <span className="text-xs text-gray-500">الركاب</span>
                          <span className="text-sm text-white flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" />
                            {(selected.data as TrainPosition).passengerCount}/{(selected.data as TrainPosition).capacity}
                          </span>
                        </div>
                        {(selected.data as TrainPosition).currentStation && (
                          <div className="flex items-center justify-between p-2 rounded-lg bg-t-card/40">
                            <span className="text-xs text-gray-500">المحطة الحالية</span>
                            <span className="text-sm text-white">{(selected.data as TrainPosition).currentStation!.nameAr}</span>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state when no selection */}
        {!selected && !loading && (
          <div className="hidden lg:flex w-80 shrink-0 items-center justify-center">
            <Card className="bg-t-panel/60 backdrop-blur-md border-t-border/40 w-full">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <MapPin className="h-10 w-10 text-gray-600 mb-3" />
                <p className="text-sm text-gray-500">اختر محطة أو قطار لعرض التفاصيل</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
