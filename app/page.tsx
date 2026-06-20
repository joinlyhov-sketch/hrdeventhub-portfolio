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
      <div className="relative min-h-0 lg:min-h-screen w-full bg-background flex flex-col items-center justify-center overflow-hidden pt-28 pb-6 md:pt-32 md:pb-16 lg:py-36 px-6 md:px-12 select-none">
        <HeroSession />
      </div>
      <div className="min-h-0 mx-auto lg:min-h-screen bg-background px-4 md:px-12 lg:px-32 pt-6 pb-6 md:py-12">
        <div className="mb-6 ml-0 md:ml-6 lg:ml-18">
          <h1 className="font-black leading-none text-secondary text-[22px] sm:text-[24px] md:text-[56px]">
            Community <span className="text-action">Updates</span>
          </h1>
          <p className="type-desc text-secondary mt-2 ">
            Stay connected with the latest events, success story, and learning
            resources from the KSHRD family.
          </p>
        </div>
        <div className="mx-auto">
          <div className="flex flex-col md:flex-row gap-6 justify-center w-full">
            <div className="w-full md:w-[50%] shrink-0">
              <FeatureCard item={featuredData} />
            </div>
            <div className="w-full md:w-[40%] shrink-0">
              <MediaListSection />
            </div>
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
