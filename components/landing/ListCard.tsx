"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import Image from "next/image";

interface MediaItem {
  id: string;
  category: string;
  title: string;
  description: string;
  imageUrl: string;
}

export default function MediaListSection() {
  const customCardsData: MediaItem[] = [
    {
      id: "card-1",
      category: "Success Story",
      title: "Gen 13 Graduate Secure Global Roles",
      description: "Congratulations to our latest graduates! 95% employment rate within 2 months of completing the software engineering.",
      imageUrl: "/images/songkran.png" 
    },
    {
      id: "card-2",
      category: "Alumni Spotlight",
      title: "How John landed a Remote Dev Job in 3 Months",
      description: "From working in hospitality to writing code full-time. Read Nika's inspiring transition journey.",
      imageUrl: "/images/alumni.png"
    },
    {
      id: "card-3",
      category: "Event",
      title: "Demo Day: Showcasing Gen 13 Capstones",
      description: "Watch our graduates pitch their production-ready web applications to top tech companies and investors.",
      imageUrl: "/images/gen13.png"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="flex flex-col gap-5 md:gap-3 h-full"
    >
      {customCardsData.map((data) => (
        <ListCard key={data.id} item={data} />
      ))}
    </motion.div>
  );
}

const ListCard: React.FC<{ item: MediaItem }> = ({ item }) => {
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 } as const
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      className="flex flex-col md:flex-row md:items-center w-full border border-border rounded-xl bg-card shadow-sm overflow-hidden md:gap-3 md:p-3 md:flex-1"
    >
      {/* Mobile: full-width image top / Desktop: compact thumbnail */}
      <div className="relative w-full h-52 md:w-28 md:h-22 md:rounded-lg md:shrink-0 overflow-hidden">
        <Image
          src={item.imageUrl}
          alt={item.title}
          fill
          quality={95}
          sizes="(max-width: 768px) 100vw, 112px"
          className="object-cover"
        />
      </div>

      {/* Text */}
      <div className="flex flex-col items-start gap-1.5 flex-1 min-w-0 p-4 md:p-0">
        <span className="text-xs font-semibold text-secondary bg-muted px-2 py-0.5 rounded-full uppercase tracking-wider">
          {item.category}
        </span>
        <h4 className="text-base md:text-sm font-bold text-secondary w-full leading-snug line-clamp-2">
          {item.title}
        </h4>
        <p className="text-sm md:text-xs text-muted-foreground leading-relaxed line-clamp-3 md:line-clamp-2">
          {item.description}
        </p>
      </div>
    </motion.div>
  );
};