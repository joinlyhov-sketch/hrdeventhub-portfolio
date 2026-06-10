"use client";

import React, { useRef } from "react";
import {
  BadgeDollarSign,
  CalendarHeart,
  UserRoundKey,
  BellRing,
  Vote,
} from "lucide-react";
import { motion, Variants, useInView } from "framer-motion";

const cards = [
  {
    title: "Payments",
    desc: "Secure enterprise-grade payment processing for paid workshops and certification courses.",
    position: "left-[45px] top-[345px]",
    line: "left-[98px] -top-[78px] border-l-2 border-t-2",
    card: "left-[210px] top-[170px] rotate-[-200deg]",
    icon: (
      <BadgeDollarSign
        size={52}
        strokeWidth={2.3}
        className="rotate-[-75.9deg] text-white"
      />
    ),
    iconRotate: "right-[70px] top-[50px] rotate-[95deg]",
  },
  {
    title: "Event Management",
    desc: "Full lifecycle control in an Event Management System handles planning, scheduling and tracking in one platform for smooth event operations.",
    position: "left-[175px] top-[585px]",
    line: "left-[98px] -top-[72px] border-l-2 border-t-2",
    card: "left-[280px] top-[330px] rotate-[-233deg]",
    icon: (
      <CalendarHeart
        size={50}
        strokeWidth={2.3}
        className="rotate-12 text-white"
      />
    ),
    iconRotate: "right-[68px] top-[50px] rotate-[-80deg]",
  },
  {
    title: "User Roles",
    desc: "Granular permission system for organizers, trainers, attendees, and executive stakeholders.",
    position: "left-[400px] top-[700px]",
    line: "left-[125px] -translate-x-1/2 -top-[78px] border-l-2",
    card: "left-[425px] top-[428px] rotate-[-265deg]",
    icon: (
      <UserRoundKey
        size={50}
        strokeWidth={2.3}
        className="-rotate-12 text-white"
      />
    ),
    iconRotate: "right-[68px] top-[50px] rotate-[-87deg]",
  },
  {
    title: "Notifications",
    desc: "Automated SMS notifications keep participants informed with reminders, updates, and important event alerts in real time.",
    position: "right-[415px] top-[700px]",
    line: "left-[120px] -translate-x-1/2 -top-[78px] border-l-2",
    card: "right-[485px] top-[440px] rotate-[68deg]",
    icon: (
      <BellRing
        size={52}
        strokeWidth={2.3}
        className="rotate-[-44deg] text-white"
      />
    ),
    iconRotate: "right-[68px] top-[50px] rotate-[-35deg]",
  },
  {
    title: "Survey & Polls",
    desc: "A central hub for HRD organizers to gather feedback and student opinions.",
    position: "right-[210px] top-[575px]",
    line: "left-[78px] -top-[72px] border-r-2 border-t-2",
    card: "right-[310px] top-[350px] rotate-[28deg]",
    icon: <Vote size={50} strokeWidth={2.3} className="rotate-44 text-white" />,
    iconRotate: "right-[68px] top-[50px] rotate-[-72deg]",
  },
  {
    title: "Engagement",
    desc: "Interactive polling, Q&A sessions, and social networking features built directly into every event.",
    position: "right-[60px] top-[370px]",
    line: "left-[68px] -top-[80px] border-r-2 border-t-2",
    card: "right-[230px] top-[200px] rotate-[-5deg]",
    icon: (
      <svg
        className="rotate-[75.9deg] text-white"
        width="51"
        height="37"
        viewBox="0 0 51 37"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0.501451 36.7967L0.301381 27.7362C0.273038 26.4527 0.695441 25.3669 1.56859 24.4789C2.44174 23.5909 3.50484 23.133 4.75789 23.1054L12.2192 22.9406C12.9787 22.9238 13.7043 23.0967 14.3961 23.4591C15.0879 23.8215 15.6498 24.319 16.0816 24.9516C17.2153 26.3996 18.5982 27.5211 20.2303 28.316C21.8624 29.1109 23.5898 29.4882 25.4124 29.448C27.273 29.4069 29.001 28.9533 30.5964 28.0871C32.1919 27.2209 33.5049 26.0399 34.5356 24.5441C35.0151 23.8914 35.5829 23.369 36.239 22.9768C36.8952 22.5846 37.584 22.3805 38.3055 22.3646L45.7668 22.1998C47.0578 22.1713 48.1496 22.5816 49.0421 23.4306C49.9346 24.2796 50.395 25.3459 50.4234 26.6295L50.6235 35.69L34.6755 36.0421L34.5618 30.889C33.2536 31.8621 31.836 32.6111 30.309 33.1358C28.782 33.6605 27.1832 33.9413 25.5124 33.9782C23.8797 34.0143 22.2793 33.7947 20.7112 33.3194C19.1431 32.8441 17.6842 32.1493 16.3343 31.2348L16.4494 36.4446L0.501451 36.7967ZM25.3624 27.1828C23.9195 27.2147 22.5452 26.9146 21.2396 26.2824C19.934 25.6503 18.8316 24.7587 17.9324 23.6076C17.2661 22.6781 16.4427 21.9503 15.4624 21.4243C14.482 20.8982 13.4223 20.6478 12.2831 20.673C13.0877 19.2577 14.8289 18.1144 17.507 17.2432C20.185 16.372 22.7201 15.91 25.1123 15.8572C27.5045 15.8044 30.0575 16.154 32.7714 16.9062C35.4853 17.6583 37.2753 18.7236 38.1415 20.102C37.0404 20.1263 36.0022 20.423 35.027 20.9922C34.0519 21.5615 33.252 22.3251 32.6273 23.2831C31.8186 24.5097 30.7758 25.4581 29.499 26.1284C28.2221 26.7987 26.8433 27.1501 25.3624 27.1828ZM6.98615 20.7899C5.08759 20.8318 3.45922 20.2068 2.10105 18.9148C0.742883 17.6229 0.0429577 16.0331 0.0012765 14.1455C-0.0412383 12.2201 0.58762 10.5915 1.88785 9.25973C3.18809 7.92793 4.78748 7.24107 6.68604 7.19915C8.62257 7.15639 10.2602 7.77177 11.599 9.04529C12.9378 10.3188 13.6284 11.9183 13.6709 13.8436C13.7126 15.7312 13.093 17.3502 11.8122 18.7004C10.5314 20.0507 8.92268 20.7472 6.98615 20.7899ZM43.4385 19.985C41.5399 20.0269 39.9116 19.4019 38.5534 18.1099C37.1952 16.8179 36.4953 15.2281 36.4536 13.3405C36.4111 11.4152 37.04 9.7866 38.3402 8.4548C39.6404 7.12301 41.2398 6.43615 43.1384 6.39423C45.0749 6.35147 46.7126 6.96685 48.0514 8.24037C49.3901 9.51389 50.0808 11.1133 50.1233 13.0387C50.165 14.9263 49.5454 16.5452 48.2646 17.8955C46.9837 19.2457 45.375 19.9422 43.4385 19.985ZM25.0623 13.5921C23.1637 13.634 21.5354 13.009 20.1772 11.717C18.819 10.425 18.1191 8.83522 18.0774 6.94761C18.0349 5.02225 18.6637 3.39368 19.964 2.06188C21.2642 0.730085 22.8636 0.0432261 24.7622 0.00130305C26.6987 -0.0414585 28.3364 0.573922 29.6751 1.84744C31.0139 3.12097 31.7045 4.72041 31.747 6.64577C31.7887 8.53337 31.1691 10.1523 29.8883 11.5026C28.6075 12.8528 26.9988 13.5493 25.0623 13.5921Z"
          fill="#E1F1FD"
        />
      </svg>
    ),
    iconRotate: "right-[68px] top-[50px] rotate-[-77deg]",
  },
];

const START_DELAY = 0.4;
const CARD_GAP = 0.25;

function AnimatedCard({
  item,
  index,
  sectionInView,
}: {
  item: (typeof cards)[0];
  index: number;
  sectionInView: boolean;
}) {
  const currentDelay = START_DELAY + index * CARD_GAP;

  return (
    <>
      <motion.div
        className={`absolute ${item.card} group/item hover:scale-110 duration-300 ease-out`}
        initial={{ opacity: 0, x: -50, scale: 0.85 }}
        animate={
          sectionInView
            ? { opacity: 1, x: 0, scale: 1 }
            : { opacity: 0, x: -50, scale: 0.85 }
        }
        transition={{
          delay: currentDelay,
          type: "spring",
          stiffness: 90,
          damping: 18,
          mass: 0.9,
        }}
      >
        <div className={`absolute ${item.iconRotate}`}>{item.icon}</div>
        <svg
          width="189"
          height="182"
          viewBox="0 0 189 182"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14.3996 124.326C3.14431 118.705 -2.47852 105.837 1.04272 93.759L1.34996 92.7052C7.17634 72.7202 11.0028 52.2059 12.7729 31.4643C13.8253 19.1335 23.6941 9.40195 36.0384 8.52244L154.452 0.0857544C173.067 -1.24057 188.864 13.5799 188.725 32.2422L188.708 34.5703C188.39 77.3872 181.162 119.872 167.301 160.384C161.067 178.605 140.203 187.156 122.975 178.552L14.3996 124.326Z"
            fill="url(#paint0_linear_56166_226204)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_56166_226204"
              x1="112.491"
              y1="-15.4377"
              x2="78.8221"
              y2="181.708"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#102B58" />
              <stop offset="1" stopColor="#1C4D8D" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      <motion.div
        className={`absolute w-52.5 text-center ${item.position} hover:scale-105 duration-300 ease-out`}
        initial={{ opacity: 0, x: -30 }}
        animate={sectionInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
        transition={{
          delay: currentDelay + 0.08,
          type: "spring",
          stiffness: 85,
          damping: 16,
        }}
      >
        <div className={`absolute h-17.5 w-10 border-[#4C67AE] ${item.line}`} />
        <div className="inline-flex h-14 items-center justify-center rounded-2xl bg-[#F1F3F6] px-6 shadow-sm">
          <h3 className="text-[17px] font-bold text-secondary">{item.title}</h3>
        </div>
        <p className="mt-6 text-[14px] leading-7.5 text-[#5E677C]">
          {item.desc}
        </p>
      </motion.div>
    </>
  );
}

const mobileContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const mobileItemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 110, damping: 17 },
  },
};

export default function PlatformEssentials() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const sectionInView = useInView(sectionRef, { once: true, amount: 0.15 });

  return (
    <section className="min-h-0 lg:min-h-screen overflow-hidden py-8 lg:py-14 mb-10 lg:mb-25 mt-6 lg:mt-12">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="font-black leading-none text-secondary text-[24px] md:text-[56px]">
          <span className="text-primary">Platform </span>
          <span className="text-action">Essentials</span>
        </h1>
        <p className="mx-auto mt-5 max-w-212.5 type-detail font-medium leading-8 text-primary">
          A streamlined suite of internal tools designed to help HRD students
          discover events, manage payments, and engage with the community in one
          secure place.
        </p>
      </div>

      <div
        ref={sectionRef}
        className="hidden md:flex justify-center items-center w-full overflow-hidden py-4 mt-8"
      >
        <div className="relative w-[1280px] h-[860px] origin-center scale-[0.56] lg:scale-[0.76] xl:scale-[0.9] 2xl:scale-100 my-[-170px] lg:my-[-100px] xl:my-[-40px] 2xl:my-0 transition-all duration-300 shrink-0">
          <div className="flex justify-center py-24 overflow-visible w-full">
            <motion.div
              className="relative w-[350px] h-[300px] shrink-0 origin-center scale-[0.8] min-[375px]:scale-[0.9] sm:scale-100 transition-transform"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={
                sectionInView
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: 0.8 }
              }
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 16,
                delay: 0.1,
              }}
            >
              <div className="absolute w-[350px] h-[350px] rounded-full border-b-4 -top-[60px] left-0" />
              <div className="absolute w-[230px] h-[230px] left-[60px] bg-white rounded-full border border-slate-100 flex items-center justify-center text-center p-6 transition-transform duration-300 hover:scale-105">
                <h2 className="text-center text-[24px] font-black leading-tight text-primary">
                  Core
                  <br />
                  Capabilities
                </h2>
              </div>

              <div className="absolute -left-[3px] top-[135px]">
                <div className="w-3.5 h-3.5 rounded-full bg-[#1C4E8D] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
              </div>
              <div className="absolute left-[40px] top-[225px]">
                <div className="w-3.5 h-3.5 rounded-full bg-[#1C4E8D] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
              </div>
              <div className="absolute left-[169px] top-[282px]">
                <div className="w-3.5 h-3.5 rounded-full bg-[#1C4E8D] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
              </div>
              <div className="absolute right-[49px] top-[235px]">
                <div className="w-3.5 h-3.5 rounded-full bg-[#1C4E8D] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
              </div>
              <div className="absolute -right-[3px] top-[145px]">
                <div className="w-3.5 h-3.5 rounded-full bg-[#1C4E8D] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
              </div>
            </motion.div>
          </div>

          {cards.map((item, index) => (
            <AnimatedCard
              key={index}
              item={item}
              index={index}
              sectionInView={sectionInView}
            />
          ))}
        </div>
      </div>

      <motion.div
        variants={mobileContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        className="md:hidden grid grid-cols-1 gap-6 mt-8 max-w-md mx-auto px-4"
      >
        {cards.map((item, index) => (
          <motion.div
            key={index}
            variants={mobileItemVariants}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#1C4E8D] flex items-center justify-center mb-4 text-white shadow-inner">
              {React.cloneElement(item.icon, {
                className: "text-white w-7 h-7 rotate-0",
                size: 28,
              })}
            </div>
            <h3 className="text-[17px] font-bold text-secondary mb-2">
              {item.title}
            </h3>
            <p className="text-[14px] leading-relaxed text-[#5E677C]">
              {item.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}