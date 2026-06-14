"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";

export interface SearchableSelectOption {
  id: string;
  label: string;
}

interface SearchableSelectProps {
  options: SearchableSelectOption[];
  value?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  error?: boolean;
  onChange: (value: string) => void;
}

export default function SearchableSelect({
  options,
  value,
  placeholder = "Search...",
  icon,
  error,
  onChange,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const selectedOption = options.find((o) => o.id === value);

  const filteredOptions = React.useMemo(() => {
    if (!search.trim()) return options;

    return options.filter((option) =>
      option.label.toLowerCase().includes(search.toLowerCase()),
    );
  }, [options, search]);

  return (
    <div ref={containerRef} className="relative">
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3 sm:left-4 text-gray-400 pointer-events-none z-10">
            {icon}
          </div>
        )}

        <Input
          value={search}
          placeholder={selectedOption?.label || placeholder}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className={`h-11 sm:h-[52px] pl-10 sm:pl-11 pr-9 sm:pr-10 rounded-xl border bg-white text-sm sm:text-[15px]
          ${
            error
              ? "border-red-400"
              : "border-gray-200 focus-visible:ring-2 focus-visible:ring-blue-500"
          }`}
        />

        <ChevronDown
          size={18}
          onClick={() => setIsOpen(!isOpen)}
          className={`absolute right-3 sm:right-4 cursor-pointer text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 mt-1.5 z-50 bg-white border border-gray-300 rounded-xl shadow-xl max-h-[180px] sm:max-h-[220px] overflow-y-auto p-1">
          {filteredOptions.length === 0 ? (
            <div className="px-3 sm:px-4 py-2.5 sm:py-3 text-center text-gray-400 text-sm">
              No results found
            </div>
          ) : (
            filteredOptions.map((option) => (
              <div
                key={option.id}
                onClick={() => {
                  onChange(option.id);
                  setSearch("");
                  setIsOpen(false);
                }}
                className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg cursor-pointer transition-colors text-sm sm:text-base
                ${
                  value === option.id
                    ? "bg-blue-50 text-blue-900 font-medium"
                    : "hover:bg-gray-50"
                }`}
              >
                {option.label}
              </div>
            ))
          )}
        </div>
      )}

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
