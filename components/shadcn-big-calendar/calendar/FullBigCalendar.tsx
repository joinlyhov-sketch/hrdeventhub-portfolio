"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { EventContentArg } from "@fullcalendar/core";
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from "lucide-react";
import { format } from "date-fns";

import { calendarEvents } from "@/data/calendarData";
import type { CalendarView } from "@/types/calendar";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover/popover";

import "./full-big-calendar.css";

const viewsConfig: { label: string; value: CalendarView }[] = [
  { label: "Month", value: "dayGridMonth" },
  { label: "Week", value: "timeGridWeek" },
  { label: "Day", value: "timeGridDay" },
];

function renderEventContent(info: EventContentArg) {
  const tone = info.event.extendedProps.tone ?? "blue";
  const location = info.event.extendedProps.location;

  return (
    <div className={`event-box event-box-${tone}`}>
      <div className="event-title">{info.event.title}</div>
      {location && <div className="event-location">{location}</div>}
      {info.timeText && <div className="event-time">{info.timeText}</div>}
    </div>
  );
}

export default function FullBigCalendar() {
  const calendarRef = useRef<FullCalendar | null>(null);
  const calendarShellRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<CalendarView>("dayGridMonth");
  const [currentDate, setCurrentDate] = useState(new Date());

  const title = useMemo(() => format(currentDate, "MMMM yyyy"), [currentDate]);

  const getApi = () => calendarRef.current?.getApi();

  const resizeCalendar = () => {
    requestAnimationFrame(() => {
      getApi()?.updateSize();
    });

    setTimeout(() => {
      getApi()?.updateSize();
    }, 300);
  };

  useEffect(() => {
    resizeCalendar();

    window.addEventListener("resize", resizeCalendar);

    return () => {
      window.removeEventListener("resize", resizeCalendar);
    };
  }, [view]);

  const updateCurrentDate = () => {
    const api = getApi();
    if (!api) return;

    setCurrentDate(api.getDate());
    resizeCalendar();
  };

  const handlePrev = () => {
    const api = getApi();
    if (!api) return;

    api.prev();
    updateCurrentDate();
  };

  const handleNext = () => {
    const api = getApi();
    if (!api) return;

    api.next();
    updateCurrentDate();
  };

  const handleViewChange = (nextView: CalendarView) => {
    const api = getApi();
    if (!api) return;

    setView(nextView);
    api.changeView(nextView);
    setCurrentDate(api.getDate());
    resizeCalendar();
  };

  useEffect(() => {
    if (!calendarShellRef.current) return;

    const observer = new ResizeObserver(() => {
      calendarRef.current?.getApi().updateSize();
    });

    observer.observe(calendarShellRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="calendar-page-shell">
      <div className="calendar-toolbar">
        <div className="calendar-toolbar-left">
          <button
            type="button"
            className="calendar-icon-btn"
            onClick={handlePrev}
          >
            <ChevronLeft size={22} />
          </button>

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button type="button" className="calendar-date-btn">
                <CalendarDays size={18} />
                <span>{title}</span>
                {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
            </PopoverTrigger>

            <PopoverContent align="start" className="w-auto p-0">
              <Calendar
                mode="single"
                selected={currentDate}
                onSelect={(selectedDate) => {
                  if (!selectedDate) return;

                  const api = getApi();
                  if (!api) return;

                  api.gotoDate(selectedDate);
                  setCurrentDate(selectedDate);
                  resizeCalendar();
                }}
              />
            </PopoverContent>
          </Popover>
          
          <button
            type="button"
            className="calendar-icon-btn"
            onClick={handleNext}
          >
            <ChevronRight size={22} />
          </button>
        </div>

        <div className="calendar-view-tabs">
          {viewsConfig.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => handleViewChange(item.value)}
              className={view === item.value ? "active" : ""}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={calendarShellRef}
        className={`calendar-card calendar-card-${view}`}
      >
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialDate={currentDate}
          initialView="dayGridMonth"
          events={calendarEvents}
          eventContent={renderEventContent}
          headerToolbar={false}
          height={view === "dayGridMonth" ? "auto" : "720px"}
          contentHeight={view === "dayGridMonth" ? "auto" : "620px"}
          expandRows={false}
          handleWindowResize={true}
          windowResizeDelay={100}
          nowIndicator
          allDaySlot={false}
          dayMaxEvents
          slotDuration="01:00:00"
          scrollTime={new Date().toTimeString().slice(0, 8)}
          slotMinTime={view === "dayGridMonth" ? "00:00:00" : "00:00:00"}
          slotMaxTime={view === "dayGridMonth" ? "24:00:00" : "12:00:00"}
          slotLabelContent={(arg) => {
            const hour = arg.date.getHours();
            const period = hour >= 12 ? "PM" : "AM";
            const displayHour = String(hour % 12 || 12).padStart(2, "0");
            return `${displayHour} ${period}`;
          }}
          dayHeaderContent={(args) => {
            const weekday = args.date
              .toLocaleDateString("en-US", { weekday: "short" })
              .toUpperCase();
            const day = args.date.getDate().toString().padStart(2, "0");

            if (view === "dayGridMonth") {
              return <span className="month-day-name">{weekday}</span>;
            }

            return (
              <div className="custom-day-header">
                <span className="custom-day-name">{weekday}</span>
                <span className="custom-day-number">{day}</span>
              </div>
            );
          }}
        />
      </div>
    </section>
  );
}