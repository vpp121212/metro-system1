'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play, Pause, SkipBack, SkipForward, Clock,
} from 'lucide-react'

interface PlaybackBarProps {
  onTimeChange?: (time: number) => void
}

export default function PlaybackBar({ onTimeChange }: PlaybackBarProps) {
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [expanded, setExpanded] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval>>()

  const togglePlay = () => {
    if (playing) {
      clearInterval(intervalRef.current)
    } else {
      intervalRef.current = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(intervalRef.current)
            setPlaying(false)
            return 0
          }
          const next = p + 1
          onTimeChange?.(next)
          return next
        })
      }, 200)
    }
    setPlaying(!playing)
  }

  return (
    <button
      onClick={() => setExpanded(!expanded)}
      className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 pointer-events-auto"
    >
      <div
        className={`glass rounded-2xl transition-all duration-200 ${
          expanded ? 'px-4 py-2 w-80' : 'px-3 py-1.5'
        }`}
      >
        {expanded ? (
          <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => { setProgress(0); onTimeChange?.(0) }}
              className="text-gray-500 hover:text-white transition-colors"
            >
              <SkipBack className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={togglePlay}
              className="w-7 h-7 rounded-full bg-t-cyan/20 flex items-center justify-center text-t-cyan hover:bg-t-cyan/30 transition-colors"
            >
              {playing ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3 mr-0.5" />}
            </button>
            <button
              onClick={() => { setProgress(100); onTimeChange?.(100) }}
              className="text-gray-500 hover:text-white transition-colors"
            >
              <SkipForward className="h-3.5 w-3.5" />
            </button>
            <div className="flex-1 h-1 rounded-full bg-t-card cursor-pointer relative">
              <div
                className="h-full rounded-full bg-gradient-to-r from-t-cyan to-t-blue transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[9px] text-gray-500 font-mono w-12 text-left" dir="ltr">
              06:00
            </span>
            <Clock className="h-3 w-3 text-gray-500" />
          </div>
        ) : (
          <div className="flex items-center gap-2 text-[10px] text-gray-400">
            <Play className="h-3 w-3" />
            <span>الجدول الزمني</span>
          </div>
        )}
      </div>
    </button>
  )
}
