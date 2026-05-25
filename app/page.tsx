import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";
import HeroSession from "../components/landing-page/HeroSession";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <div className="relative min-h-screen w-full bg-background flex flex-col items-center justify-center overflow-hidden py-20 px-6 md:px-12 select-none">
        <HeroSession />
      </div>
      <Footer />
    </>
  );
}
