import { ArrowUpIcon } from "lucide-react";

import { Button } from "../../../ui/button";

export function CancelButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      className="px-10 py-3 h-auto rounded-2xl border border-[#1E3A8A] text-[#1E3A8A] font-bold text-sm hover:bg-slate-50 transition-colors min-w-[140px] cursor-pointer"
    >
      Cancel
    </Button>
  );
}
