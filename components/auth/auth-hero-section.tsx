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
            <h2 className="mb-3 text-[60px] font-extrabold leading-none tracking-[-2px] text-[#17356f] lg:text-[72px]">
              Let’s start
            </h2>

            <h1 className="mb-5 text-[90px] font-black leading-[0.9] tracking-[-4px] text-[#1f4f98] lg:text-[108px]">
              Discovering.
            </h1>

            <h3 className="mb-7 text-[42px] font-extrabold uppercase leading-none tracking-[-1px] text-[#f9a132] lg:text-[54px]">
              Participate Together
            </h3>

            <p className="max-w-[540px] text-[18px] leading-9 text-[#5f6470]">
              Discover the next big event and link up with the brightest minds at HRD. Your all-in-one platform for event registration, group collaboration, and career-ready growth.
            </p>
          </motion.div>
    </>
  );
}
