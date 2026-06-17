interface ChatAvatarProps {
  name: string;
  avatarUrl?: string | null;
  size?: "sm" | "md";
}

export default function ChatAvatar({ name, avatarUrl, size = "md" }: ChatAvatarProps) {
  const dim = size === "sm" ? "w-9 h-9 text-xs" : "w-10 h-10 text-xs";
  const initials = name
    .split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "?";

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className={`${dim} rounded-full object-cover flex-shrink-0`}
      />
    );
  }

  return (
    <div className={`${dim} rounded-full bg-slate-700 text-white flex items-center justify-center font-bold flex-shrink-0`}>
      {initials}
    </div>
  );
}