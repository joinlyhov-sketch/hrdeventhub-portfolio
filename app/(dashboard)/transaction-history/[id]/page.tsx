import { TransactionDetailCard } from "../../../../components/dashboard/transaction-history/transaction-detail/DetailCard";
import { EventBanner } from "../../../../components/dashboard/transaction-history/transaction-detail/EventBanner";
import { PayerCard } from "../../../../components/dashboard/transaction-history/transaction-detail/PayerCard";

import { TransactionHistoryHeader } from "../../../../components/dashboard/transaction-history/TransactionHistoryHeader";
import { transactionDetailsData } from "../../../../data/transaction-detail";

export default function TransactionDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const detail = transactionDetailsData[0];

  return (
    <main className="min-h-screen bg-gray-50">
      <TransactionHistoryHeader />

      <div className="w-full px-6 py-2 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {detail.transactionId}
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Processed {detail.processedDate}
          </p>
        </div>

        <EventBanner event={detail.event} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TransactionDetailCard detail={detail} />
          <PayerCard payer={detail.payer} />
        </div>
      </div>
    </main>
  );
}
