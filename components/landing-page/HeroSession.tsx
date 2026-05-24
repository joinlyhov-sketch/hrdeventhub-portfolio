import React from "react";
import { Heart } from "lucide-react";

export default function HeroSession() {
  return (
    <>
      <section className="bg-white text-[#17191C] w-full min-h-screen flex flex-col justify-between relative overflow-hidden px-6 py-12 md:px-12 lg:px-24 select-none">
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden hidden md:block">
          <svg
            className="absolute w-full h-full left-0 top-0"
            viewBox="0 0 1440 900"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M -50 490 C 120 520, 160 410, 240 550 C 320 690, 480 770, 640 620 C 800 470, 980 340, 1140 370 C 1280 400, 1360 520, 1500 500"
              stroke="#1C4E8D"
              strokeWidth="2"
              strokeDasharray="6 6"
              strokeOpacity="0.25"
              fill="none"
            />
          </svg>

          <div className="absolute left-[5%] top-[28%] border border-seconary/20 text-primary/70 w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm">
            <span className="font-semibold">$</span>
          </div>

          <div className="absolute right-[6%] top-[26%] bg-primary border border-white text-white w-11 h-11 rounded-full flex items-center justify-center shadow-lg">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>

          <div className="absolute right-[5%] bottom-[30%] bg-action border border-white text-white w-11 h-11 rounded-full flex items-center justify-center shadow-lg">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-7xl mx-auto my-8 relative z-10 w-full">
          <h2 className="type-title 28px Bold Post titles, card main headings text-action mb-3 tracking-wide">
            Bring Together <span className="text-secondary">Alumni</span> &amp;{" "}
            <span className="text-secondary">Student</span>
          </h2>

          <h1 className="type-h1 text-seconary mb-6 max-w-4xl tracking-tight leading-none">
            Your Gateway{" "}
            <span className="text-primary">to Every HRD Event</span>{" "}
          </h1>

          <p className="type-desc text-secondary max-w-3xl px-6 mb-12 leading-relaxed">
            Your all-in-one platform for event registration, group
            collaboration, and career-ready growth.
            Discover the next big event and
            link up with the brightest minds at HRD.
          </p>

          <div className="relative w-full max-w-5xl mx-auto h-[480px] flex items-center justify-center mt-6">
            <div className="absolute md:left-[-3%] w-[33%] rotate-[-15deg] translate-y-16 box-border z-30">
              <div className="w-full">
                <img
                  src="/images/HeroSession1.png"
                  alt="HRD Student Event Assembly"
                  className="w-full h-auto block rotate-[15deg]"
                />
              </div>
            </div>

            <div className="absolute w-[48%] z-20">
              <div className="absolute -top-3 right-8 bg-white border border-border rounded-full p-2 shadow-md z-30 flex items-center justify-center">
                <Heart className="w-4 h-4 fill-current text-destructive" />
              </div>
              <div className="w-full overflow-hidden rounded-xl">
                <img
                  src="/images/HeroSession2.png"
                  alt="HRD Main Event Group Photo"
                  className="w-full h-auto block"
                />
              </div>
            </div>

            <div className="absolute right-[2%] md:right-[-3%] w-[35%] rotate-12 translate-y-15 z-10">
              <div className="w-full overflow-hidden rounded-xl">
                <img
                  src="/images/HeroSession3.png"
                  alt="HRD Campus Community Event"
                  className="w-full h-auto block rotate-[-15deg]"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-5xl mx-auto border-t border-border/60 pt-8 mt-16 z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 md:gap-y-0 items-center justify-center text-center">
            <div className="flex flex-col items-center gap-2.5 md:border-r border-border/60 last:border-none px-6">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-primary shadow-sm">
                <svg
                  width="44"
                  height="44"
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
              <h3 className="type-subtitle-24 text-secondary">
                Digital Payment
              </h3>
            </div>

            <div className="flex flex-col items-center gap-2.5 md:border-r border-border/60 last:border-none px-6">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-primary shadow-sm">
                <svg
                  width="44"
                  height="44"
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
              <h3 className="type-subtitle-24 text-secondary">
                Event Management
              </h3>
            </div>

            <div className="flex flex-col items-center gap-2.5 px-6">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-primary shadow-sm">
                <svg
                  width="44"
                  height="44"
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
              <h3 className="type-subtitle-24 text-secondary">
                Community Engagement
              </h3>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
