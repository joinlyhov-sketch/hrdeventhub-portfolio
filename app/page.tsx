import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";
import HeroSession from "../components/landing/HeroSession";
import MediaListSection from "../components/landing/ListCard";
import PlatformEssentials from "../components/landing/PlatFormEssential";
import { FeatureCard } from "../components/landing/FeatureCard";
import { MediaItem } from "../components/landing/types";

const featuredData: MediaItem = {
  id: "feat-1",
  title: "Sport Reunion 2026: Celebrating 14th Generation",
  category: "GATHERING",
  imageUrl: "/images/sport.png",
};

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <div className="relative min-h-0 lg:min-h-screen w-full bg-background flex flex-col items-center justify-center overflow-hidden pt-24 pb-4 md:pt-28 md:pb-8 lg:py-36 px-4 md:px-8 lg:px-12 select-none">
        <HeroSession />
      </div>
      <div className="min-h-0 mx-auto lg:min-h-screen bg-background px-4 md:px-6 lg:px-8 pt-6 pb-6 md:py-12">
        <div className="mb-6">
          <h1 className="font-black leading-none text-secondary text-[22px] sm:text-[24px] md:text-[38px] lg:text-[56px]">
            Community <span className="text-action">Updates</span>
          </h1>
          <p className="type-desc text-secondary mt-2 ">
            Stay connected with the latest events, success story, and learning
            resources from the KSHRD family.
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 lg:gap-6 w-full items-stretch">
          <div className="w-full md:w-[58%] shrink-0">
            <FeatureCard item={featuredData} />
          </div>
          <div className="w-full flex-1 min-w-0">
            <MediaListSection />
          </div>
        </div>
        <PlatformEssentials />
      </div>
      <div className="mx-auto gap-12 w-full">
        <Footer />
      </div>
    </>
  );
}
