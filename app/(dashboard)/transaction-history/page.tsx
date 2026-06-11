import { Suspense } from "react";
import Header from "../../../components/dashboard/header/Header";
import { TransactionTableSection } from "../../../components/dashboard/transaction-history/TransactionTableSection";
import TransactionHistorySkeleton from "../../../components/dashboard/transaction-history/TransactionHistorySkeleton";
import { getTransactions, getEventSummaries } from "@/actions/transaction.action";

async function TransactionHistoryData() {
  const [transactions, events] = await Promise.all([
    getTransactions(),
    getEventSummaries(),
  ]);
  return (
    <TransactionTableSection transactions={transactions} events={events} />
  );
}

export default function TransactionHistoryPage() {
  return (
    <main className="min-h-screen z-10">
      <Header
        titlePrimary="Transaction"
        titleSecondary="History"
        description="Monitor participant responses and review insights from completed community surveys."
      />
      <div className="w-full min-w-0 max-w-475 mx-auto pr-8 lg:pr-12 lg:pl-12">
        <Suspense fallback={<TransactionHistorySkeleton />}>
          <TransactionHistoryData />
        </Suspense>
      </div>
    </main>
  );
}
