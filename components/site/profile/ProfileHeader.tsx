"use client";

interface ProfileHeaderProps {
  description: string;
  titlePrimary: string;
}

export default function ProfileHeader({
  description,
  titlePrimary,
}: ProfileHeaderProps) {
  return (
    <div className="top-14 md:top-0 z-50 bg-white pt-3 px-4 sm:px-6 lg:pr-12 lg:pl-12">
      <header className="top-bar mb-5 flex items-center justify-between p-1">
        <div>
          <h1 className="type-title flex items-center gap-1">
            <span className="text-primary">{titlePrimary}</span>
            <span className="text-action">Profile</span>
          </h1>
          <p className="type-desc mt-1 text-muted-foreground">{description}</p>
        </div>
      </header>
    </div>
  );
}