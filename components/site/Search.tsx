import { Search as SearchIcon } from "lucide-react";

export default function Search() {
  return (
     <div className="relative grow">
        <input
          type="text"
          placeholder="Search for group..."
          className="w-full pl-6 pr-14 py-3 border border-gray-200 rounded-full text-base focus:ring-2 focus:ring-blue-100 outline-none placeholder:text-gray-400 shadow-sm"
        />
        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-3">
          <button className="bg-primary p-2.5 rounded-full text-white hover:bg-[#25437a]">
            <SearchIcon size={20} strokeWidth={2.5} />
          </button>
        </div>
      </div>
  )
}
