import { Search as SearchIcon } from "lucide-react";

interface SearchProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export default function Search({
  value,
  onChange,
  placeholder = "Search...",
}: SearchProps) {
  return (
    <div className="relative grow">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-6 pr-14 py-2 border border-gray-200 rounded-full text-base focus:ring-2 focus:ring-blue-100 outline-none placeholder:text-gray-400 shadow-sm"
      />
      <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-3 pointer-events-none">
        <button
          type="button"
          className="bg-primary p-1.5 rounded-full text-white hover:bg-[#25437a] pointer-events-auto hover:cursor-pointer"
        >
          <SearchIcon size={20} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
