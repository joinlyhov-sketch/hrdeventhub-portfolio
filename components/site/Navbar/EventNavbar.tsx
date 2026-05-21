import { FolderClosed } from "lucide-react";

export default function EventNavbar() {
  return (
    <section className="flex items-center bg-white gap-3 lg:pr-12 lg:pl-12 border-b sticky top-0 z-50 py-2">
          <div className="bg-primary p-2 rounded-md text-white">
            <FolderClosed />
          </div>
          <div>
            <span className="text-desc-small-semibold text-primary bg-muted px-2 py-0.5 rounded">
              Internal
            </span>
            <h1 className="type-subtitle text-primary">
              14th Generation Group
            </h1>
          </div>
        </section>
  )
}
