"use client";
import { Variants, motion } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function AuthHeroSection() {
  return (
    <>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="w-full max-w-[700px] mx-auto xl:mx-0 px-4 xl:pl-12 text-center xl:text-left"
      >
        <h2 className="mb-3 text-[28px] sm:text-[36px] xl:text-[48px] font-bold leading-tight tracking-[-1px] xl:tracking-[-2px] text-[#17356f]">
          Let's start
        </h2>

        <h1 className="mb-5 text-[48px] sm:text-[64px] xl:text-[96px] font-bold leading-[0.9] tracking-[-2px] xl:tracking-[-4px] text-[#1f4f98]">
          Discovering.
        </h1>

        <h3 className="mb-7 text-[28px] sm:text-[36px] xl:text-[48px] font-extrabold uppercase leading-tight tracking-[-0.5px] xl:tracking-[-1px] text-[#f9a132]">
          Participate Together
        </h3>

        <p className="max-w-[540px] mx-auto xl:mx-0 text-[14px] text-[#5f6470] leading-relaxed">
          Discover the next big event and link up with the brightest minds at HRD. Your all-in-one platform for event registration, group collaboration, and career-ready growth.
        </p>
      </motion.div>
    </>
  );
}