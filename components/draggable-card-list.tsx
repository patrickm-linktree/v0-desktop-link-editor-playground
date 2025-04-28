"use client"

import { useState, useRef } from "react"
import { motion, useMotionValue, useTransform, AnimatePresence, LayoutGroup } from "framer-motion"
import CardItem from "./card-item"
import CardGroup from "./card-group"
import InsertionPoint from "./insertion-point"
import type React from "react"

// Define types for our data
type CardItemType = {
  id: string
  title: string
  subtitle: string
  image: string
  gradient: string
}

type CardGroupType = {
  id: string
  title: string
  items: CardItemType[]
}

// Define type for insertion point position
type InsertionPointPosition = {
  groupId: string | null
  index: number
  top?: number
  left?: number
  width?: number
}

// Gradient presets
const gradients = [
  "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
  "linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)",
  "linear-gradient(135deg, #c3cfe2 0%, #c3cfe2 100%)",
  "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
  "linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)",
]

export default function DraggableCardList() {
  // Sample data with both grouped and ungrouped items
  const [groups, setGroups] = useState<CardGroupType[]>([
    {
      id: "group-1",
      title: "My Social Media",
      items: [
        {
          id: "item-1",
          title: "Follow me on Instagram",
          subtitle: "instagram.com/myprofile",
          image: "",
          gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
        },
        {
          id: "item-2",
          title: "Subscribe to my YouTube",
          subtitle: "youtube.com/@mychannel",
          image: "",
          gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        },
        {
          id: "item-3",
          title: "Connect on LinkedIn",
          subtitle: "linkedin.com/in/myprofile",
          image: "",
          gradient: "linear-gradient(135deg, #48c6ef 0%, #6f86d6 100%)",
        },
      ],
    },
  ])

  const [ungroupedItems, setUngroupedItems] = useState<CardItemType[]>([
    {
      id: "ungrouped-1",
      title: "Check out my Portfolio",
      subtitle: "myportfolio.com",
      image: "",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    {
      id: "ungrouped-2",
      title: "Support me on Patreon",
      subtitle: "patreon.com/mycreator",
      image: "",
      gradient: "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
    },
  ])

  // Drag state
  const [draggedItem, setDraggedItem] = useState<CardItemType | null>(null)
  const [draggedItemSource, setDraggedItemSource] = useState<"group" | "ungrouped" | null>(null)
  const [draggedItemGroupId, setDraggedItemGroupId] = useState<string | null>(null)
  const [insertionPoint, setInsertionPoint] = useState<InsertionPointPosition | null>(null)

  // Container ref for position calculations
  const containerRef = useRef<HTMLDivElement>(null)

  // Refs for position calculations
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const groupRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const ungroupedRef = useRef<HTMLDivElement>(null)

  // Mouse position for the follower
  const mouseY = useMotionValue(0)
  const mouseX = useMotionValue(0)

  // Fixed offset for the follower card
  const x = useTransform(mouseX, (x) => x - 150)
  const y = useTransform(mouseY, (y) => y - 30)

  // Handle drag start
  const handleDragStart = (
    item: CardItemType,
    source: "group" | "ungrouped",
    groupId: string | null = null,
    e: React.MouseEvent,
  ) => {
    // Initialize mouse position
    mouseX.set(e.clientX)
    mouseY.set(e.clientY)

    setDraggedItem(item)
    setDraggedItemSource(source)
    setDraggedItemGroupId(groupId)

    // Calculate initial insertion point
    updateInsertionPoint(e.clientX, e.clientY)
  }

  // Update mouse position for the follower
  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedItem) {
      mouseY.set(e.clientY)
      mouseX.set(e.clientX)

      // Calculate insertion point
      updateInsertionPoint(e.clientX, e.clientY)
    }
  }

  // Calculate and update insertion point based on mouse position
  const updateInsertionPoint = (mouseX: number, mouseY: number) => {
    if (!containerRef.current) return

    const containerRect = containerRef.current.getBoundingClientRect()

    // Check ungrouped items first
    if (ungroupedRef.current) {
      const rect = ungroupedRef.current.getBoundingClientRect()

      if (mouseY >= rect.top && mouseY <= rect.bottom) {
        // Find the closest item in ungrouped
        let closestIndex = 0
        let closestDistance = Number.POSITIVE_INFINITY
        let insertionTop = rect.top - containerRect.top
        let targetRef: HTMLDivElement | null = null

        ungroupedItems.forEach((item, index) => {
          const cardRef = cardRefs.current.get(item.id)
          if (cardRef) {
            const cardRect = cardRef.getBoundingClientRect()
            const cardMiddle = cardRect.top + cardRect.height / 2
            const distance = Math.abs(mouseY - cardMiddle)

            if (distance < closestDistance) {
              closestDistance = distance
              closestIndex = mouseY < cardMiddle ? index : index + 1

              // Calculate insertion point position
              if (mouseY < cardMiddle) {
                // Insert before this item
                insertionTop = cardRect.top - containerRect.top - 1
                targetRef = cardRef
              } else if (index === ungroupedItems.length - 1) {
                // Insert after the last item
                insertionTop = cardRect.bottom - containerRect.top + 1
                targetRef = cardRef
              }
            }
          }
        })

        // If we're inserting between two items, calculate the midpoint
        if (closestIndex > 0 && closestIndex < ungroupedItems.length) {
          const prevRef = cardRefs.current.get(ungroupedItems[closestIndex - 1].id)
          const nextRef = cardRefs.current.get(ungroupedItems[closestIndex].id)

          if (prevRef && nextRef) {
            const prevRect = prevRef.getBoundingClientRect()
            const nextRect = nextRef.getBoundingClientRect()
            insertionTop = (prevRect.bottom - containerRect.top + (nextRect.top - containerRect.top)) / 2
            targetRef = nextRef
          }
        }

        // If we have a target reference, use its width for the insertion line
        const width = targetRef ? targetRef.getBoundingClientRect().width : containerRect.width - 40

        setInsertionPoint({
          groupId: null,
          index: closestIndex,
          top: insertionTop,
          left: 20, // Add some padding
          width: width,
        })
        return
      }
    }

    // Check grouped items
    for (const group of groups) {
      const groupRef = groupRefs.current.get(group.id)
      if (groupRef) {
        const rect = groupRef.getBoundingClientRect()

        if (mouseY >= rect.top && mouseY <= rect.bottom) {
          // Find the closest item in the group
          let closestIndex = 0
          let closestDistance = Number.POSITIVE_INFINITY
          let insertionTop = rect.top - containerRect.top + 40 // Account for group header
          let targetRef: HTMLDivElement | null = null

          group.items.forEach((item, index) => {
            const cardRef = cardRefs.current.get(item.id)
            if (cardRef) {
              const cardRect = cardRef.getBoundingClientRect()
              const cardMiddle = cardRect.top + cardRect.height / 2
              const distance = Math.abs(mouseY - cardMiddle)

              if (distance < closestDistance) {
                closestDistance = distance
                closestIndex = mouseY < cardMiddle ? index : index + 1

                // Calculate insertion point position
                if (mouseY < cardMiddle) {
                  // Insert before this item
                  insertionTop = cardRect.top - containerRect.top - 1
                  targetRef = cardRef
                } else if (index === group.items.length - 1) {
                  // Insert after the last item
                  insertionTop = cardRect.bottom - containerRect.top + 1
                  targetRef = cardRef
                }
              }
            }
          })

          // If we're inserting between two items, calculate the midpoint
          if (closestIndex > 0 && closestIndex < group.items.length) {
            const prevRef = cardRefs.current.get(group.items[closestIndex - 1].id)
            const nextRef = cardRefs.current.get(group.items[closestIndex].id)

            if (prevRef && nextRef) {
              const prevRect = prevRef.getBoundingClientRect()
              const nextRect = nextRef.getBoundingClientRect()
              insertionTop = (prevRect.bottom - containerRect.top + (nextRect.top - containerRect.top)) / 2
              targetRef = nextRef
            }
          }

          // If we have a target reference, use its width for the insertion line
          const width = targetRef ? targetRef.getBoundingClientRect().width : rect.width - 40

          setInsertionPoint({
            groupId: group.id,
            index: closestIndex,
            top: insertionTop,
            left: rect.left - containerRect.left + 20, // Add some padding
            width: width,
          })
          return
        }
      }
    }

    setInsertionPoint(null)
  }

  // Handle drag end and reordering
  const handleDragEnd = () => {
    if (draggedItem && insertionPoint) {
      // Remove item from its original location
      if (draggedItemSource === "group" && draggedItemGroupId) {
        // Remove from group
        setGroups((prevGroups) => {
          return prevGroups.map((group) => {
            if (group.id === draggedItemGroupId) {
              return {
                ...group,
                items: group.items.filter((item) => item.id !== draggedItem.id),
              }
            }
            return group
          })
        })
      } else if (draggedItemSource === "ungrouped") {
        // Remove from ungrouped
        setUngroupedItems((prev) => prev.filter((item) => item.id !== draggedItem.id))
      }

      // Add item to its new location
      if (insertionPoint.groupId === null) {
        // Add to ungrouped
        setUngroupedItems((prev) => {
          const newItems = [...prev]
          newItems.splice(insertionPoint.index, 0, draggedItem)
          return newItems
        })
      } else {
        // Add to group
        setGroups((prevGroups) => {
          return prevGroups.map((group) => {
            if (group.id === insertionPoint.groupId) {
              const newItems = [...group.items]
              newItems.splice(insertionPoint.index, 0, draggedItem)
              return {
                ...group,
                items: newItems,
              }
            }
            return group
          })
        })
      }
    }

    // Reset all drag state
    setDraggedItem(null)
    setDraggedItemSource(null)
    setDraggedItemGroupId(null)
    setInsertionPoint(null)
  }

  // Animation variants for container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  // Render a group's items with insertion points
  const renderGroupItems = (group: CardGroupType) => {
    const elements: React.ReactNode[] = []

    // Add insertion point at the beginning
    elements.push(
      <InsertionPoint
        key={`insertion-start-${group.id}`}
        onClick={() => console.log("Add new item at beginning of group", group.id)}
        isDragging={!!draggedItem}
      />,
    )

    group.items.forEach((item, index) => {
      // Add the card
      elements.push(
        <motion.div
          key={item.id}
          ref={(el) => el && cardRefs.current.set(item.id, el)}
          style={{ opacity: draggedItem?.id === item.id ? 0.5 : 1 }}
          layout
          transition={{
            layout: { type: "spring", damping: 25, stiffness: 300 },
          }}
        >
          <CardItem
            title={item.title}
            subtitle={item.subtitle}
            image={item.image}
            gradient={item.gradient}
            onDragStart={(e) => handleDragStart(item, "group", group.id, e)}
            isDraggable={true}
          />
        </motion.div>,
      )

      // Add insertion point after each item
      elements.push(
        <InsertionPoint
          key={`insertion-${item.id}`}
          onClick={() => console.log("Add new item after", item.id)}
          isDragging={!!draggedItem}
        />,
      )
    })

    return elements
  }

  // Render ungrouped items with insertion points
  const renderUngroupedItems = () => {
    const elements: React.ReactNode[] = []

    // Add insertion point at the beginning
    elements.push(
      <InsertionPoint
        key="insertion-start-ungrouped"
        onClick={() => console.log("Add new item at beginning of ungrouped")}
        isDragging={!!draggedItem}
      />,
    )

    ungroupedItems.forEach((item, index) => {
      // Add the card
      elements.push(
        <motion.div
          key={item.id}
          ref={(el) => el && cardRefs.current.set(item.id, el)}
          style={{ opacity: draggedItem?.id === item.id ? 0.5 : 1 }}
          layout
          transition={{
            layout: { type: "spring", damping: 25, stiffness: 300 },
          }}
        >
          <CardItem
            title={item.title}
            subtitle={item.subtitle}
            image={item.image}
            gradient={item.gradient}
            onDragStart={(e) => handleDragStart(item, "ungrouped", null, e)}
            isDraggable={true}
          />
        </motion.div>,
      )

      // Add insertion point after each item
      elements.push(
        <InsertionPoint
          key={`insertion-${item.id}`}
          onClick={() => console.log("Add new item after", item.id)}
          isDragging={!!draggedItem}
        />,
      )
    })

    return elements
  }

  return (
    <LayoutGroup>
      <div
        ref={containerRef}
        className="space-y-2 relative"
        onMouseMove={handleMouseMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
      >
        {/* Grouped items */}
        <motion.div initial="hidden" animate="visible" variants={containerVariants} layout>
          {groups.map((group) => (
            <motion.div key={group.id} ref={(el) => el && groupRefs.current.set(group.id, el)} layout>
              <CardGroup title={group.title}>{renderGroupItems(group)}</CardGroup>
            </motion.div>
          ))}
        </motion.div>

        {/* Ungrouped items */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-0"
          ref={ungroupedRef}
          layout
        >
          {renderUngroupedItems()}
        </motion.div>

        {/* Dragged item follower */}
        <AnimatePresence>
          {draggedItem && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 0.95 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed pointer-events-none z-50 w-[90%] max-w-md"
              style={{
                top: 0,
                left: 0,
                x,
                y,
              }}
            >
              <CardItem
                title={draggedItem.title}
                subtitle={draggedItem.subtitle}
                image={draggedItem.image}
                gradient={draggedItem.gradient}
                isDraggable={false}
                isFollower={true}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Persistent drag insertion indicator */}
        {insertionPoint && draggedItem && insertionPoint.top !== undefined && (
          <div
            className="absolute h-0.5 bg-stone-500 z-30 pointer-events-none"
            style={{
              top: insertionPoint.top,
              left: insertionPoint.left,
              width: insertionPoint.width,
            }}
          />
        )}
      </div>
    </LayoutGroup>
  )
}
