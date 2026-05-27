"use client";
import { motion } from "framer-motion";
import NextImage from "next/image";

export default function AuthLayoutMotion() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2 }}
        className="absolute -top-20 -left-20 w-[400px] h-[400px]"
      >
        <NextImage
          src="/images/tlblur.svg"
          alt=""
          fill
          className="object-contain"
        />
      </motion.div>

      <div className="absolute top-0 right-0 w-[500px] h-[500px] lg:w-[600px] lg:h-[600px]">
        <motion.div
          initial={{ opacity: 0, x: 30, y: -20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 1.4, ease: "easeOut", delay: 0.1 }}
          className="absolute top-0 right-0"
        >
          <NextImage
            src="/images/truBlue.svg"
            alt=""
            width={500}
            height={175.84}
            className="object-right-top object-contain"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50, y: -30 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute top-0 right-0"
        >
          <NextImage
            src="/images/trtBlue.svg"
            alt=""
            width={300}
            height={290.84}
            className="object-right-top object-contain"
            priority
          />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute -bottom-20 -right-20 w-[500px] h-[500px]"
      >
        <NextImage
          src="/images/btrgray.svg"
          alt=""
          fill
          className="object-contain"
        />
      </motion.div>

      <div className="absolute bottom-0 left-0 w-[600px] h-[600px]">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="absolute bottom-[-50px] left-[-50px]"
        >
          <NextImage
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
          <NextImage
            src="/images/btBlueWave.svg"
            alt=""
            width={220.205}
            height={271.545}
            className="object-left-bottom object-contain"
            priority
          />
        </motion.div>
      </div>
    </div>
  );
}
