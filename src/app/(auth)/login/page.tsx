import React from 'react'
import { Variants ,motion } from "framer-motion";
import { h1 } from 'motion/react-client';
import AuthHeroSection from '@/components/auth/AuthHeroSection';
import LoginComponent from '@/components/auth/Login/LoginComponent';

export default function page() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="flex items-center gap-20 justify-center w-full max-w-[1400px]">
        <div className="flex-1 min-w-0">
          <AuthHeroSection />
        </div>
        <div className="shrink-0">
          <LoginComponent />
        </div>
      </div>
    </div>
  );
}