import AuthHeroSection from "../../../components/auth/auth-hero-section";
import LoginComponent from "../../../components/auth/Login/login-component";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Login",
};
export default function page() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="flex items-center gap-20 justify-center w-full max-w-[1400px]">
        <div className="flex-1 min-w-0">
          <AuthHeroSection />
        </div>
        <div className="shrink-0">
          <LoginComponent />
        </div>
      </div>
    </div>
  );
}
