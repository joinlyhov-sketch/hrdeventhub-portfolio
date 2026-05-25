import React from "react";
import { Heart } from "lucide-react";

export default function HeroSession() {
  return (
    <>
      <section className="relative w-full h-full bg-white text-seconary flex flex-col justify-between select-none">
        <div className="absolute top-[15%] -left-32 w-80 h-80 bg-[#7FAEF5]/20 rounded-full blur-[90px] pointer-events-none z-0 hidden md:block" />
        <div className="absolute top-[10%] -right-40 w-[450] h-[450] bg-[#7FAEF5]/25 rounded-full blur-[110px] pointer-events-none z-0 hidden md:block" />

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

          <div className="absolute left-[5%] top-[28%] text-primary/70 w-10 h-10 rounded-full flex items-center justify-center shadow-sm">
            <svg
              width="76"
              height="76"
              viewBox="0 0 76 76"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M28.1935 38.7452C26.8093 41.3958 27.7275 44.595 30.2548 45.9148L35.4121 48.6081C37.6106 49.7562 40.3747 48.82 41.5765 46.5187C42.8856 44.0119 42.258 42.5597 40.9352 41.1367L34.1569 33.9358C32.8342 32.5128 32.2066 31.0606 33.5157 28.5539C34.7174 26.2526 37.4815 25.3163 39.68 26.4645L44.8373 29.1578C47.3646 30.4776 48.2829 33.6768 46.8987 36.3273"
                stroke="url(#paint0_linear_4386_136289)"
                strokeWidth="1.5"
                strokeLinecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M43.9712 25.2031L31.095 49.8596"
                stroke="url(#paint1_linear_4386_136289)"
                strokeWidth="1.5"
                strokeLinecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M26.8021 58.0822C38.1499 64.0083 52.1532 59.6131 58.0793 48.2653C64.0055 36.9175 59.6103 22.9141 48.2625 16.988C36.9146 11.0619 22.9113 15.4571 16.9852 26.8049C11.059 38.1527 15.4542 52.1561 26.8021 58.0822Z"
                stroke="url(#paint2_linear_4386_136289)"
                strokeWidth="1.5"
                strokeLinecap="round"
                stroke-linejoin="round"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_4386_136289"
                  x1="32.5458"
                  y1="47.1112"
                  x2="42.5463"
                  y2="27.9613"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#1C4D8D" />
                  <stop offset="1" stop-color="#FFA02E" />
                </linearGradient>
                <linearGradient
                  id="paint1_linear_4386_136289"
                  x1="31.5382"
                  y1="50.0911"
                  x2="44.4144"
                  y2="25.4346"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#1C4D8D" />
                  <stop offset="1" stop-color="#FFA02E" />
                </linearGradient>
                <linearGradient
                  id="paint2_linear_4386_136289"
                  x1="26.8021"
                  y1="58.0822"
                  x2="48.2625"
                  y2="16.988"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#1C4D8D" />
                  <stop offset="1" stop-color="#FFA02E" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="absolute right-[6%] top-[26%] bg-primary border border-white text-white w-11 h-11 rounded-full flex items-center justify-center shadow-lg">
            <svg
              width="30"
              height="30"
              viewBox="0 0 30 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.4996 8.95C22.4246 8.9375 22.3371 8.9375 22.2621 8.95C20.5371 8.8875 19.1621 7.475 19.1621 5.725C19.1621 3.9375 20.5996 2.5 22.3871 2.5C24.1746 2.5 25.6121 3.95 25.6121 5.725C25.5996 7.475 24.2246 8.8875 22.4996 8.95Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M21.2113 18.0502C22.9238 18.3377 24.8113 18.0377 26.1363 17.1502C27.8988 15.9752 27.8988 14.0502 26.1363 12.8752C24.7988 11.9877 22.8863 11.6877 21.1738 11.9877"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M7.46406 8.95C7.53906 8.9375 7.62656 8.9375 7.70156 8.95C9.42656 8.8875 10.8016 7.475 10.8016 5.725C10.8016 3.9375 9.36406 2.5 7.57656 2.5C5.78906 2.5 4.35156 3.95 4.35156 5.725C4.36406 7.475 5.73906 8.8875 7.46406 8.95Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M8.75078 18.0502C7.03828 18.3377 5.15078 18.0377 3.82578 17.1502C2.06328 15.9752 2.06328 14.0502 3.82578 12.8752C5.16328 11.9877 7.07578 11.6877 8.78828 11.9877"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M14.9996 18.2859C14.9246 18.2734 14.8371 18.2734 14.7621 18.2859C13.0371 18.2234 11.6621 16.8109 11.6621 15.0609C11.6621 13.2734 13.0996 11.8359 14.8871 11.8359C16.6746 11.8359 18.1121 13.2859 18.1121 15.0609C18.0996 16.8109 16.7246 18.2359 14.9996 18.2859Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M11.3629 22.2203C9.60039 23.3953 9.60039 25.3203 11.3629 26.4953C13.3629 27.8328 16.6379 27.8328 18.6379 26.4953C20.4004 25.3203 20.4004 23.3953 18.6379 22.2203C16.6504 20.8953 13.3629 20.8953 11.3629 22.2203Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>

          <div className="absolute right-[5%] bottom-[30%] bg-action text-white w-11 h-11 rounded-full flex items-center justify-center shadow-lg">
            <svg width="71" height="71" viewBox="0 0 71 71" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="28.2741" y="0.692859" width="50" height="50" rx="25" transform="rotate(33.4786 28.2741 0.692859)" fill="#FF9F2E" />
              <rect x="28.2741" y="0.692859" width="50" height="50" rx="25" transform="rotate(33.4786 28.2741 0.692859)" stroke="white" />
              <path d="M38.0606 22.1484L35.992 25.2763" stroke="white" strokeWidth="2" stroke-miterlimit="10" strokeLinecap="round" stroke-linejoin="round" />
              <path d="M46.4024 27.6641L44.3338 30.7919" stroke="white" strokeWidth="2" stroke-miterlimit="10" strokeLinecap="round" stroke-linejoin="round" />
              <path d="M35.3199 49.4105C37.1626 50.6291 39.6442 50.1233 40.8628 48.2806C42.0814 46.438 41.5756 43.9564 39.7329 42.7378C37.8903 41.5191 35.4087 42.025 34.1901 43.8676C32.9714 45.7103 33.4773 48.1919 35.3199 49.4105Z" stroke="white" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" />
              <path d="M38.8688 52.654L38.5157 50.9219" stroke="white" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" />
              <path d="M28.4806 26.4375L46.205 38.1595" stroke="white" strokeWidth="2" stroke-miterlimit="10" strokeLinecap="round" stroke-linejoin="round" />
              <path d="M29.8701 46.7044L24.2713 43.0017C20.6221 40.5883 20.4373 37.4688 22.5059 34.3409L28.3669 25.4787C30.4355 22.3509 33.3785 21.2999 37.0276 23.7133L45.3685 29.2295C49.0177 31.6429 49.2025 34.7624 47.134 37.8903L44.0311 42.582" stroke="white" strokeWidth="2" stroke-miterlimit="10" strokeLinecap="round" stroke-linejoin="round" />
              <path d="M34.1592 37.1045L34.1686 37.1107" stroke="white" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" />
              <path d="M30.3018 34.5498L30.3111 34.556" stroke="white" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" />
              <path d="M28.2315 37.6748L28.2408 37.681" stroke="white" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" />
            </svg>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-7xl mx-auto my-8 relative z-10 w-full">
          <h2 className="type-title text-action mb-3 tracking-wide font-bold">
            Bring Together <span className="text-secondary">Alumni</span> &amp;{" "}
            <span className="text-secondary">Student</span>
          </h2>

          <h1 className="type-h1 text-seconary mb-6 max-w-4xl tracking-tight leading-none">
            Your Gateway{" "}
            <span className="text-primary">to Every HRD Event</span>{" "}
          </h1>

          <p className="type-desc text-secondary max-w-3xl px-6 mb-12 leading-relaxed">
            Your all-in-one platform for event registration, group
            collaboration, and career-ready growth. Discover the next big event
            and link up with the brightest minds at HRD.
          </p>

          <div className="relative w-full max-w-5xl mx-auto h-[480] flex items-center justify-center mt-6">
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

