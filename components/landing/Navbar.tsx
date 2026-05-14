"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 flex justify-center pt-4 pointer-events-none">
        <nav
          className={`pointer-events-auto transform-gpu transition-all duration-400 ease-[cubic-bezier(0.23,1,0.32,1)] flex items-center justify-between px-6
          ${
            scrolled
              ? "w-full max-w-none rounded-none bg-white/90 backdrop-blur-xl shadow-sm border-b border-slate-200/50 h-16 mt-[-16px]" 
              : "w-[90%] max-w-5xl rounded-full bg-white/80 backdrop-blur-md border border-white/40 shadow-lg h-14 mt-0"
          }`}
        >
          <Link href="/" className="flex items-center gap-1.5 no-underline shrink-0 transition-transform duration-300 active:scale-95">
            <Image
              src="/images/Logo.webp"
              alt="HRD Event Hub Logo"
              width={160}
              height={40}
              className="w-auto h-8 md:h-10 transition-all duration-500"
            />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {["Event", "Calendar", "About Us"].map((item) => (
              <Link 
                key={item}
                href={`/${item.toLowerCase().replace(/\s+/g, '')}`} 
                className="text-md font-bold text-[#0F2B54] hover:text-[#FF9F2E] transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FF9F2E] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden sm:block text-xs font-bold border border-[#0F2B54] px-5 py-2 rounded-full text-[#0F2B54] hover:bg-[#0F2B54] hover:text-white transition-all active:scale-95">
              Log in
            </Link>
            <Link href="/sign-up">
              <button className="bg-[#0F2B54] text-white px-5 py-2 rounded-full font-bold text-xs shadow-md hover:bg-[#1a3a6b] transition-all active:scale-95 cursor-pointer">
                Register
              </button>
            </Link>
            <button 
              className="md:hidden text-[#0F2B54] p-1" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-white flex flex-col p-8 space-y-6 md:hidden animate-in fade-in slide-in-from-top-5 duration-300">
          <div className="flex justify-end">
            <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-[#0F2B54]"><X size={32} /></button>
          </div>
          <Link href="/event" className="text-3xl font-black text-[#0F2B54]" onClick={() => setMobileMenuOpen(false)}>Event</Link>
          <Link href="/calendar" className="text-3xl font-black text-[#0F2B54]" onClick={() => setMobileMenuOpen(false)}>Calendar</Link>
          <Link href="/about" className="text-3xl font-black text-[#0F2B54]" onClick={() => setMobileMenuOpen(false)}>About Us</Link>
          <Link href="/contact" className="text-3xl font-black text-[#0F2B54]" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
          <div className="pt-10">
            <Link href="/sign-up" onClick={() => setMobileMenuOpen(false)}>
              <button className="w-full bg-[#0F2B54] text-white py-4 rounded-2xl font-bold text-xl active:scale-[0.98] transition-transform">Sign Up</button>
            </Link>
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <button className="w-full  border-1 border-[#0F2B54] my-3 py-4 rounded-2xl font-bold text-xl active:scale-[0.98] transition-transform hover:cursor-pointer">login</button>
            </Link>
            
          </div>
        </div>
      )}
    </>
  );
}