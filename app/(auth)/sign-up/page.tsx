import AuthHeroSection from "../../../components/auth/auth-hero-section";
import RegisterComponent from "../../../components/auth/register";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default function page() {
  return (
    <div className="flex flex-1 items-center justify-center px-3 py-4 sm:px-4 sm:py-8 md:py-12">
      <div className="flex flex-col xl:flex-row items-center gap-8 xl:gap-20 justify-center w-full max-w-[1400px]">
        <div className="hidden md:block w-full xl:flex-1 xl:min-w-0">
          <AuthHeroSection />
        </div>
        <div className="w-full sm:max-w-[625px] xl:shrink-0 xl:w-[625px] xl:max-w-none">
          <RegisterComponent />
        </div>
      </div>
    </div>
  );
}