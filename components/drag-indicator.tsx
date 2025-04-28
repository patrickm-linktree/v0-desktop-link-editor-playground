"use client"

import { motion } from "framer-motion"

interface DragIndicatorProps {
  isVisible: boolean
}

export default function DragIndicator({ isVisible }: DragIndicatorProps) {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      animate={{ scaleX: isVisible ? 1 : 0 }}
      className="h-1 w-full bg-purple-500 my-1"
    />
  )
}
