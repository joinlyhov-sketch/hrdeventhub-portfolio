import Header from "@/components/dashboard/header/Header";
import TransactionHistorySkeleton from "@/components/dashboard/transaction-history/TransactionHistorySkeleton";

export default function Loading() {
  return (
    <main className="min-h-screen z-10">
      <Header
        titlePrimary="Transaction"
        titleSecondary="History"
        description="Monitor participant responses and review insights from completed community surveys."
      />
      <div className="w-full min-w-0 max-w-475 mx-auto pr-8 lg:pr-12 lg:pl-12">
        <TransactionHistorySkeleton />
      </div>
    </main>
  );
}
