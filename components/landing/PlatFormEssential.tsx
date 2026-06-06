"use client";

import React from "react";
import {
  BadgeDollarSign,
  Bell,
  CalendarHeart,
  ClipboardCheck,
  Users,
  UserRoundCog,
} from "lucide-react";
import { motion, Variants } from "framer-motion";

const cards = [
  {
    title: "Payments",
    angle: "-45deg",
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
    angle: "-25deg",
    desc: "Full lifecycle control from scheduling and room bookings to resource allocation and session tracking.",
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
      <UserRoundCog
        size={50}
        strokeWidth={2.3}
        className="-rotate-12 text-white"
      />
    ),
    iconRotate: "right-[68px] top-[50px] rotate-[-87deg]",
  },
  {
    title: "Notifications",
    desc: "Automated email, SMS, and in-app triggers to keep participants informed and actions on track.",
    position: "right-[415px] top-[700px]",
    line: "left-[120px] -translate-x-1/2 -top-[78px] border-l-2",
    card: "right-[485px] top-[440px] rotate-[68deg]",
    icon: (
      <Bell
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
    card: "right-[330px] top-[355px] rotate-[28deg]",
    icon: (
      <ClipboardCheck
        size={50}
        strokeWidth={2.3}
        className="rotate-44 text-white"
      />
    ),
    iconRotate: "right-[68px] top-[50px] rotate-[-72deg]",
  },
  {
    title: "Engagement",
    desc: "Interactive polling, Q&A sessions, and social networking features built directly into every event.",
    position: "right-[73px] top-[340px]",
    line: "left-[68px] -top-[78px] border-r-2 border-t-2",
    card: "right-[250px] top-[200px] rotate-[-5deg]",
    icon: (
      <Users size={52} strokeWidth={2.3} className="rotate-80 text-white" />
    ),
    iconRotate: "right-[68px] top-[50px] rotate-[-77deg]",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 100, damping: 15 },
  },
};

export default function PlatformEssentials() {
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

      <div className="hidden md:flex justify-center items-center w-full overflow-hidden py-4 mt-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="relative w-[1280px] h-[860px] origin-center scale-[0.56] lg:scale-[0.76] xl:scale-[0.9] 2xl:scale-100 my-[-170px] lg:my-[-100px] xl:my-[-40px] 2xl:my-0 transition-all duration-300 shrink-0"
        >
          <div className="flex justify-center py-4 overflow-visible w-full">
            <div className="relative w-[350px] h-[300px] shrink-0 origin-center scale-[0.8] min-[375px]:scale-[0.9] sm:scale-100 transition-transform">
              <div className="absolute w-[350px] h-[350px] rounded-full border-b-4 -top-[60px] left-0" />
              <div className="absolute w-[230px] h-[230px] left-[60px] top-0 bg-white rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-slate-100 flex items-center justify-center text-center p-6 transition-transform duration-300 hover:scale-105">
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

              <div className="absolute -right-[4px] top-[145px]">
                <div className="w-3.5 h-3.5 rounded-full bg-[#1C4E8D] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
              </div>
            </div>
          </div>
          {cards.map((item, index) => (
            <motion.div key={index} variants={itemVariants}>
              <div key={index}>
                <div
                  className={`absolute ${item.card} group/item hover:scale-110 duration-400 ease-in-out`}
                >
                  <div className={`absolute ${item.iconRotate}`}>
                    {item.icon}
                  </div>
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
                </div>
                <div
                  className={`absolute w-52.5 text-center ${item.position} hover:scale-110 duration-400 ease-in-out`}
                >
                  <div
                    className={`absolute h-17.5 w-10 border-[#4C67AE] ${item.line}`}
                  />

                  <div className="inline-flex h-14 items-center justify-center rounded-2xl bg-[#F1F3F6] px-6 shadow-sm">
                    <h3 className="text-[17px] font-bold text-secondary">
                      {item.title}
                    </h3>
                  </div>

                  <p className="mt-6 text-[14px] leading-7.5 text-[#5E677C]">
                    {item.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="md:hidden grid grid-cols-1 gap-6 mt-8 max-w-md mx-auto px-4"
      >
        {cards.map((item, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
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
