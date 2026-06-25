import { FolderClosed, Globe, LockKeyhole } from "lucide-react";
import { Workspace } from "@/types/workspace-type/group";

interface EventNavbarProps {
  workspace: Workspace | null;
  isLoading?: boolean;
}

export default function EventNavbar({ workspace, isLoading }: EventNavbarProps) {
  const isInternal = !workspace?.isPublic;

  return (
    <section className="flex items-center bg-white gap-2 sm:gap-3 px-4 lg:px-12 border-b sticky top-0 z-[100] py-2">
      <div className="bg-primary p-1 md:p-2 rounded-md text-white">
         <FolderClosed />
      </div>
      <div>
        {isLoading ? (
          <div className="h-3 sm:h-4 w-24 sm:w-32 bg-muted animate-pulse rounded mb-1" />
        ) : (
          <>
            <span className="text-xs sm:text-desc-small-semibold text-primary bg-muted px-1.5 sm:px-2 py-0.5 rounded flex items-center gap-1 w-fit">
              {isInternal ? <LockKeyhole size={10} className="sm:size-3" /> : <Globe size={12} className="sm:size-3" />}
              {isInternal ? "Internal" : "External"}
            </span>
            <h1 className="type-subtitle text-primary text-sm sm:text-base truncate max-w-[180px] sm:max-w-none">
              {workspace?.name ?? "—"}
            </h1>
          </>
        )}
      </div>
    </section>
  );
}