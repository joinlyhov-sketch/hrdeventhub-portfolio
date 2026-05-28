import React from "react";
import {
  Mail,
  Calendar,
  Users,
  Code,
  Phone,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const InfoRow = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex items-center gap-3 w-full">
    <span className="text-primary shrink-0">{icon}</span>
    <span className="type-detail text-grey-900 truncate">{text}</span>
  </div>
);

interface ProfileCardProps {
  viewMode?: "ALUMNI_VIEWING_STUDENT" | "STUDENT_SELF" | "ADMIN_VIEWING";
  userRole: "STUDENT" | "ADMIN" | "ALUMNI";
}

const FemaleIcon = () => (
  <Image src={"/man.svg"} alt="man" width={18} height={18} />
);

export default function ProfileCard({ viewMode, userRole }: ProfileCardProps) {
  const handleAdminActionClick = () => {
    console.log("Admin modal triggered");
  };
  const socials = [
    {
      name: "Facebook",
      svg: (
        <Image src={"/facebook.svg"} alt="facebook" width={30} height={30} />
      ),
    },
    {
      name: "Telegram",
      svg: (
        <Image src={"/telegram.svg"} alt="telegram" width={30} height={30} />
      ),
    },
    {
      name: "GitHub",
      svg: <Image src={"/github.svg"} alt="github" width={30} height={30} />,
    },
    {
      name: "LinkedIn",
      svg: <Image src={"/linkin.svg"} alt="linkin" width={30} height={30} />,
    },
  ];

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm flex flex-col h-full w-full overflow-hidden">
      <div className="h-32 bg-primary w-full rounded-xl shrink-0" />
      <div className="px-6 pb-6 flex flex-col items-center -mt-16 w-full grow justify-between">
        <div className="w-full flex flex-col items-center">
          <div className="w-32 h-32 rounded-full border-4 border-card overflow-hidden bg-grey-100 shadow-sm mb-4 shrink-0 relative z-10">
            <img
              src="/images/profile.png"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-center w-full px-2">
            <h2 className="type-title text-primary font-bold text-xl">
              Chham Kaknika
            </h2>
            <p className="text-[20px] text-secondary mb-4 border-b pb-2.5 border-border">
              @kaknika
            </p>
            <p className="type-desc text-secondary mb-2 leading-relaxed">
              &quot;Dedicated Fullstack web Development student with a passion
              for building scalable HR solutions and strategic talent
              acquisition platforms&quot;
            </p>
          </div>

          <div className="w-full space-y-3 pt-6 text-left">
            <h3 className="type-subtitle-24 text-secondary font-semibold mb-4">
              Personal Information
            </h3>
            <InfoRow icon={<Mail size={16} />} text="kaknika@gmail.com" />
            <InfoRow icon={<Calendar size={16} />} text="12 July 2007" />
            <InfoRow icon={<Users size={16} />} text="14th Generation" />
            <InfoRow
              icon={<Code size={16} />}
              text="Fullstack web development"
            />
            <InfoRow icon={<Phone size={16} />} text="015849376" />
            <InfoRow icon={<GraduationCap size={16} />} text="Studying" />
            <InfoRow icon={<FemaleIcon />} text="Female" />
          </div>
        </div>

        <div className="w-full">
          <div className="mt-6 flex gap-3 w-full">
            {socials.map((social, i) => (
              <button
                key={i}
                aria-label={social.name}
                className="text-primary-foreground rounded-full transition-colors duration-150 cursor-pointer"
              >
                {social.svg}
              </button>
            ))}
          </div>

          <div className="mt-6 w-full">
            {userRole === "ADMIN" ? (
              <button
                onClick={handleAdminActionClick}
                className="w-full bg-destructive text-destructive-foreground py-3 rounded-md type-desc-semibold hover:opacity-90 transition-opacity font-medium cursor-pointer"
              >
                Endorse as admin
              </button>
            ) : userRole === "STUDENT" ? (
              <Link href="/profile/edit" className="block w-full">
                <button className="w-full bg-primary text-primary-foreground py-3 rounded-md type-desc-semibold hover:opacity-90 transition-opacity font-medium cursor-pointer text-center">
                  Edit Profile
                </button>
              </Link>
            ) : viewMode === "ALUMNI_VIEWING_STUDENT" ? (
              <button className="w-full bg-primary text-primary-foreground py-3 rounded-md type-desc-semibold hover:opacity-90 transition-opacity font-medium cursor-pointer">
                Endorse
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
