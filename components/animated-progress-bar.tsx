"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface AnimatedProgressBarProps {
  progress: number
  duration?: number
  height?: number
}

export function AnimatedProgressBar({ progress, duration = 1000, height = 8 }: AnimatedProgressBarProps) {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    setWidth(progress)
  }, [progress])

  return (
    <div className="overflow-hidden rounded-full bg-gray-200" style={{ height: `${height}px` }}>
      <motion.div
        className="h-full bg-black"
        initial={{ width: `${width - 10}%` }}
        animate={{ width: `${width}%` }}
        transition={{ duration: duration / 1000 }}
      />
    </div>
  )
}
