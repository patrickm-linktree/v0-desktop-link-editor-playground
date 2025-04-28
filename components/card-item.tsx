"use client"

import type React from "react"
import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"
import Image from "next/image"
import { Card } from "@/components/ui/card"

interface CardItemProps {
  title: string
  subtitle: string
  image: string
  isDraggable?: boolean
  isFollower?: boolean
  onDragStart?: (e: React.MouseEvent) => void
  gradient?: string
}

export default function CardItem({
  title,
  subtitle,
  image,
  isDraggable = false,
  isFollower = false,
  onDragStart,
  gradient,
}: CardItemProps) {
  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
    hover: {
      transition: { duration: 0.2 },
    },
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isDraggable && onDragStart) {
      e.preventDefault()
      onDragStart(e)
    }
  }

  return (
    <motion.div
      layout
      layoutId={isFollower ? undefined : title} // Don't use layoutId for the follower to avoid conflicts
      variants={itemVariants}
      whileHover="hover"
      className="w-full"
      onMouseDown={handleMouseDown}
      style={{
        cursor: isDraggable ? "grab" : "pointer",
        boxShadow: isFollower ? "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" : "none",
      }}
      transition={{
        layout: { type: "spring", damping: 25, stiffness: 300 },
      }}
    >
      <Card className={`overflow-hidden rounded-2xl ${isFollower ? "border-stone-500 border-2" : ""}`}>
        <div className="flex items-center p-4 cursor-pointer">
          <div className="flex-shrink-0 mr-4">
            <div
              className="h-16 w-16 rounded-xl overflow-hidden"
              style={{
                background: gradient || "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
              }}
            >
              {image && (
                <Image
                  src={image || "/placeholder.svg"}
                  alt={title}
                  width={80}
                  height={80}
                  className="h-full w-full object-cover opacity-0"
                />
              )}
            </div>
          </div>
          <div className="flex-grow">
            <h3 className="font-medium text-lg">{title}</h3>
            <p className="text-stone-500 text-sm font-mono">{subtitle}</p>
          </div>
          <ChevronRight className="h-5 w-5 text-stone-400 flex-shrink-0" />
        </div>
      </Card>
    </motion.div>
  )
}
