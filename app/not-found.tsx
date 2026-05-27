"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MoveLeft } from "lucide-react";
import { Variants, motion } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function NotFound() {
  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-6 md:p-12 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2 }}
          className="absolute -top-20 -left-20 w-100 h-100"
        >
          <Image
            src="/images/tlblur.svg"
            alt=""
            fill
            className="object-contain"
          />
        </motion.div>

        <div className="absolute top-0 right-0 w-125 h-125 lg:w-150 lg:h-150">
          <motion.div
            initial={{ opacity: 0, x: 30, y: -20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 1.4, ease: "easeOut", delay: 0.1 }}
            className="absolute top-0 right-0"
          >
            <Image
              src="/images/truBlue.svg"
              alt=""
              width={500}
              height={175.84}
              className="object-top-right object-contain"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50, y: -30 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute top-0 right-0"
          >
            <Image
              src="/images/trtBlue.svg"
              alt=""
              width={300}
              height={290.84}
              className="object-top-right object-contain"
              priority
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute -bottom-20 -right-20 w-125 h-125"
        >
          <Image
            src="/images/btrgray.svg"
            alt=""
            fill
            className="object-contain"
          />
        </motion.div>

        <div className="absolute bottom-0 left-0 w-150 h-150">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="absolute -bottom-12.5 -left-12.5"
          >
            <Image
              src="/images/orangeCircle.svg"
              alt=""
              width={400}
              height={400}
              className="object-contain"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="absolute bottom-0 left-0"
          >
            <Image
              src="/images/btBlueWave.svg"
              alt=""
              width={220.205}
              height={271.545}
              className="object-bottom-left object-contain"
              priority
            />
          </motion.div>
        </div>
      </div>

      <div className="absolute top-8 left-8 md:top-12 md:left-12 z-20">
        <Image
          src="/images/logo.webp"
          alt="HRD Event Hub Logo"
          width={180}
          height={50}
          className="h-auto w-auto max-w-35 md:max-w-45 object-contain"
          priority
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center w-full max-w-5xl mx-auto z-10 relative pt-16 lg:pt-0">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="order-2 lg:order-1 lg:col-span-5 text-center lg:text-left space-y-4 md:space-y-4"
        >
          <h2 className="text-xl pl-30 md:text-2xl font-black text-secondary tracking-wide">
            Ooops...
          </h2>
          <h1 className="text-h1 md:text-h1 lg:text-h1 font-bold text-primary tracking-tight leading-tight">
            Page not found
          </h1>
          <p className="text-secondary text-subtitle font-detail max-w-sm mx-auto lg:mx-0 leading-relaxed">
            We can&apos;t seem to find the page you&apos;re looking for. It
            might have been moved or deleted.
          </p>

          <div className="pt-2">
            <Link
              href="/"
              className="group inline-flex items-center justify-center gap-2 px-7 py-2.5 bg-[#1E3A8A] hover:bg-blue-900 text-white font-bold rounded-xl transition-all shadow-md active:scale-95 pointer-events-auto text-sm"
            >
              <MoveLeft
                size={16}
                className="group-hover:-translate-x-1 transition-transform"
              />
              Go Back
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="order-1 lg:order-2 lg:col-span-7 flex justify-center lg:justify-end items-center"
        >
          <div className="w-full max-w-120 md:max-w-145 lg:max-w-162.5 aspect-square flex items-center justify-center relative">
            <motion.div
              animate={{
                scale: [1, 1.03, 1],
                rotate: [0, 1, -1, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <div className="relative w-[85%]  rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-100 flex flex-col overflow-hidden z-10 aspect-[4/3.5]">
              <Image
                src="/images/not-found.png"
                alt="404 Animation"
                fill
                className="object-contain  select-none pointer-events-none"
                unoptimized
                priority
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
