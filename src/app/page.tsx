'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye } from 'lucide-react'

export default function Home() {
  const [showSplash, setShowSplash] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false)
      setTimeout(() => router.push('/dashboard'), 300)
    }, 2000)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-t-dark"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative"
          >
            <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-t-cyan/20 to-t-blue/20 border border-t-cyan/30">
              <Eye className="h-10 w-10 text-t-cyan" />
            </div>
            <motion.div
              className="absolute inset-0 rounded-2xl"
              animate={{
                boxShadow: [
                  '0 0 20px rgba(6, 182, 212, 0.2)',
                  '0 0 40px rgba(6, 182, 212, 0.4)',
                  '0 0 20px rgba(6, 182, 212, 0.2)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-6 text-3xl font-bold text-white"
          >
            TrainEye AI
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-2 text-sm text-t-cyan/70"
          >
            مركز إدارة مترو الرياض
          </motion.p>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 200 }}
            transition={{ delay: 0.7, duration: 1.2, ease: 'easeInOut' }}
            className="mt-8 h-[2px] rounded-full bg-gradient-to-r from-transparent via-t-cyan to-transparent"
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
