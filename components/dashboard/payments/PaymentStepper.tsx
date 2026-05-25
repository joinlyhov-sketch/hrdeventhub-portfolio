type Props = {
  step: number;
};

export default function PaymentStepper({ step }: Props) {
  return (
    <div className="mb-6 flex items-center justify-center">
      {[1, 2, 3].map((item) => (
        <div key={item} className="flex items-center">
          <div
            className={`flex size-8 items-center justify-center rounded-full type-detail-semibold ${
              step >= item
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground"
            }`}
          >
            {item}
          </div>

          {item !== 3 && (
            <div
              className={`h-px w-16 ${
                step > item ? "bg-primary" : "bg-border"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
