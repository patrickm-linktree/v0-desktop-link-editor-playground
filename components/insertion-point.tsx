"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus } from "lucide-react"

interface InsertionPointProps {
  onClick?: () => void
  isDragging?: boolean
}

export default function InsertionPoint({ onClick, isDragging = false }: InsertionPointProps) {
  const [isHovering, setIsHovering] = useState(false)
  const [isDelayedHover, setIsDelayedHover] = useState(false)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const HOVER_DELAY = 150 // milliseconds

  // Handle mouse enter
  const handleMouseEnter = () => {
    // Don't show hover state if dragging
    if (isDragging) return

    setIsHovering(true)

    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }

    // Set a timeout to show the hover state after delay
    hoverTimeoutRef.current = setTimeout(() => {
      setIsDelayedHover(true)
    }, HOVER_DELAY)
  }

  // Handle mouse leave
  const handleMouseLeave = () => {
    setIsHovering(false)
    setIsDelayedHover(false)

    // Clear the timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }
  }

  // Reset hover state when dragging state changes
  useEffect(() => {
    if (isDragging) {
      setIsHovering(false)
      setIsDelayedHover(false)

      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
        hoverTimeoutRef.current = null
      }
    }
  }, [isDragging])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
    }
  }, [])

  // Animation variants for the container
  const containerVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.2,
      },
    },
  }

  // Animation variants for the line
  const lineVariants = {
    hidden: {
      scaleX: 0.8,
      opacity: 0,
    },
    visible: {
      scaleX: 1,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  }

  // Animation variants for the plus button
  const buttonVariants = {
    hidden: {
      scale: 0,
      opacity: 0,
    },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        delay: 0.1,
        duration: 0.2,
        type: "spring",
        bounce: 0,
      },
    },
  }

  return (
    <motion.div
      className="group h-6 w-full my-0.5 cursor-pointer relative z-10"
      initial="hidden"
      animate={isDelayedHover && !isDragging ? "visible" : "hidden"}
      variants={containerVariants}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Fixed-height container for alignment */}
      <div className="relative w-full h-5 flex items-center justify-center">
        {/* The line */}
        <motion.div className="absolute w-full h-0.5 bg-stone-500" variants={lineVariants} style={{ top: "50%" }} />

        {/* The button */}
        <motion.div
          className="absolute bg-stone-500 rounded-full w-5 h-5 flex items-center justify-center z-20"
          variants={buttonVariants}
        >
          <Plus className="h-3 w-3 text-white" strokeWidth={3} />
        </motion.div>
      </div>
    </motion.div>
  )
}
