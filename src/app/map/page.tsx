'use client'

import { useState, useRef, useCallback } from 'react'
import MetroMap, { type MetroMapHandle } from '@/components/map/MetroMap'
import SidePanel from '@/components/map/SidePanel'
import BottomPanel from '@/components/map/BottomPanel'
import AIPanel from '@/components/map/AIPanel'
import PlaybackBar from '@/components/map/PlaybackBar'
import TickerBar from '@/components/map/TickerBar'
import StationPopup from '@/components/map/StationPopup'
import TrainPopup from '@/components/map/TrainPopup'
import { LINES, LINE_COLORS } from '@/lib/metro-data'

const totalStations = LINES.reduce((sum, l) => sum + l.stations.length, 0)

export default function CommandCenterPage() {
  const mapRef = useRef<MetroMapHandle>(null)
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [showAlerts] = useState(true)
  const [selectedStation, setSelectedStation] = useState<any>(null)
  const [selectedTrain, setSelectedTrain] = useState<any>(null)
  const [bottomOpen, setBottomOpen] = useState(false)
  const [aiOpen, setAiOpen] = useState(false)
  const [stats] = useState({
    trains: 27,
    stations: totalStations,
    alerts: 12,
  })

  // Simulated train list for bottom panel
  const [trains] = useState(() =>
    LINES.flatMap(line =>
      Array.from({ length: line.id === 'YELLOW' ? 3 : line.id === 'GREEN' ? 4 : line.id === 'PURPLE' ? 4 : 6 }, (_, i) => ({
        id: `${line.id}-${String(i + 1).padStart(3, '0')}`,
        name: `${line.id.charAt(0)}-${String(i + 1).padStart(3, '0')}`,
        line: line.nameAr,
        lineColor: LINE_COLORS[line.color].hex,
        speed: Math.round(40 + Math.random() * 50),
        direction: i % 2 === 0 ? 'forward' : 'reverse',
        passengerCount: Math.round(Math.random() * 800 + 50),
        capacity: 1000,
        status: i === 0 ? 'MAINTENANCE' : 'ACTIVE',
      }))
    )
  )

  const handleSearch = useCallback((query: string) => {
    if (!query.trim() || !mapRef.current) return
    const q = query.toLowerCase()
    for (const line of LINES) {
      for (const station of line.stations) {
        if (station.nameAr.includes(q) || station.nameEn.toLowerCase().includes(q)) {
          mapRef.current.flyTo(station.lng, station.lat, 15)
          return
        }
      }
    }
  }, [])

  const handleFilterChange = useCallback((id: string | null) => {
    setActiveFilter(id)
    mapRef.current?.setFilter(id)
  }, [])

  const handleStationClick = useCallback((props: any) => {
    const id = props?.id || ''
    const line = LINES.find(l => l.stations.some(s => s.id === id))
    const station = line?.stations.find(s => s.id === id)
    if (station && mapRef.current) {
      setSelectedStation({
        id: station.id,
        nameAr: station.nameAr,
        nameEn: station.nameEn,
        line: line?.id,
        lineColor: line ? LINE_COLORS[line.color].hex : undefined,
        isInterchange: station.isInterchange,
        order: station.order,
        lines: props?.lines,
        lineColors: props?.lineColors,
      })
      setSelectedTrain(null)
      mapRef.current.flyTo(station.lng, station.lat, 15)
    }
  }, [])

  const handleTrainClick = useCallback((props: any) => {
    if (props) {
      setSelectedTrain({
        id: props.id,
        name: props.name,
        line: props.line,
        lineColor: props.lineColor,
        speed: props.speed,
        direction: props.direction,
        passengerCount: props.passengerCount,
        capacity: props.capacity,
        status: props.status,
      })
      setSelectedStation(null)
    }
  }, [])

  const handleTrainSelectFromPanel = useCallback((id: string) => {
    setBottomOpen(true)
    const train = trains.find(t => t.id === id)
    if (train) {
      setSelectedTrain(train)
      setSelectedStation(null)
    }
  }, [trains])

  return (
    <div className="relative w-full h-full bg-[#060b18] overflow-hidden" dir="ltr">
      {/* Map Layer */}
      <MetroMap
        ref={mapRef}
        activeFilter={activeFilter}
        showAlerts={showAlerts}
        onStationClick={handleStationClick}
        onTrainClick={handleTrainClick}
      />

      {/* Alerts Ticker */}
      <div className="absolute top-0 left-0 right-0 z-30 pointer-events-none">
        <div className="pointer-events-auto">
          <TickerBar />
        </div>
      </div>

      {/* Side Panel */}
      <SidePanel
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        stats={stats}
      />

      {/* AI Panel */}
      <AIPanel
        open={aiOpen}
        onToggle={() => setAiOpen(!aiOpen)}
      />

      {/* Station Popup */}
      <StationPopup
        station={selectedStation}
        onClose={() => setSelectedStation(null)}
      />

      {/* Train Popup */}
      <TrainPopup
        train={selectedTrain}
        onClose={() => setSelectedTrain(null)}
      />

      {/* Bottom Panel */}
      <BottomPanel
        trains={trains}
        open={bottomOpen}
        onToggle={() => setBottomOpen(!bottomOpen)}
        onTrainSelect={handleTrainSelectFromPanel}
      />

      {/* Playback Timeline */}
      <PlaybackBar />

      {/* Scan Line Effect */}
      <div className="absolute inset-0 pointer-events-none z-10 opacity-[0.03]">
        <div
          className="w-full h-1 bg-gradient-to-r from-transparent via-t-cyan to-transparent animate-scan"
          style={{ animation: 'scan 4s linear infinite' }}
        />
      </div>
    </div>
  )
}


