import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";

export function TransactionHistoryHeader() {
  return (
    <header className="bg-background/10 backdrop-blur-lg sticky top-0 z-50 rounded-2xl">
      <div className="w-full mx-auto px-6 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">
            Transactions <span className="text-action">History</span>
          </h1>
          <p className="text-gray-500 type-desc-medium mt-1">
            Monitoring transaction
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900">Penh Seyha</p>
            <p className="text-xs text-gray-500">penhseyha890@gmail.com</p>
          </div>
          <Avatar className="w-10 h-10">
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=PenhSeyha" />
            <AvatarFallback>PS</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
