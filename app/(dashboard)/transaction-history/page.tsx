import { StatsCardsSection } from "../../../components/dashboard/transaction-history/StatsCardsSection";
import { TransactionHistoryHeader } from "../../../components/dashboard/transaction-history/TransactionHistoryHeader";
import { TransactionTableSection } from "../../../components/dashboard/transaction-history/TransactionTableSection";
import {
  eventsData,
  statsData,
  transactionsData,
} from "../../../data/transaction";

export default function TransactionHistoryPage() {
  return (
    <main className="min-h-screen">
      <TransactionHistoryHeader />

      <div className="w-full mx-auto px-3 py-4">
        <StatsCardsSection stats={statsData} />

        <TransactionTableSection
          transactions={transactionsData}
          events={eventsData}
        />
      </div>
    </main>
  );
}
