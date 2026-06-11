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
      <div className="w-full min-w-0 lg:pr-11.25 lg:pl-11.75">
        <Suspense fallback={<TransactionHistorySkeleton />}>
          <TransactionHistoryData />
        </Suspense>
      </div>
    </main>
  );
}
