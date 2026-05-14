import Image from "next/image";
import AuthLayoutMotion from "../../components/auth/auth-layout-motion";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:{
    default: "Event Hub",
    template: "%s | HRD Event Hub",
  },
  description: "A platform for managing and promoting HRD events.",
};
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f5f7fc] text-[#16356f]">
      <AuthLayoutMotion />

      <div className="absolute left-[13%] top-[69%] h-16 w-16 bg-[#e3ebf8]" />
      <div className="absolute left-[26%] bottom-[10%] h-28 w-28 bg-[#dce6f4]" />
      <div className="absolute left-[43%] top-[35%] h-16 w-16 bg-[#dce6f4]" />
      <div className="absolute left-[48%] top-[45%] h-12 w-12 bg-[#edf3fb]" />
      <div className="absolute right-[5%] bottom-[7%] h-16 w-16 bg-[#edf3fb]" />
      <div className="relative z-10 flex min-h-screen flex-col px-8 py-8 lg:px-16">
        <Image
          src="/images/Logo.webp"
          alt="HRD EventHub"
          width={170}
          height={70}
          priority
          className="h-auto w-[250px]"
        />
        {children}
      </div>
    </div>
  );
}
