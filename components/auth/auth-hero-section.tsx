"use client";
import { Variants ,motion } from "framer-motion";


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
            className="max-w-[700px] pl-4 lg:pl-12"
          >
            <h2 className="mb-3 text-[48px] font-bold leading-none tracking-[-2px] text-[#17356f] lg:text-[48px]">
              Let’s start
            </h2>

            <h1 className="mb-5 text-[96px] font-bold leading-[0.9] tracking-[-4px] text-[#1f4f98] lg:text-[96px]">
              Discovering.
            </h1>

            <h3 className="mb-7 text-[48px] font-extrabold uppercase leading-none tracking-[-1px] text-[#f9a132] lg:text-[48px]">
              Participate Together
            </h3>

            <p className="max-w-[540px] text-[14px] text-[#5f6470]">
              Discover the next big event and link up with the brightest minds at HRD. Your all-in-one platform for event registration, group collaboration, and career-ready growth.
            </p>
          </motion.div>
    </>
  );
}
