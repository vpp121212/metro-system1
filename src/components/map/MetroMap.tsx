'use client'

import { useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { LINES, LINE_COLORS, getLineGeoJSON, generateTrains, generateAlerts } from '@/lib/metro-data'

export interface MetroMapHandle {
  flyTo: (lng: number, lat: number, zoom?: number) => void
  setFilter: (lineId: string | null) => void
  setShowAlerts: (v: boolean) => void
}

const MAP_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  name: 'TrainEye Dark',
  sources: {
    'osm-tiles': {
      type: 'raster',
      tiles: [
        'https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      ],
      tileSize: 256,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
    },
  },
  layers: [
    {
      id: 'osm-tiles',
      type: 'raster',
      source: 'osm-tiles',
      minzoom: 0,
      maxzoom: 20,
    },
  ],
}

function createTrainIconData(color: string): ImageData {
  if (typeof document === 'undefined') return { width: 20, height: 20, data: new Uint8ClampedArray(80) } as ImageData
  const c = document.createElement('canvas')
  c.width = 20; c.height = 20
  const ctx = c.getContext('2d')!
  ctx.beginPath(); ctx.arc(10, 10, 6, 0, Math.PI * 2)
  ctx.fillStyle = color; ctx.fill()
  ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 1.5; ctx.stroke()
  ctx.beginPath(); ctx.arc(10, 10, 2, 0, Math.PI * 2)
  ctx.fillStyle = 'white'; ctx.fill()
  return ctx.getImageData(0, 0, 20, 20)
}

function createAlertIconData(color: string): ImageData {
  if (typeof document === 'undefined') return { width: 24, height: 24, data: new Uint8ClampedArray(96) } as ImageData
  const c = document.createElement('canvas')
  c.width = 24; c.height = 24
  const ctx = c.getContext('2d')!
  ctx.beginPath(); ctx.moveTo(12, 2); ctx.lineTo(22, 22); ctx.lineTo(2, 22); ctx.closePath()
  ctx.fillStyle = color; ctx.fill()
  ctx.strokeStyle = 'white'; ctx.lineWidth = 1; ctx.stroke()
  ctx.fillStyle = 'white'
  ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  ctx.fillText('!', 12, 13)
  return ctx.getImageData(0, 0, 24, 24)
}

function createStationIconData(color: string, isInterchange: boolean): ImageData {
  if (typeof document === 'undefined') return { width: 16, height: 16, data: new Uint8ClampedArray(64) } as ImageData
  const c = document.createElement('canvas')
  c.width = 16; c.height = 16
  const ctx = c.getContext('2d')!
  const r = isInterchange ? 7 : 4
  ctx.beginPath(); ctx.arc(8, 8, r, 0, Math.PI * 2)
  ctx.fillStyle = '#060b18'; ctx.fill()
  ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke()
  if (isInterchange) {
    ctx.beginPath(); ctx.arc(8, 8, 2, 0, Math.PI * 2)
    ctx.fillStyle = color; ctx.fill()
  }
  return ctx.getImageData(0, 0, 16, 16)
}

function interpolateAlongLine(line: GeoJSON.LineString, t: number): [number, number] {
  const coords = line.coordinates as [number, number][]
  if (coords.length < 2) return coords[0] || [0, 0]
  const totalLen = coords.length - 1
  const idx = Math.floor(t * totalLen)
  const frac = (t * totalLen) - idx
  const i = Math.min(idx, totalLen - 1)
  const [lng0, lat0] = coords[i]
  const [lng1, lat1] = coords[i + 1]
  return [lng0 + (lng1 - lng0) * frac, lat0 + (lat1 - lat0) * frac]
}

function bearingAlongLine(line: GeoJSON.LineString, t: number): number {
  const coords = line.coordinates as [number, number][]
  if (coords.length < 2) return 0
  const totalLen = coords.length - 1
  const idx = Math.min(Math.floor(t * totalLen), totalLen - 1)
  const [lng0, lat0] = coords[idx]
  const [lng1, lat1] = coords[idx + 1]
  return Math.atan2(lng1 - lng0, lat1 - lat0) * (180 / Math.PI)
}

interface MetroMapProps {
  activeFilter: string | null
  showAlerts: boolean
  onStationClick?: (station: any) => void
  onTrainClick?: (train: any) => void
}

const MetroMap = forwardRef<MetroMapHandle, MetroMapProps>(({
  activeFilter,
  showAlerts,
  onStationClick,
  onTrainClick,
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const popupRef = useRef<maplibregl.Popup | null>(null)
  const animFrameRef = useRef<number>(0)
  const lineGeoJSON = useRef<ReturnType<typeof getLineGeoJSON>[]>([])
  const filterRef = useRef<string | null>(activeFilter)
  const alertsRef = useRef<boolean>(showAlerts)

  filterRef.current = activeFilter
  alertsRef.current = showAlerts

  useImperativeHandle(ref, () => ({
    flyTo(lng, lat, zoom = 14) {
      mapRef.current?.flyTo({ center: [lng, lat], zoom, duration: 800 })
    },
    setFilter(lineId) {
      filterRef.current = lineId
      updateLayerVisibility(lineId)
    },
    setShowAlerts(v) {
      alertsRef.current = v
      toggleLayer('alerts-points', v)
      toggleLayer('alerts-labels', v)
    },
  }))

  function toggleLayer(id: string, show: boolean) {
    const map = mapRef.current
    if (!map) return
    const vis = show ? 'visible' : 'none'
    if (map.getLayer(id)) map.setLayoutProperty(id, 'visibility', vis)
  }

  function updateLayerVisibility(lineId: string | null) {
    const map = mapRef.current
    if (!map) return
    for (const ln of LINES) {
      const show = !lineId || lineId === ln.id
      toggleLayer(`line-glow-${ln.id}`, show)
      toggleLayer(`line-${ln.id}`, show)
    }
  }

  const animateTrains = useCallback(() => {
    const map = mapRef.current
    if (!map || !map.isStyleLoaded()) {
      animFrameRef.current = requestAnimationFrame(animateTrains)
      return
    }
    const fc = generateTrains()
    const src = map.getSource('trains') as maplibregl.GeoJSONSource
    if (src) {
      const filtered: GeoJSON.FeatureCollection<GeoJSON.Point> = {
        type: 'FeatureCollection',
        features: fc.features.filter(f => {
          return !filterRef.current || f.properties?.line === filterRef.current
        }),
      }
      src.setData(filtered)
    }
    animFrameRef.current = requestAnimationFrame(animateTrains)
  }, [])

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center: [46.71, 24.71],
      zoom: 11,
      minZoom: 9,
      maxZoom: 17,
      attributionControl: false,
      dragRotate: true,
      touchZoomRotate: true,
    })

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right')
    mapRef.current = map

    map.on('load', () => {
      lineGeoJSON.current = LINES.map(getLineGeoJSON)

      // Line sources and layers
      for (const line of LINES) {
        const gj = getLineGeoJSON(line)
        const id = line.id
        const color = LINE_COLORS[line.color].hex

        map.addSource(`line-${id}`, {
          type: 'geojson',
          data: gj,
        })

        // Glow layer
        map.addLayer({
          id: `line-glow-${id}`,
          type: 'line',
          source: `line-${id}`,
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': color,
            'line-width': 8,
            'line-opacity': 0.15,
            'line-blur': 4,
          },
        })

        // Main line
        map.addLayer({
          id: `line-${id}`,
          type: 'line',
          source: `line-${id}`,
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': color,
            'line-width': 3,
            'line-opacity': 0.85,
          },
        })

        // Stations for this line
        const stationsFC: GeoJSON.FeatureCollection<GeoJSON.Point> = {
          type: 'FeatureCollection',
          features: line.stations.map(s => ({
            type: 'Feature',
            properties: {
              id: s.id,
              nameAr: s.nameAr,
              nameEn: s.nameEn,
              line: id,
              lineColor: color,
              isInterchange: s.isInterchange,
              order: s.order,
            },
            geometry: { type: 'Point', coordinates: [s.lng, s.lat] },
          })),
        }

        map.addSource(`stations-${id}`, {
          type: 'geojson',
          data: stationsFC,
        })

        // Add custom station images
        const imgId = `station-${id}`
        const imgInterId = `station-inter-${id}`
        if (!map.hasImage(imgId)) map.addImage(imgId, createStationIconData(color, false))
        if (!map.hasImage(imgInterId)) map.addImage(imgInterId, createStationIconData(color, true))

        map.addLayer({
          id: `stations-${id}`,
          type: 'symbol',
          source: `stations-${id}`,
          layout: {
            'icon-image': ['case', ['get', 'isInterchange'], imgInterId, imgId],
            'icon-size': 1,
            'icon-allow-overlap': true,
            'icon-ignore-placement': true,
          },
        })
      }

      // Interchange stations combined source
      const interchangedStations: GeoJSON.FeatureCollection<GeoJSON.Point> = {
        type: 'FeatureCollection',
        features: LINES.flatMap(line =>
          line.stations.filter(s => s.isInterchange).map(s => ({
            type: 'Feature',
            properties: {
              id: s.id,
              nameAr: s.nameAr,
              nameEn: s.nameEn,
              lines: LINES.filter(l => l.stations.some(st => st.lat === s.lat && st.lng === s.lng)).map(l => l.id),
              lineColors: LINES.filter(l => l.stations.some(st => st.lat === s.lat && st.lng === s.lng)).map(l => LINE_COLORS[l.color].hex),
            },
            geometry: { type: 'Point', coordinates: [s.lng, s.lat] },
          }))
        ),
      }

      map.addSource('interchanges', {
        type: 'geojson',
        data: interchangedStations,
      })

      map.addLayer({
        id: 'interchanges-ring',
        type: 'circle',
        source: 'interchanges',
        paint: {
          'circle-radius': 10,
          'circle-color': '#060b18',
          'circle-stroke-color': '#06b6d4',
          'circle-stroke-width': 2,
          'circle-opacity': 0.9,
        },
      })

      // Train source
      map.addSource('trains', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
      })

      // Add train images for each line
      for (const line of LINES) {
        const color = LINE_COLORS[line.color].hex
        const imgId = `train-${line.id}`
        if (!map.hasImage(imgId)) map.addImage(imgId, createTrainIconData(color))
      }

      // Wait a tick for images to load
      // Train layer
      if (!map.getLayer('trains-layer')) {
        map.addLayer({
          id: 'trains-layer',
          type: 'symbol',
          source: 'trains',
          layout: {
            'icon-image': ['concat', 'train-', ['get', 'line']],
            'icon-size': 1.2,
            'icon-rotate': ['get', 'bearing'],
            'icon-rotation-alignment': 'map',
            'icon-allow-overlap': true,
            'icon-ignore-placement': true,
            'text-field': ['get', 'name'],
            'text-offset': [0, -1.5],
            'text-size': 8,
            'text-anchor': 'bottom',
          },
          paint: {
            'text-color': '#ffffff',
            'text-halo-color': '#000000',
            'text-halo-width': 1.5,
          },
        })
      }

      // Train pulse layer
      map.addLayer({
        id: 'trains-pulse',
        type: 'circle',
        source: 'trains',
        paint: {
          'circle-radius': 14,
          'circle-color': ['get', 'lineColor'],
          'circle-opacity': 0.12,
        },
      })

      // Alerts source & layers
      map.addSource('alerts', {
        type: 'geojson',
        data: generateAlerts(),
      })

      // Add alert images
      for (const t of ['CRITICAL', 'WARNING', 'INFO']) {
        const c = t === 'CRITICAL' ? '#ef4444' : t === 'WARNING' ? '#f97316' : '#3b82f6'
        if (!map.hasImage(`alert-${t}`)) map.addImage(`alert-${t}`, createAlertIconData(c))
      }

      map.addLayer({
        id: 'alerts-points',
        type: 'symbol',
        source: 'alerts',
        layout: {
          'icon-image': ['concat', 'alert-', ['get', 'type']],
          'icon-size': 1,
          'icon-allow-overlap': true,
          'icon-ignore-placement': true,
        },
      })

      map.addLayer({
        id: 'alerts-labels',
        type: 'symbol',
        source: 'alerts',
        layout: {
          'text-field': ['get', 'title'],
          'text-offset': [0, 1.5],
          'text-size': 8,
          'text-anchor': 'top',
          'text-optional': true,
        },
        paint: {
          'text-color': '#fbbf24',
          'text-halo-color': '#000000',
          'text-halo-width': 1,
        },
      })

      // Hover interactions
      for (const line of LINES) {
        map.on('mouseenter', `stations-${line.id}`, () => {
          map.getCanvas().style.cursor = 'pointer'
        })
        map.on('mouseleave', `stations-${line.id}`, () => {
          map.getCanvas().style.cursor = ''
        })

        map.on('click', `stations-${line.id}`, (e) => {
          if (!e.features?.[0]) return
          const props = e.features[0].properties
          onStationClick?.(props)
        })
      }

      map.on('mouseenter', 'trains-layer', () => {
        map.getCanvas().style.cursor = 'pointer'
      })
      map.on('mouseleave', 'trains-layer', () => {
        map.getCanvas().style.cursor = ''
      })

      map.on('click', 'trains-layer', (e) => {
        if (!e.features?.[0]) return
        const props = e.features[0].properties
        onTrainClick?.(props)
      })

      // Start animation
      animFrameRef.current = requestAnimationFrame(animateTrains)
    })

    return () => {
      cancelAnimationFrame(animFrameRef.current)
      map.remove()
      mapRef.current = null
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: '#060b18' }}
    />
  )
})

MetroMap.displayName = 'MetroMap'
export default MetroMap
