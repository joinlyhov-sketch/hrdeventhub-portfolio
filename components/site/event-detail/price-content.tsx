import { MOCK_EVENTS } from "../../../data/event-detail";

export default function PriceContentCOmponent() {
  const event = MOCK_EVENTS[0];

  return (
    <section className="flex flex-col items-center justify-center h-full">
<<<<<<< HEAD
      <p className="text-secondary text-subtitle">Registration Fee</p>
      <p className="text-title font-bold text-primary">${event.price}</p>
=======
      <p className="text-primary type-detail">Registration Fee</p>
      <p className="text-title font-bold text-primary">${event.price} / person</p>
>>>>>>> e7ad944b3fc1720aa2f2cb4d81c0d857c08db4fa
    </section>
  );
}
