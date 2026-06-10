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
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-500 ease-out pointer-events-none ${scrolled ? "pt-4" : "pt-5"}`}>
        <nav
          className={`pointer-events-auto transform-gpu transition-all duration-500 ease-out flex items-center justify-between px-8 w-[92%]
          ${
            scrolled
              ? "max-w-5xl rounded-full bg-white/80 backdrop-blur-md border border-slate-300/40 shadow-lg h-16" 
              : "max-w-5/5 rounded-none bg-white border-b border-transparent shadow-none h-20" 
          }`}
        >
          <Link href="/" className="flex items-center no-underline shrink-0 transition-transform duration-300 active:scale-95">
            <Image
              src="/images/Logo.webp"
              alt="HRD Event Hub Logo"
              width={220}
              height={55}
              className={`w-auto transition-all duration-500 ease-out ${scrolled ? "h-9 md:h-11" : "h-12 md:h-15"}`}
              priority
            />
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden sm:block border border-slate-300 px-5 py-2 rounded-full text-primary hover:bg-primary hover:text-white transition-all duration-300 active:scale-95">
              Log in
            </Link>
            <Link href="/sign-up" className="hidden md:block">
              <button className="bg-primary text-white px-5 py-2 rounded-full shadow-md hover:bg-primary transition-all duration-300 active:scale-95 cursor-pointer">
                Register
              </button>
            </Link>
            <button 
              className="md:hidden text-primary p-1" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-white flex flex-col p-8 space-y-6 md:hidden animate-in fade-in slide-in-from-top-5 duration-300 z-50">
          <div className="flex justify-end">
            <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-primary"><X size={32} /></button>
          </div>
          <div className="pt-10">
            <Link href="/sign-up" onClick={() => setMobileMenuOpen(false)}>
              <button className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-xl active:scale-[0.98] transition-transform">Register</button>
            </Link>
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <button className="w-full border border-primary my-3 py-4 rounded-2xl font-bold text-xl active:scale-[0.98] transition-transform hover:cursor-pointer">Log In</button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}