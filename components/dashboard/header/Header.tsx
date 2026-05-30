"use client";
import { useCurrentUser } from "../../../context/user-context";
import { HeaderProps } from "@/types/HeaderProps";

export default function Header({ titlePrimary, titleSecondary, description }: HeaderProps) {
  const { currentUser, isLoading } = useCurrentUser(); 

  return (
    <div className="sticky top-0 z-50 bg-white pt-3 lg:pr-12 lg:pl-12">
      <header className="top-bar mb-5 flex items-center justify-between p-1">
        <div>
          <h1 className="type-title flex items-center gap-1">
            <span className="text-primary">{titlePrimary}</span>
            {titleSecondary && <span className="text-action">{titleSecondary}</span>}
          </h1>
          <p className="type-desc mt-1 text-muted-foreground">{description}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="text-right">
              <h3 className="type-detail-semibold text-primary">
                {isLoading ? "Loading..." : currentUser?.name ?? "—"}
              </h3>
              <p className="type-desc-small-semibold mt-1 text-primary-hover">
                {currentUser?.email ?? ""}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-violet-400 to-purple-600">
              <span className="type-desc-semibold text-white">
                {currentUser?.avatarInitials ?? "?"}
              </span>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}