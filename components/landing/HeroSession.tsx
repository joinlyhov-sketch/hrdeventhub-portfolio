"use client";

import React from "react";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

const transitionEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: (d = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: transitionEase, delay: d },
  }),
};

const slideInLeft = {
  hidden: { opacity: 0, x: -60, rotate: -20 },
  visible: {
    opacity: 1,
    x: 0,
    rotate: -15,
    transition: { duration: 0.85, ease: transitionEase, delay: 0.5 },
  },
};

const slideInRight = {
  hidden: { opacity: 0, x: 60, rotate: 17 },
  visible: {
    opacity: 1,
    x: 0,
    rotate: 12,
    transition: { duration: 0.85, ease: transitionEase, delay: 0.6 },
  },
};

const slideInCenter = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.85, ease: transitionEase, delay: 0.4 },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.85 } },
};

const featureItem = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: transitionEase },
  },
};

export default function HeroSession() {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <>
      <section className="relative w-screen h-full bg-white text-secondary flex flex-col justify-between select-none overflow-x-hidden">
        <motion.div
          className="absolute top-[30%] -left-32 w-80 h-80 bg-[#7FAEF5]/35 rounded-full blur-[90px] pointer-events-none z-0 hidden md:block"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        <motion.div
          className="absolute top-[10%] -right-40 w-[450px] h-[450px] bg-[#7FAEF5]/35 rounded-full blur-[110px] pointer-events-none z-0 hidden md:block"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 1 }}
        />
        <motion.div
          className="absolute inset-4 pointer-events-none z-[14] hidden xl:block pt-3 top-[25%]"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 1 }}
        >
          <svg
            className="relative right-50"
            width="1300"
            height="430"
            viewBox="0 0 750 439"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <ellipse
              cx="520.5"
              cy="219.5"
              rx="228.5"
              ry="218.5"
              stroke="url(#paint0_linear_1_2)"
              strokeWidth="2"
              fill="none"
              opacity="0.5"
              pathLength="1392"
              strokeDasharray="12 12"
              strokeLinecap="round"
            />
            <path
              opacity="0.8"
              d="M-80 116C181.152 217.006 276.147 191.621 291 166.302"
              stroke="url(#paint1_linear_1_2)"
              strokeWidth="2"
              strokeDasharray="12 12"
              strokeLinecap="round"
            />
            <circle
              cx="291.5"
              cy="164.5"
              r="10.5"
              fill="#FF9F2E"
              stroke="#FDFDFD"
              strokeWidth="2"
            />
            <circle
              cx="721.5"
              cy="318.5"
              r="10.5"
              fill="#FF9F2E"
              stroke="#FDFDFD"
              strokeWidth="2"
            />
            <circle
              cx="588.5"
              cy="11.5"
              r="10.5"
              fill="#FF9F2E"
              stroke="#FDFDFD"
              strokeWidth="2"
            />
            <rect
              x="104.386"
              y="137.68"
              width="50"
              height="50"
              rx="25"
              transform="rotate(60.9402 104.386 137.68)"
              fill="#367DC5"
            />
            <rect
              x="104.386"
              y="137.68"
              width="50"
              height="50"
              rx="25"
              transform="rotate(60.9402 104.386 137.68)"
              stroke="white"
            />
            <path
              d="M98.0887 163.202L106.336 170.76C110.037 174.152 109.021 177.677 104.093 178.613L93.0979 180.676C85.7053 182.067 83.811 178.658 88.8964 173.115L91.1398 170.667L90.5276 167.404C89.1368 160.011 92.5349 158.123 98.0887 163.202Z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M91.7259 170.617L97.822 172.349"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient
                id="paint0_linear_1_2"
                x1="291"
                y1="219.5"
                x2="750"
                y2="219.5"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#00508D" />
                <stop offset="1" stopColor="#0A74FF" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_1_2"
                x1="-80"
                y1="152.5"
                x2="291"
                y2="152.5"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#00508D" />
                <stop offset="1" stopColor="#0A74FF" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute bottom-6 top-[0%] text-primary/70 w-[500px] h-[350px] rounded-full hidden xl:flex items-center left-345">
            <svg
              className="relative right-0"
              width="1500"
              height="650"
              viewBox="0 0 433 543"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <ellipse
                cx="271.5"
                cy="261.5"
                rx="269.5"
                ry="247.5"
                stroke="#1C4D8D"
                strokeWidth="2"
                fill="none"
                opacity="0.35"
                pathLength="1632"
                strokeDasharray="12 12"
                strokeLinecap="round"
              />
              <circle
                cx="14"
                cy="182.5"
                r="10.5"
                fill="#FF9F2E"
                stroke="#FDFDFD"
                strokeWidth="2"
              />
              <rect
                x="165"
                y="0.5"
                width="50"
                height="50"
                rx="25"
                fill="#367DC5"
              />
              <rect
                x="165"
                y="0.5"
                width="50"
                height="50"
                rx="25"
                stroke="white"
              />
              <path
                d="M197.5 19.45C197.425 19.4375 197.337 19.4375 197.262 19.45C195.537 19.3875 194.162 17.975 194.162 16.225C194.162 14.4375 195.6 13 197.387 13C199.175 13 200.612 14.45 200.612 16.225C200.6 17.975 199.225 19.3875 197.5 19.45Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M196.211 28.5502C197.924 28.8377 199.811 28.5377 201.136 27.6502C202.899 26.4752 202.899 24.5502 201.136 23.3752C199.799 22.4877 197.886 22.1877 196.174 22.4877"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M182.464 19.45C182.539 19.4375 182.627 19.4375 182.702 19.45C184.427 19.3875 185.802 17.975 185.802 16.225C185.802 14.4375 184.364 13 182.577 13C180.789 13 179.352 14.45 179.352 16.225C179.364 17.975 180.739 19.3875 182.464 19.45Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M183.751 28.5502C182.038 28.8377 180.151 28.5377 178.826 27.6502C177.063 26.4752 177.063 24.5502 178.826 23.3752C180.163 22.4877 182.076 22.1877 183.788 22.4877"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M190 28.7859C189.925 28.7734 189.837 28.7734 189.762 28.7859C188.037 28.7234 186.662 27.3109 186.662 25.5609C186.662 23.7734 188.1 22.3359 189.887 22.3359C191.675 22.3359 193.112 23.7859 193.112 25.5609C193.1 27.3109 191.725 28.7359 190 28.7859Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M186.363 32.7203C184.6 33.8953 184.6 35.8203 186.363 36.9953C188.363 38.3328 191.638 38.3328 193.638 36.9953C195.4 35.8203 195.4 33.8953 193.638 32.7203C191.65 31.3953 188.363 31.3953 186.363 32.7203Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <rect
                x="250.774"
                y="472.693"
                width="50"
                height="50"
                rx="25"
                transform="rotate(33.4786 250.774 472.693)"
                fill="#FF9F2E"
              />
              <rect
                x="250.774"
                y="472.693"
                width="50"
                height="50"
                rx="25"
                transform="rotate(33.4786 250.774 472.693)"
                stroke="white"
              />
              <path
                d="M260.561 494.148L258.492 497.276"
                stroke="white"
                strokeWidth="2"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M268.902 499.664L266.834 502.792"
                stroke="white"
                strokeWidth="2"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M257.82 521.41C259.662 522.629 262.144 522.123 263.363 520.281C264.581 518.438 264.075 515.956 262.233 514.738C260.39 513.519 257.909 514.025 256.69 515.868C255.471 517.71 255.977 520.192 257.82 521.41Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M261.369 524.654L261.016 522.922"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M250.98 498.438L268.705 510.16"
                stroke="white"
                strokeWidth="2"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M252.37 518.704L246.771 515.002C243.122 512.588 242.937 509.469 245.006 506.341L250.867 497.479C252.935 494.351 255.878 493.3 259.528 495.713L267.868 501.23C271.518 503.643 271.702 506.762 269.634 509.89L266.531 514.582"
                stroke="white"
                strokeWidth="2"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M256.659 509.104L256.668 509.111"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M252.802 506.55L252.811 506.556"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M250.731 509.675L250.741 509.681"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </motion.div>

        <div className="min-h-0 lg:min-h-[calc(100vh-80px)] w-full flex flex-col items-center justify-start px-4 py-6 md:px-8 md:py-10 lg:px-12 max-w-7xl mx-auto relative z-[12] text-center">
          <div className="w-full flex flex-col items-center justify-center mb-3 sm:mb-8 md:mb-10 lg:mb-12">
            <motion.h2
              className="text-base sm:text-3xl md:text-[32px] lg:text-[45px] text-action tracking-wide font-bold leading-tight flex flex-wrap items-center justify-center gap-x-2"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0}
            >
              <span>Bring Together</span>
              <motion.span
                className="text-secondary text-lg sm:text-4xl md:text-[36px] lg:text-[50px]"
                variants={fadeUp}
                custom={0.1}
              >
                Alumni
              </motion.span>
              <span className="text-action">&amp;</span>
              <motion.span
                className="text-secondary text-lg sm:text-4xl md:text-[36px] lg:text-[50px]"
                variants={fadeUp}
                custom={0.18}
              >
                Student
              </motion.span>
            </motion.h2>

            <motion.h1
              className="text-lg sm:text-5xl md:text-[44px] lg:text-[60px] text-secondary mt-2 sm:mt-3 mb-3 sm:mb-4 md:mb-5 lg:mb-6 max-w-5xl font-bold leading-tight"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.22}
            >
              Your Gateway{" "}
              <span className="text-primary inline">to Every HRD Event</span>
            </motion.h1>

            <motion.p
              className="text-sm sm:text-lg md:text-[16px] lg:text-[20px] text-secondary/90 text-center max-w-4xl mx-auto w-full leading-relaxed px-2"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.35}
            >
              Your all-in-one platform for event registration, group
              collaboration, and career-ready growth. Discover the next big
              event and link up with the brightest minds at HRD.
            </motion.p>
          </div>

          <div className="relative w-full top-0 sm:-top-10 md:-top-16 lg:-top-25 max-w-7xl h-50 sm:h-55 md:h-72 lg:h-120 flex items-center justify-center px-1 md:px-0 md:overflow-visible">

            {/* Mobile-only decorative dashed ellipse */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none sm:hidden z-5"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="mobileEllipseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00508D" />
                  <stop offset="100%" stopColor="#0A74FF" />
                </linearGradient>
              </defs>
              {/*
                Ellipse: cx=50% cy=52% rx=42% ry=38%
                Dots placed at exact points ON the ellipse stroke:
                  Top    → (50%, 14%)
                  Bot-R  → (80%, 79%)   verified: (-30²/42²)+(27²/38²)≈1
                  Bot-L  → (20%, 79%)   symmetric
              */}
              <ellipse
                cx="50%" cy="52%"
                rx="42%" ry="38%"
                stroke="url(#mobileEllipseGrad)"
                strokeWidth="1.5"
                strokeOpacity="0.65"
                strokeDasharray="10 10"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="50%" cy="14%" r="5" fill="#FF9F2E" stroke="white" strokeWidth="1.5" />
              <circle cx="80%" cy="79%" r="5" fill="#FF9F2E" stroke="white" strokeWidth="1.5" />
              <circle cx="20%" cy="79%" r="5" fill="#FF9F2E" stroke="white" strokeWidth="1.5" />
            </svg>

            <motion.div
              className="absolute left-[-2%] sm:left-[-1%] md:left-[-3%] w-[32%] md:w-[33%] translate-y-4 sm:translate-y-8 md:translate-y-16 z-30"
              variants={slideInLeft}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                animate={isMobile ? { y: [0, -5, 0] } : {}}
                transition={isMobile ? { duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 1 } : {}}
                className="w-full"
              >
                <div className="w-full overflow-hidden rounded-md sm:rounded-lg md:rounded-xl">
                  <Image
                    src="/images/HeroSession1.webp"
                    alt="HRD Student Event Assembly"
                    width={400}
                    height={300}
                    quality={95}
                    priority
                    sizes="(max-width: 640px) 32vw, (max-width: 768px) 33vw, 400px"
                    className="w-full h-auto block rotate-15"
                  />
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              className="absolute w-[48%] z-20"
              variants={slideInCenter}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                animate={isMobile ? { y: [0, -6, 0] } : {}}
                transition={isMobile ? { duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 1.3 } : {}}
                className="relative w-full"
              >
                <motion.div
                  className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:right-4 md:top-5 md:right-8 bg-white border border-border rounded-full p-1 sm:p-1.5 md:p-2 z-40 flex items-center justify-center"
                  variants={slideInCenter}
                  initial="hidden"
                  animate="visible"
                >
                  <Heart className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 fill-current text-destructive" />
                </motion.div>
                <div className="w-full overflow-hidden rounded-md sm:rounded-lg md:rounded-xl">
                  <Image
                    src="/images/HeroSession2.webp"
                    alt="HRD Main Event Group Photo"
                    width={600}
                    height={400}
                    quality={95}
                    priority
                    sizes="(max-width: 640px) 48vw, (max-width: 768px) 48vw, 600px"
                    className="w-full h-auto block"
                  />
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              className="absolute right-[-2%] sm:right-[-1%] md:right-[-3%] w-[34%] md:w-[35%] rotate-[10deg] md:rotate-[12deg] translate-y-4 sm:translate-y-8 md:translate-y-15 z-10"
              variants={slideInRight}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                animate={isMobile ? { y: [0, -5, 0] } : {}}
                transition={isMobile ? { duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1.6 } : {}}
                className="w-full"
              >
                <div className="w-full overflow-hidden rounded-md sm:rounded-lg md:rounded-xl">
                  <Image
                    src="/images/HeroSession3.webp"
                    alt="HRD Campus Community Event"
                    width={400}
                    height={300}
                    quality={95}
                    priority
                    sizes="(max-width: 640px) 34vw, (max-width: 768px) 35vw, 400px"
                    className="w-full h-auto block rotate-[-20deg]"
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
        <motion.div
          className="w-full max-w-6xl mx-auto border-t border-border/60 pt-8 md:pt-10 mt-10 md:mt-16 z-10 px-4 pb-8 md:pb-12"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-8 sm:gap-y-0 gap-x-4 md:gap-x-12 lg:gap-x-16 items-start justify-center text-center">
            <motion.div
              className="flex flex-col items-center justify-center gap-3 border-b sm:border-b-0 sm:border-r border-border/60 pb-6 sm:pb-0 pr-0 sm:pr-4 md:pr-6"
              variants={featureItem}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-muted flex items-center justify-center text-primary shadow-sm shrink-0">
                <svg
                  className="w-full h-full p-0.5"
                  viewBox="0 0 44 44"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="44" height="44" rx="22" fill="#D1E1FE" />
                  <path
                    d="M26.9004 26.9C29.6004 24.2 29.6004 19.7 26.9004 17"
                    stroke="#1C4E8D"
                    strokeWidth="2"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17.0992 17.1016C14.3992 19.8016 14.3992 24.3016 17.0992 27.0016"
                    stroke="#1C4E8D"
                    strokeWidth="2"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M19.6992 23.5969C19.6992 24.4969 20.3992 25.1969 21.2992 25.1969H22.9992C23.6992 25.1969 24.3992 24.5969 24.3992 23.7969C24.3992 22.8969 23.9992 22.5969 23.4992 22.3969L20.6992 21.3969C19.9992 21.2969 19.6992 20.9969 19.6992 20.1969C19.6992 19.3969 20.2992 18.7969 21.0992 18.7969H22.8992C23.7992 18.7969 24.4992 19.4969 24.4992 20.3969"
                    stroke="#17191C"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22 17.7969V26.1969"
                    stroke="#17191C"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22 32C27.5228 32 32 27.5228 32 22C32 16.4772 27.5228 12 22 12C16.4772 12 12 16.4772 12 22C12 27.5228 16.4772 32 22 32Z"
                    stroke="#17191C"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-base md-type-title text-primary tracking-tight text-center md:whitespace-nowrap leading-tight">
                Digital Payment
              </h3>
            </motion.div>
            <motion.div
              className="flex flex-col items-center justify-center gap-3 border-b sm:border-b-0 sm:border-r border-border/60 pb-6 sm:pb-0 px-0 sm:px-4 md:px-6"
              variants={featureItem}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-muted flex items-center justify-center text-primary shadow-sm shrink-0">
                <svg
                  className="w-full h-full p-0.5"
                  viewBox="0 0 44 44"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="44" height="44" rx="22" fill="#D1E1FE" />
                  <path
                    d="M31.9292 16.761L28.5592 30.291C28.3192 31.301 27.4192 32.001 26.3792 32.001H13.2392C11.7292 32.001 10.6492 30.5209 11.0992 29.0709L15.3092 15.551C15.5992 14.611 16.4692 13.9609 17.4492 13.9609H29.7492C30.6992 13.9609 31.4892 14.5409 31.8192 15.3409C32.0092 15.7709 32.0492 16.261 31.9292 16.761Z"
                    stroke="#1C4E8D"
                    strokeWidth="2"
                    strokeMiterlimit="10"
                  />
                  <path
                    d="M26 32H30.78C32.07 32 33.08 30.91 32.99 29.62L32 16"
                    stroke="#1C4E8D"
                    strokeWidth="2"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M19.6797 16.3824L20.7197 12.0625"
                    stroke="#292D32"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M26.3809 16.3868L27.3209 12.0469"
                    stroke="#292D32"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17.6992 22H25.6992"
                    stroke="#292D32"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16.6992 26H24.6992"
                    stroke="#292D32"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-base md-type-title text-primary tracking-tight text-center md:whitespace-nowrap leading-tight">
                Event Management
              </h3>
            </motion.div>

            <motion.div
              className="flex flex-col items-center justify-center gap-3 pl-0 sm:pl-4 md:pl-6"
              variants={featureItem}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-muted flex items-center justify-center text-primary shadow-sm shrink-0">
                <svg
                  className="w-full h-full p-0.5"
                  viewBox="0 0 44 44"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="44" height="44" rx="22" fill="#D1E1FE" />
                  <path
                    d="M27 19C27 22.87 23.64 26 19.5 26L18.57 27.12L18.02 27.78C17.55 28.34 16.65 28.22 16.34 27.55L15 24.6C13.18 23.32 12 21.29 12 19C12 15.13 15.36 12 19.5 12C22.52 12 25.13 13.67 26.3 16.07C26.75 16.96 27 17.95 27 19Z"
                    stroke="#1C4E8D"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M32.0003 22.8603C32.0003 25.1503 30.8203 27.1803 29.0003 28.4603L27.6603 31.4103C27.3503 32.0803 26.4503 32.2103 25.9803 31.6403L24.5003 29.8603C22.0803 29.8603 19.9203 28.7903 18.5703 27.1203L19.5003 26.0003C23.6403 26.0003 27.0003 22.8703 27.0003 19.0003C27.0003 17.9503 26.7503 16.9603 26.3003 16.0703C29.5703 16.8203 32.0003 19.5803 32.0003 22.8603Z"
                    stroke="#1C4E8D"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17 19H22"
                    stroke="#292D32"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-base md-type-title text-primary tracking-tight text-center md:whitespace-nowrap leading-tight">
                Community Engagement
              </h3>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </>
  );
}
