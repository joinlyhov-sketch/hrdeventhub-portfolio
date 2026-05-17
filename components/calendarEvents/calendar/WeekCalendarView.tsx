// import { Clock3 } from "lucide-react";
// import {
//   weekEvents,
//   weekHeaderDays,
//   weekTimeSlots,
// } from "../../../data/calendarData";

// export default function WeekCalendarView() {
//   return (
//     <div className="overflow-hidden rounded-xl border border-border bg-card">
//       <div className="grid grid-cols-[58px_repeat(7,1fr)] bg-primary text-primary-foreground">
//         <div className="flex h-[65px] items-center justify-center border-r border-white/30">
//           <Clock3 size={22} />
//         </div>

//         {weekHeaderDays.map((item, index) => (
//           <div
//             key={item.day}
//             className={`flex h-[65px] flex-col items-center justify-center border-r border-white/30 text-center ${
//               index === 1 ? "bg-primary/30" : ""
//             }`}
//           >
//             <p className="type-detail-small-medium uppercase opacity-80">
//               {item.day}
//             </p>
//             <h3 className="type-subtitle text-white">{item.date}</h3>
//           </div>
//         ))}
//       </div>

//       <div className="grid grid-cols-[58px_repeat(7,1fr)]">
//         <div>
//           {weekTimeSlots.map((time) => (
//             <div
//               key={time}
//               className="flex h-[60px] justify-center border-b border-r border-border pt-2"
//             >
//               <span className="type-detail-small-medium text-muted-foreground">
//                 {time}
//               </span>
//             </div>
//           ))}
//         </div>

//         {weekHeaderDays.map((_, dayIndex) => (
//           <div key={dayIndex} className="relative bg-card">
//             {weekTimeSlots.map((_, rowIndex) => (
//               <div
//                 key={rowIndex}
//                 className="h-[60px] border-b border-r border-border"
//               />
//             ))}

//             {weekEvents
//               .filter((event) => event.dayIndex === dayIndex)
//               .map((event) => (
//                 <article
//                   key={event.id}
//                   style={{ top: event.top }}
//                   className={`absolute left-[6px] right-[6px] rounded-md border-l-4 px-3 py-2 ${
//                     event.tone === "accent"
//                       ? "border-accent bg-accent/10 text-accent"
//                       : event.tone === "primary"
//                         ? "border-primary bg-primary/10 text-primary"
//                         : "border-destructive bg-destructive/10 text-destructive"
//                   }`}
//                 >
//                   <h4 className="type-detail-semibold uppercase leading-tight">
//                     {event.title}
//                   </h4>

//                   <p className="mt-1 type-detail-small-medium">{event.time}</p>
//                 </article>
//               ))}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

import { Clock3 } from "lucide-react";
import {
  weekEvents,
  weekHeaderDays,
  weekTimeSlots,
} from "../../../data/calendarData";

export default function WeekCalendarView() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="grid grid-cols-[58px_repeat(7,1fr)] bg-primary text-primary-foreground">
        <div className="flex h-[65px] items-center justify-center border-r border-white/30">
          <Clock3 size={22} />
        </div>

        {weekHeaderDays.map((item, index) => (
          <div
            key={item.day}
            className={`flex h-[65px] flex-col items-center justify-center border-r border-white/30 text-center ${
              index === 1 ? "bg-primary-hover" : ""
            }`}
          >
            <p className="type-detail-small-medium uppercase opacity-80">
              {item.day}
            </p>
            <h3 className="type-subtitle text-white">{item.date}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-[58px_repeat(7,1fr)]">
        <div>
          {weekTimeSlots.map((time) => (
            <div
              key={time}
              className="flex h-[60px] justify-center border-b border-r border-border pt-2"
            >
              <span className="type-detail-small-medium text-muted-foreground">
                {time}
              </span>
            </div>
          ))}
        </div>

        {weekHeaderDays.map((_, dayIndex) => (
          <div key={dayIndex} className="relative bg-card">
            {weekTimeSlots.map((_, rowIndex) => (
              <div
                key={rowIndex}
                className="h-[60px] border-b border-r border-border"
              />
            ))}

            {weekEvents
              .filter((event) => event.dayIndex === dayIndex)
              .map((event) => (
                <article
                  key={event.id}
                  style={{ top: event.top }}
                  className={`absolute left-[6px] right-[6px] rounded-md border-l-4 px-3 py-2 ${
                    event.tone === "accent"
                      ? "border-accent bg-accent/10 text-accent"
                      : event.tone === "primary"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-destructive bg-destructive/10 text-destructive"
                  }`}
                >
                  <h4 className="type-detail-semibold uppercase leading-tight">
                    {event.title}
                  </h4>

                  <p className="mt-1 type-detail-small-medium">{event.time}</p>
                </article>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
