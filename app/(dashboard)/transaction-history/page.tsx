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
    <main className="min-h-screen z-10">
      <Header
        titlePrimary="Transaction"
        titleSecondary="History"
        description="Monitor participant responses and review insights from completed community surveys."
      />
      <div className="w-full max-w-420 min-w-0 mx-auto lg:pr-11.25 lg:pl-[47px]">
        <StatsCardsSection stats={statsData} />

        <TransactionTableSection
          transactions={transactionsData}
          events={eventsData}
        />
      </div>
    </main>
  );
}
