import { FolderClosed, Globe, LockKeyhole } from "lucide-react";
import { Workspace } from "@/types/workspace-type/group";

interface EventNavbarProps {
  workspace: Workspace | null;
  isLoading?: boolean;
}

export default function EventNavbar({ workspace, isLoading }: EventNavbarProps) {
  const isInternal = !workspace?.isPublic;

  return (
    <section className="flex items-center bg-white gap-3 lg:pr-12 lg:pl-12 border-b sticky top-0 z-[100] py-2">
      <div className="bg-primary p-2 rounded-md text-white">
        <FolderClosed />
      </div>
      <div>
        {isLoading ? (
          <div className="h-4 w-32 bg-muted animate-pulse rounded mb-1" />
        ) : (
          <>
            <span className="text-desc-small-semibold text-primary bg-muted px-2 py-0.5 rounded flex items-center gap-1 w-fit">
              {isInternal ? <LockKeyhole size={12} /> : <Globe size={12} />}
              {isInternal ? "Internal" : "External"}
            </span>
            <h1 className="type-subtitle text-primary">
              {workspace?.name ?? "—"}
            </h1>
          </>
        )}
      </div>
    </section>
  );
}