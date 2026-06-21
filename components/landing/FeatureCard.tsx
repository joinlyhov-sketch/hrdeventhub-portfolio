'use client';
import React from "react";
import { motion } from "framer-motion";
import { MediaItem } from "./types";

interface FeatureCardProps {
  item: MediaItem;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ item }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative w-full h-full min-h-70 md:min-h-95 bg-card rounded-xl overflow-hidden shadow-md cursor-pointer"
    >
      <motion.img
        src={item.imageUrl}
        alt={item.title}
        className="absolute inset-0 w-full h-full object-cover"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />

      <div className="absolute inset-0 bg-linear-to-t from-grey-900/90 via-grey-900/30 to-transparent flex items-center justify-center">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="w-16 h-16 rounded-full text-primary-foreground flex items-center justify-center shadow-xl"
        >
        </motion.button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col items-start gap-3">
        <span className="type-desc-small-semibold bg-action text-action-foreground px-3 py-1 rounded-full uppercase">
          {item.category}
        </span>
        <h2 className="type-title text-primary-foreground leading-tight max-w-xl">
          {item.title}
        </h2>
      </div>
    </motion.div>
  );
};