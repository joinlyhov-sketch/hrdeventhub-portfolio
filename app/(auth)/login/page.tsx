import AuthHeroSection from "../../../components/auth/auth-hero-section";
import LoginComponent from "../../../components/auth/Login/login-component";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
};

export default function page() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-8 md:py-12">
      <div className="flex flex-col xl:flex-row items-center gap-8 xl:gap-20 justify-center w-full max-w-[1400px]">
        <div className="hidden md:block w-full xl:flex-1 xl:min-w-0">
          <AuthHeroSection />
        </div>
        <div className="w-full sm:max-w-[625px] xl:shrink-0 xl:w-[625px] xl:max-w-none">
          <LoginComponent />
        </div>
      </div>
    </div>
  );
}
