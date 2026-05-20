"use client";

export default function GroupMemberCard() {
  return (
    <div className="w-full bg-background rounded-[12px] border border-border p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="min-w-0">
          <h3 className="type-subtitle font-extrabold text-primary leading-tight truncate">
            Group Member
          </h3>
          <p className="type-detail-small-medium text-grey-400">60 Members</p>
        </div>
        <div className="flex items-center -space-x-2 shrink-0 select-none">
          <img
            src="https://i.pravatar.cc/100?u=1"
            className="w-8 h-8 rounded-full border-2 border-white object-cover"
            alt="m1"
          />
          <img
            src="https://i.pravatar.cc/100?u=2"
            className="w-8 h-8 rounded-full border-2 border-white object-cover"
            alt="m2"
          />
          <div className="w-8 h-8 rounded-full border-2 border-white bg-primary type-detail-small-medium text-white flex items-center justify-center font-bold">
            +57
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        {[
          { name: "Hiem Sreynit", img: "https://i.pravatar.cc/100?u=s" },
          { name: "Hort Soknika", img: "https://i.pravatar.cc/100?u=n" },
          { name: "Chham Kaknika", img: "https://i.pravatar.cc/100?u=k" },
        ].map((member, i) => (
          <div key={i} className="flex items-center gap-3 min-w-0 w-full">
            <img
              src={member.img}
              className="w-10 h-10 rounded-full object-cover shrink-0"
              alt={member.name}
            />
            <span className="type-detail-semibold text-primary grow min-w-0 truncate">
              {member.name}
            </span>
          </div>
        ))}
      </div>

      <button className="w-full bg-primary text-white py-3 rounded-2xl type-detail-semibold hover:bg-primary-hover transition-all cursor-pointer">
        View All Members
      </button>
    </div>
  );
}