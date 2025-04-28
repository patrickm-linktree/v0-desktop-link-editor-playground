"use client"

import React from "react"
import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { Edit } from "lucide-react"

interface CardGroupProps {
  title: string
  children: ReactNode
}

export default function CardGroup({ title, children }: CardGroupProps) {
  // Animation variants
  const groupVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  }

  // Count actual card items (not insertion points)
  const cardCount = React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && child.props.title,
  ).length

  return (
    <motion.div
      variants={groupVariants}
      className="rounded-3xl border border-stone-300 bg-stone-50/50 p-5 mb-4"
      layout
      transition={{
        layout: { type: "spring", damping: 30, stiffness: 300 },
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold text-stone-800 flex items-center gap-2">
          {title}
          <button className="text-stone-400 hover:text-stone-600 transition-colors">
            <Edit className="h-4 w-4" />
          </button>
        </h2>
        <div className="text-sm text-stone-500">{cardCount} links</div>
      </div>
      <motion.div className="space-y-0" layout>
        {children}
      </motion.div>
    </motion.div>
  )
}
