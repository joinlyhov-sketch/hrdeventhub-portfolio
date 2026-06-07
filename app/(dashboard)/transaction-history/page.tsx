import Header from "../../../components/dashboard/header/Header";
import { StatsCardsSection } from "../../../components/dashboard/transaction-history/StatsCardsSection";
import { TransactionTableSection } from "../../../components/dashboard/transaction-history/TransactionTableSection";

import { getTransactions, getEventSummaries } from "@/actions/transaction.action";

export default async function TransactionHistoryPage() {
  const [transactions, events] = await Promise.all([
    getTransactions(),
    getEventSummaries(),
  ]);
  return (
    <main className="min-h-screen z-10">
      <Header
        titlePrimary="Transaction"
        titleSecondary="History"
        description="Monitor participant responses and review insights from completed community surveys."
      />
      <div className="w-full max-w-420 min-w-0 mx-auto lg:pr-11.25 lg:pl-11.75">
        {/* <StatsCardsSection stats={statsData} /> */}

        <TransactionTableSection
          transactions={transactions}
          events={events}
        />
      </div>
    </main>
  );
}
