"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import CardItem from "./card-item"
import CardGroup from "./card-group"
import InsertionPoint from "./insertion-point"

// Define types for our data
type CardItemType = {
  id: string
  title: string
  subtitle: string
  image: string
}

type CardGroupType = {
  id: string
  title: string
  items: CardItemType[]
}

export default function CardList() {
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
          image: "/assorted-products-display.png",
        },
        {
          id: "item-2",
          title: "Subscribe to my YouTube",
          subtitle: "youtube.com/@mychannel",
          image: "/special-moment.png",
        },
        {
          id: "item-3",
          title: "Connect on LinkedIn",
          subtitle: "linkedin.com/in/myprofile",
          image: "/fresh-start-sprout.png",
        },
      ],
    },
  ])

  const [ungroupedItems, setUngroupedItems] = useState<CardItemType[]>([
    {
      id: "ungrouped-1",
      title: "Check out my Portfolio",
      subtitle: "myportfolio.com",
      image: "/standard-test-pattern.png",
    },
    {
      id: "ungrouped-2",
      title: "Support me on Patreon",
      subtitle: "patreon.com/mycreator",
      image: "/sale-stickers.png",
    },
  ])

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

  // Function to render items with insertion points between them
  const renderItemsWithInsertionPoints = (items: CardItemType[]) => {
    const elements = []

    items.forEach((item, index) => {
      // Add insertion point before the first item
      if (index === 0) {
        elements.push(<InsertionPoint key={`insertion-before-${item.id}`} />)
      }

      // Add the item
      elements.push(<CardItem key={item.id} title={item.title} subtitle={item.subtitle} image={item.image} />)

      // Add insertion point after each item
      elements.push(<InsertionPoint key={`insertion-after-${item.id}`} />)
    })

    return elements
  }

  return (
    <div className="space-y-2">
      {/* Grouped items */}
      <motion.div initial="hidden" animate="visible" variants={containerVariants}>
        {groups.map((group) => (
          <CardGroup key={group.id} title={group.title}>
            {renderItemsWithInsertionPoints(group.items)}
          </CardGroup>
        ))}
      </motion.div>

      {/* Ungrouped items */}
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-0">
        {renderItemsWithInsertionPoints(ungroupedItems)}
      </motion.div>
    </div>
  )
}
