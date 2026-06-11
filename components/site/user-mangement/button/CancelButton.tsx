

import { Button } from "../../../ui/button";

export function CancelButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      className="px-10 py-3 h-auto rounded-2xl border border-primary text-primary type-desc hover:bg-grey-100 hover:text-secondary transition-colors min-w-[120px] cursor-pointer"
    >
      Cancel
    </Button>
  );
}
