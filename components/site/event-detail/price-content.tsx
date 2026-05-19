import { MOCK_EVENTS } from "../../../data/event-detail";

export default function PriceContentCOmponent() {

  const event = MOCK_EVENTS[0];

  return (
    <section className="flex flex-col items-center justify-center h-full">
      <p className="text-secondary text-subtitle">Registration Fee</p>
      <p className="text-title font-bold text-primary">${event.price}</p>
    </section>
  );
}
