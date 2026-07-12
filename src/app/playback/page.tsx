'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { Play, Pause, Square, SkipForward, SkipBack, Clock, Train } from 'lucide-react'
import { motion } from 'framer-motion'
import PageHeader from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'

interface TrainPosition {
  id: string
  name: string
  code: string
  status: string
  line: { nameAr: string; colorHex: string }
  currentStation: { nameAr: string } | null
  lat: number
  lng: number
}

interface PlaybackFrame {
  timestamp: string
  trains: TrainPosition[]
}

export default function PlaybackPage() {
  const [allTrains, setAllTrains] = useState<TrainPosition[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedTime, setSelectedTime] = useState('08:00')
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [progress, setProgress] = useState(0)
  const [currentTrains, setCurrentTrains] = useState<TrainPosition[]>([])
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    fetchTrains()
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  async function fetchTrains() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/map/trains')
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setAllTrains(data)
      setCurrentTrains(data)
    } catch {
      setError('فشل في تحميل بيانات القطارات')
    } finally {
      setLoading(false)
    }
  }

  const generateFrame = useCallback((progressPercent: number): TrainPosition[] => {
    return allTrains.map(train => ({
      ...train,
      lat: train.lat + (Math.sin(progressPercent * 0.05) * 0.001),
      lng: train.lng + (Math.cos(progressPercent * 0.03) * 0.001),
    }))
  }, [allTrains])

  useEffect(() => {
    setCurrentTrains(generateFrame(progress))
  }, [progress, generateFrame])

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false)
            return 100
          }
          return prev + (0.5 * speed)
        })
      }, 50)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isPlaying, speed])

  function togglePlay() {
    if (progress >= 100) setProgress(0)
    setIsPlaying(!isPlaying)
  }

  function stopPlayback() {
    setIsPlaying(false)
    setProgress(0)
    setCurrentTrains(allTrains)
  }

  function skipForward() {
    setProgress(p => Math.min(100, p + 10))
  }

  function skipBackward() {
    setProgress(p => Math.max(0, p - 10))
  }

  const baseTime = new Date(`${selectedDate}T${selectedTime}:00`).getTime()
  const currentTime = new Date(baseTime + (progress / 100) * 12 * 3600 * 1000)
  const timeStr = currentTime.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

  return (
    <div className="space-y-6">
      <PageHeader
        title="إعادة التشغيل"
        description="عرض محاكي لحركة القطارات في وقت سابق"
        actions={
          <Button variant="outline" size="sm" onClick={fetchTrains}>تحديث البيانات</Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card className="p-4 space-y-4">
            <h3 className="text-sm font-medium text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-t-cyan" />
              اختيار الوقت
            </h3>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">التاريخ</label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">الوقت</label>
              <Input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
              />
            </div>
          </Card>

          <Card className="p-4 space-y-4">
            <h3 className="text-sm font-medium text-white">التحكم</h3>
            <div className="text-center">
              <p className="text-2xl font-bold text-t-cyan tabular-nums">{timeStr}</p>
              <p className="text-xs text-gray-400 mt-1">الوقت الحالي</p>
            </div>

            <div className="flex items-center justify-center gap-2">
              <Button variant="outline" size="icon" className="h-9 w-9" onClick={skipBackward}>
                <SkipForward className="h-4 w-4" />
              </Button>
              <Button
                variant={isPlaying ? 'secondary' : 'default'}
                size="icon"
                className="h-11 w-11 rounded-full"
                onClick={togglePlay}
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
              <Button variant="outline" size="icon" className="h-9 w-9" onClick={stopPlayback}>
                <Square className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-9 w-9" onClick={skipForward}>
                <SkipBack className="h-4 w-4" />
              </Button>
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-2 block">السرعة: {speed}x</label>
              <Select value={String(speed)} onValueChange={(v) => setSpeed(Number(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1x - عادي</SelectItem>
                  <SelectItem value="2">2x - سريع</SelectItem>
                  <SelectItem value="5">5x - سريع جداً</SelectItem>
                  <SelectItem value="10">10x - أقصى سرعة</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                <span>00:00</span>
                <span>{Math.round(progress)}%</span>
                <span>12:00</span>
              </div>
              <div className="h-2 bg-t-card rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-l from-t-cyan to-t-blue rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">القطارات النشطة</span>
              <span className="text-lg font-bold text-white">{currentTrains.length}</span>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card className="p-4 min-h-[500px]">
            {error ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
                <p className="text-t-red mb-3">{error}</p>
                <Button variant="outline" size="sm" onClick={fetchTrains}>إعادة المحاولة</Button>
              </div>
            ) : loading ? (
              <div className="space-y-3 p-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="relative">
                <h3 className="text-sm font-medium text-gray-400 mb-4">شبكة القطارات - {selectedDate}</h3>

                <div className="relative bg-t-panel/50 rounded-xl p-6 min-h-[400px] overflow-hidden border border-t-border/30">
                  <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-t-border" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>

                  <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {currentTrains.map((train, idx) => (
                      <motion.div
                        key={train.id}
                        animate={{
                          x: [0, Math.sin(progress * 0.05 + idx) * 3, 0],
                          y: [0, Math.cos(progress * 0.03 + idx) * 3, 0],
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        className="flex items-center gap-3 bg-t-card/80 border border-t-border/40 rounded-lg p-3"
                      >
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${train.line.colorHex}20`, border: `1px solid ${train.line.colorHex}40` }}
                        >
                          <Train className="h-4 w-4" style={{ color: train.line.colorHex }} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-white truncate">{train.name}</p>
                          <p className="text-[10px] text-gray-500 truncate">
                            {train.currentStation?.nameAr ?? 'بين المحطات'}
                          </p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <span
                              className="inline-block w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: train.status === 'ACTIVE' ? '#22c55e' : '#f59e0b' }}
                            />
                            <span className="text-[9px] text-gray-500">
                              {train.status === 'ACTIVE' ? 'نشط' : 'متأخر'}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    {currentTrains.length === 0 && (
                      <div className="col-span-full text-center text-gray-500 py-12">
                        لا توجد قارات نشطة
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
