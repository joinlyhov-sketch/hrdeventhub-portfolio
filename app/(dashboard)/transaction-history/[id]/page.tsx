import { Suspense } from "react";
import Header from "../../../../components/dashboard/header/Header";
import { TransactionDetailCard } from "../../../../components/dashboard/transaction-history/transaction-detail/DetailCard";
import { EventBanner } from "../../../../components/dashboard/transaction-history/transaction-detail/EventBanner";
import { PayerCard } from "../../../../components/dashboard/transaction-history/transaction-detail/PayerCard";
import TransactionDetailSkeleton from "../../../../components/dashboard/transaction-history/TransactionDetailSkeleton";
import { getTransactionDetail } from "@/actions/transaction.action";

interface Props {
  params: Promise<{ id: string }>;
}

async function TransactionDetailData({ id }: { id: string }) {
  const detail = await getTransactionDetail(id);
  return (
    <div className="w-full px-6 py-2 space-y-6 flex flex-col flex-1 min-w-0 pr-8 lg:pr-12 lg:pl-12">
      <div>
        <h1 className="text-3xl font-bold text-secondary">
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
  );
}

export default async function TransactionDetailPage({ params }: Props) {
  const { id } = await params;
  return (
    <main className="min-h-screen z-10">
      <Header
        titlePrimary="Transaction"
        titleSecondary="Details"
        description="Monitor participant responses and review insights from completed community surveys."
      />
      <Suspense fallback={<TransactionDetailSkeleton />}>
        <TransactionDetailData id={id} />
      </Suspense>
    </main>
  );
}
