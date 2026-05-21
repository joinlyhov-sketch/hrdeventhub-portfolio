import Navbar from "../components/landing/Navbar";
import {
  Users,
  ArrowRight,
} from "lucide-react";
import Footer from "../components/landing/Footer";


export default function Home() {
  return (
    <>
      <Navbar />
      <section className="relative pt-32 pb-20 px-6 overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-cover bg-center opacity-100"
            style={{ backgroundImage: 'url("/images/bubble.webp")' }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white/80 to-amber-50 -z-10" />
        </div>

        <div className="absolute top-0 right-0 w-1/3 h-1/2 z-0 hidden lg:block">
          <img
            src="/images/bubble.webp"
            alt=""
            className="w-full h-full object-contain object-top-right opacity-100"
          />
        </div>

        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between relative z-10">
          <div className="max-w-2xl">
            <div className="inline-block px-4 py-1.5 mb-6 bg-blue-100 text-blue-700 rounded-full text-xs font-bold tracking-wide uppercase">
               KS-HRD Internal Platform
            </div>
            <h1 className="text-6xl md:text-7xl font-extrabold leading-tight mb-6 text-blue-950">
              Your Gateway to <br />
              <span className="text-amber-500">Every HRD Event</span>
            </h1>
            <p className="text-lg text-slate-500 mb-10 max-w-lg leading-relaxed">
              Discover the next big event and link up with the brightest minds
              at HRD. Your all-in-one platform for growth.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-4 bg-amber-500 text-white rounded-2xl font-bold hover:bg-amber-600 transition-all shadow-xl shadow-amber-500/30">
                Get Started
              </button>
              <button className="px-8 py-4 bg-blue-900 text-white rounded-2xl font-bold hover:bg-blue-800 transition-all shadow-xl shadow-blue-900/30 flex items-center gap-2">
                Explore Events <ArrowRight size={20} />
              </button>
            </div>
          </div>

          <div className="relative mt-20 md:mt-0">
            <div className="w-80 h-96 bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-white rotate-3">
              <img
                src="/images/landingImage.webp"
                alt="Event"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-12 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4 animate-bounce">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <Users size={20} />
              </div>
              <div>
                <p className="text-xs font-bold">Live Engagement</p>
                <p className="text-[10px] text-slate-400">
                  Active participants now
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
