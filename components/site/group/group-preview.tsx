import React from "react";
import { LockKeyhole } from "lucide-react";

export default function GroupPreview() {
  const members = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&auto=format&fit=crop",
      alt: "Member 1",
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=100&auto=format&fit=crop",
      alt: "Member 2",
    },
  ];

  return (
    <div className="flex items-center justify-center p-4">
      <div className="min-w-165 rounded-2xl border border-primary/30  bg-white p-8 sm:p-12 ">
        <div className="mb-8">
          <h1 className="text- sm:text-2xl font-bold text-secondary tracking-tight mb-3">
            Group Preview
          </h1>
          <p className="text-base sm:text-sm text-gray-700 type-detail leading-relaxed">
            You’re invited to be a part of a growing network of HRD community.
            <br className="hidden sm:inline" />
            See who’s already inside!
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-1.5 bg-[#E7EEFA] text-secondary px-4 py-1.5 rounded-full type-desc-small-semibold">
              <LockKeyhole className="w-2.5 h-2.5 " />
              <span>Private</span>
            </div>
            <div className="flex items-center -space-x-2">
              {members.map((member) => (
                <img
                  key={member.id}
                  className="w-7 h-7 rounded-full border-2 border-white object-cover"
                  src={member.src}
                  alt={member.alt}
                />
              ))}
              <div className="p-2 flex items-center justify-center w-7 h-7 rounded-full border-2 border-white bg-[#dbeafe] text-primary type-desc-small-semibold ">
                +49
              </div>
            </div>
          </div>
          <div className="mb-8">
            <h2 className="type-title sm:text-lg mb-3">
              <span className="bg-gradient-to-r from-[#1C4D8D] to-[#FFA02E] bg-clip-text type-subtitle-24  text-transparent">
                <b>14th Generation Group</b>
              </span>
            </h2>
            <p className="text-base text-secondary max-w-md type-desc-small-semibold leading-relaxed ">
              Connect with the 14th generation
              <br /> and grow your network.
            </p>
          </div>

          <hr className="border-slate-200 my-6" />
          <div className="flex items-center justify-end gap-x-2 mt-6">
            <button className="w-36.5 px-8 py-1.5 rounded-lg border border-secondary text-primary font-desc-semibold text-base hover:bg-slate-50 transition-colors duration-200">
              Cancel
            </button>
            <button
              className="w-fit px-8 py-1.5 rounded-lg text-white font-desc-semibold text-base transition-colors duration-200"
              style={{
                background:
                  "linear-gradient(to right, #1a7a8a 0%, #1a5a82 0%, #1C4D8D 70%, #152d6e 100%)",
              }}
            >
              Join Group
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
