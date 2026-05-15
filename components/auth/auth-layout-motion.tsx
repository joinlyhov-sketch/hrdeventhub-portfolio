"use client";
import { motion } from "framer-motion";

export default function AuthLayoutMotion() {
  return (
    <>
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute right-0 top-0 z-0">
          <div className="relative h-[430px] w-[530px] overflow-hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="absolute -right-[170px] -top-[190px] h-[620px] w-[620px] rounded-full bg-[#4f7fc7]"
            />

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2 }}
              className="absolute right-[120px] top-[-80px] h-[190px] w-[360px] rounded-b-[120px] rounded-t-none bg-[#7398cf]"
            />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 z-0 overflow-hidden">
          <div className="relative h-[350px] w-[350px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="absolute -bottom-[180px] -left-[140px] h-[470px] w-[470px] rounded-full bg-[#5f88c7]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2 }}
              className="absolute bottom-[-40px] left-[-60px] h-[250px] w-[250px] rounded-full border-[48px] border-[#ffd7a1]"
            />
          </div>
        </div>
      </div>
    </>
  );
}
