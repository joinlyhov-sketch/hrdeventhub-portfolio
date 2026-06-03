"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/reaction/popover"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/reaction/toggle-group"

export const REACTIONS = [
  { id: "like", label: "Like", displayText: "Like", color: "text-blue-500 hover:text-blue-600" },
  { id: "please", label: "Please", displayText: "Please", color: "text-purple-500 hover:text-purple-600" },
  { id: "too_hard", label: "Too Hard", displayText: "Too Hard", color: "text-red-500 hover:text-red-600" },
  { id: "great", label: "Great", displayText: "Great", color: "text-emerald-500 hover:text-emerald-600" },
  { id: "thank_you", label: "Thank You", displayText: "Thank You", color: "text-pink-500 hover:text-pink-600" },
]

interface ReactionPopoverProps {
  children: React.ReactNode
  onReactionSelect: (id: string) => void
  selectedValue: string | null
}

export function ReactionPopover({ children, onReactionSelect, selectedValue }: ReactionPopoverProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false)
    }, 150)
  }

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <div 
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave}
      className="relative inline-block"
    >
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div>{children}</div>
        </PopoverTrigger>

        <PopoverContent
          side="top"
          align="start"
          sideOffset={8}
          className="w-auto rounded-xl p-1.5 shadow-md border bg-background/95 backdrop-blur z-50 transition-none"
          onMouseEnter={handleMouseEnter} 
        >
          <ToggleGroup
            type="single"
            value={selectedValue || ""}
            onValueChange={(val) => {
              if (val) onReactionSelect(val)
              setIsOpen(false)
            }}
            className="flex gap-0.5"
          >
            <AnimatePresence>
              {REACTIONS.map((item) => (
                <ToggleGroupItem
                  key={item.id}
                  value={item.id}
                  aria-label={item.label}
                  asChild
                  className="h-8 px-2.5 rounded-lg bg-transparent border-none data-[state=on]:bg-primary/5 cursor-pointer"
                >
                  <motion.button
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.12, ease: "easeOut" }}
                    whileHover={{ y: -2 }}
                    className={`text-xs font-bold tracking-wide select-none outline-none whitespace-nowrap transition-colors duration-100 ${item.color}`}
                  >
                    {item.displayText}
                  </motion.button>
                </ToggleGroupItem>
              ))}
            </AnimatePresence>
          </ToggleGroup>
        </PopoverContent>
      </Popover>
    </div>
  )
}