interface PriceContentProps {
  payment?: {
    paymentType: string;
    paymentAmount: number;
  } | null;
}

export default function PriceContentComponent({ payment }: PriceContentProps) {
  const price = payment?.paymentAmount ?? 0;

  return (
    <section className="flex flex-col items-center justify-center h-full">
      <p className="text-primary type-detail">Registration Fee</p>
      <p className="text-title font-bold text-primary">
        {price > 0 ? `$${price} / person` : "Free Entry"}
      </p>
    </section>
  );
}