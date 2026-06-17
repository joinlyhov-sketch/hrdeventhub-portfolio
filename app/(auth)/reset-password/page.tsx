import ResetPasswordComponent from "../../../components/auth/reset-password";
import AuthHeroSection from "../../../components/auth/auth-hero-section";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password",
};

export default function page() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-8 md:py-12">
      <div className="flex flex-col xl:flex-row items-center gap-8 xl:gap-20 justify-center w-full max-w-[1400px]">
        <div className="hidden md:block w-full xl:flex-1 xl:min-w-0">
          <AuthHeroSection />
        </div>
        <div className="w-full sm:max-w-[715px] xl:shrink-0 xl:w-[715px] xl:max-w-none">
          <ResetPasswordComponent />
        </div>
      </div>
    </div>
  );
}