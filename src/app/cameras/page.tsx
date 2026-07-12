'use client'

import { useState, useEffect } from 'react'
import { Camera, Filter, Search, Wifi, WifiOff, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import PageHeader from '@/components/layout/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface CameraData {
  id: string
  name: string
  status: string
  station: {
    id: string
    nameAr: string
    nameEn: string
    line: { id: string; nameEn: string; colorHex: string }
  }
}

export default function CamerasPage() {
  const [cameras, setCameras] = useState<CameraData[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [selectedCamera, setSelectedCamera] = useState<CameraData | null>(null)

  useEffect(() => { fetchCameras(); const i = setInterval(fetchCameras, 10000); return () => clearInterval(i) }, [])

  async function fetchCameras() {
    try {
      const res = await fetch('/api/cameras')
      if (res.ok) setCameras(await res.json())
    } catch {} finally { setLoading(false) }
  }

  const filtered = cameras.filter(c => {
    if (filterStatus !== 'ALL' && c.status !== filterStatus) return false
    if (search && !c.name.toLowerCase().includes(search) && !c.station.nameAr.includes(search)) return false
    return true
  })

  return (
    <div className="space-y-6">
      <PageHeader title="الكاميرات" description="مراقبة بث مباشر من كاميرات المحطات" />

      <div className="flex gap-3 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث..." className="pr-10" />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[160px]"><Filter className="h-4 w-4 ml-2" /><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">الكل</SelectItem>
            <SelectItem value="ACTIVE">نشط</SelectItem>
            <SelectItem value="INACTIVE">متوقف</SelectItem>
            <SelectItem value="MAINTENANCE">صيانة</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-t-cyan" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((camera, i) => (
            <motion.div key={camera.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <Card
                className={`cursor-pointer transition-all hover:border-white/30 ${selectedCamera?.id === camera.id ? 'border-t-cyan/50 ring-1 ring-t-cyan/30' : ''}`}
                onClick={() => setSelectedCamera(camera)}
              >
                <CardContent className="p-4 space-y-3">
                  <div className="relative aspect-video rounded-lg bg-gradient-to-br from-[#0f0f1a] to-[#1a1a2e] border border-white/5 overflow-hidden flex items-center justify-center">
                    {camera.status === 'ACTIVE' ? (
                      <>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Camera className="h-10 w-10 text-t-cyan/30" />
                          </div>
                          <div className="absolute bottom-2 left-2">
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-t-green/15 text-t-green border border-t-green/25">
                              <Wifi className="h-3 w-3" /> LIVE
                            </span>
                          </div>
                        </div>
                        <div className="absolute inset-0">
                          {[...Array(4)].map((_, j) => (
                            <div
                              key={j}
                              className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-t-cyan/10 to-transparent"
                              style={{ top: `${25 * (j + 1)}%`, animation: `scan 3s ${j * 0.5}s infinite linear` }}
                            />
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-gray-500">
                        <WifiOff className="h-8 w-8" />
                        <span className="text-[10px]">الكاميرا غير متصلة</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">{camera.name}</p>
                      <p className="text-xs text-gray-500">{camera.station.nameAr}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${camera.status === 'ACTIVE' ? 'bg-t-green/15 text-t-green border border-t-green/25' : 'bg-t-red/15 text-t-red border border-t-red/25'}`}>
                      {camera.status === 'ACTIVE' ? 'نشط' : 'متوقف'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
