import Header from "../../../components/dashboard/header/Header";
import { StatsCardsSection } from "../../../components/dashboard/transaction-history/StatsCardsSection";
import { TransactionTableSection } from "../../../components/dashboard/transaction-history/TransactionTableSection";
import {
  eventsData,
  statsData,
  transactionsData,
} from "../../../data/transaction";

export default function TransactionHistoryPage() {
  return (
    <main className="min-h-screen">
      <Header
        titlePrimary="Transaction"
        titleSecondary="History"
        description="Monitor participant responses and review insights from completed community surveys."
      />
      <div className="w-full min-w-0 max-w-7xl m-auto pr-8 lg:pr-12 lg:pl-12">
        <StatsCardsSection stats={statsData} />

        <TransactionTableSection
          transactions={transactionsData}
          events={eventsData}
        />
      </div>
    </main>
  );
}
