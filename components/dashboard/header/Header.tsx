"use client";
import Image from "next/image";
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
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-grey-200 overflow-hidden shrink-0">
              {!isLoading && currentUser?.profilePicture ? (
                <Image
                  src={currentUser.profilePicture}
                  alt={currentUser.name ?? "User"}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span className="type-desc-semibold text-primary uppercase">
                  {isLoading ? "..." : currentUser?.avatarInitials ?? "?"}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}