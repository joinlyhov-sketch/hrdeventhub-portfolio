"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { EventContentArg, EventInput } from "@fullcalendar/core";
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  MapPin,
} from "lucide-react";
import { format } from "date-fns";

import { useWorkspaceEvents } from "@/hooks/use-workspace-events";
import type { CalendarView, EventTone } from "@/types/calendar";
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

const eventTones: EventTone[] = ["blue", "green", "orange", "red"];

const getEventTone = (eventId: string): EventTone => {
  const hash = Array.from(eventId).reduce(
    (total, character) => total + character.charCodeAt(0),
    0,
  );

  return eventTones[hash % eventTones.length];
};

const formatEventTime = (date: Date | null) =>
  date?.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }) ?? "";

function renderEventContent(info: EventContentArg) {
  const tone = info.event.extendedProps.tone ?? "blue";
  const location = info.event.extendedProps.location;
  const startTime = formatEventTime(info.event.start);
  const endTime = formatEventTime(info.event.end);
  const eventTime = endTime ? `${startTime} - ${endTime}` : startTime;

  if (info.view.type === "dayGridMonth") {
    return (
      <div className={`event-box event-box-${tone}`}>
        <span className="event-dot" />
        <span className="event-time">{eventTime}</span>
        <span className="event-title">{info.event.title}</span>
      </div>
    );
  }

  if (info.view.type === "timeGridWeek") {
    return (
      <div className={`event-box week-event-box event-box-${tone}`}>
        <div className="event-title">{info.event.title}</div>
        <div className="event-time">{eventTime}</div>
      </div>
    );
  }

  if (info.view.type === "timeGridDay") {
    return (
      <div className={`event-box day-event-box event-box-${tone}`}>
        <div className="event-title">{info.event.title}</div>
        {location && (
          <div className="event-location">
            <MapPin size={13} />
            <span>{location}</span>
          </div>
        )}
        <div className="event-time">{eventTime}</div>
      </div>
    );
  }

  return null;
}

type Props = {
  workspaceId?: string;
  role?: "admin" | "student" | "alumni" | "organizer";
};

export default function FullBigCalendar({ workspaceId, role }: Props) {
  const calendarRef = useRef<FullCalendar | null>(null);
  const calendarShellRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<CalendarView>("dayGridMonth");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weekNowIndicatorStyle, setWeekNowIndicatorStyle] =
    useState<CSSProperties>({ display: "none" });
  const { events, isLoading, error } = useWorkspaceEvents(workspaceId, role);

  const title = useMemo(() => format(currentDate, "MMMM yyyy"), [currentDate]);
  const calendarEvents = useMemo<EventInput[]>(
    () =>
      events.flatMap((event) => {
        const start = new Date(event.eventStart);
        if (Number.isNaN(start.getTime())) return [];

        const parsedEnd = new Date(event.eventEnd);
        const end =
          !Number.isNaN(parsedEnd.getTime()) && parsedEnd > start
            ? parsedEnd
            : new Date(start.getTime() + 60 * 60 * 1000);

        return [
          {
            id: event.postId,
            title: event.title,
            start: start.toISOString(),
            end: end.toISOString(),
            url: workspaceId
              ? `/group/${workspaceId}/event/${event.postId}`
              : undefined,
            extendedProps: {
              location: event.location?.locationName ?? "",
              tone: getEventTone(event.postId),
            },
          },
        ];
      }),
    [events, workspaceId],
  );

  const getApi = useCallback(() => calendarRef.current?.getApi(), []);

  const resizeCalendar = useCallback(() => {
    requestAnimationFrame(() => {
      getApi()?.updateSize();
    });

    setTimeout(() => {
      getApi()?.updateSize();
    }, 300);
  }, [getApi]);

  useEffect(() => {
    resizeCalendar();

    window.addEventListener("resize", resizeCalendar);

    return () => {
      window.removeEventListener("resize", resizeCalendar);
    };
  }, [resizeCalendar, view]);

  useEffect(() => {
    const timer = setTimeout(() => {
      calendarRef.current?.getApi().updateSize();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const updateWeekNowIndicator = useCallback(() => {
    if (view !== "timeGridWeek") {
      setWeekNowIndicatorStyle({ display: "none" });
      return;
    }

    requestAnimationFrame(() => {
      const shell = calendarShellRef.current;
      const api = calendarRef.current?.getApi();
      if (!shell || !api) return;

      const now = new Date();
      const { currentStart, currentEnd } = api.view;
      const isTodayInWeek = now >= currentStart && now < currentEnd;
      const hour = now.getHours().toString().padStart(2, "0");
      const slot = shell.querySelector<HTMLElement>(
        `.fc-timegrid-slot-lane[data-time="${hour}:00:00"]`,
      );

      if (!isTodayInWeek || !slot) {
        setWeekNowIndicatorStyle({ display: "none" });
        return;
      }

      const shellRect = shell.getBoundingClientRect();
      const slotRect = slot.getBoundingClientRect();
      const minutesOffset = (now.getMinutes() / 60) * slotRect.height;

      setWeekNowIndicatorStyle({
        display: "block",
        left: slotRect.left - shellRect.left,
        top: slotRect.top - shellRect.top + minutesOffset,
        width: slotRect.width,
      });
    });
  }, [view]);

  useEffect(() => {
    updateWeekNowIndicator();

    const interval = window.setInterval(updateWeekNowIndicator, 60 * 1000);
    let scrollers: HTMLElement[] = [];
    const scrollListenerFrame = window.requestAnimationFrame(() => {
      scrollers = Array.from(
        calendarShellRef.current?.querySelectorAll<HTMLElement>(
          ".fc-scroller",
        ) ?? [],
      );
      scrollers.forEach((scroller) => {
        scroller.addEventListener("scroll", updateWeekNowIndicator);
      });
    });

    window.addEventListener("resize", updateWeekNowIndicator);

    return () => {
      window.cancelAnimationFrame(scrollListenerFrame);
      window.clearInterval(interval);
      scrollers.forEach((scroller) => {
        scroller.removeEventListener("scroll", updateWeekNowIndicator);
      });
      window.removeEventListener("resize", updateWeekNowIndicator);
    };
  }, [currentDate, updateWeekNowIndicator, calendarEvents.length]);

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

  const handleToday = () => {
    const api = getApi();
    if (!api) return;

    api.today();
    setCurrentDate(api.getDate());
    resizeCalendar();
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
            title="Previous period"
            type="button"
            className="calendar-icon-btn"
            onClick={handlePrev}
          >
            <ChevronLeft size={22} />
          </button>

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button
                title="Calendar view date picker"
                type="button"
                className="calendar-date-btn"
              >
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
            title="Next period"
            type="button"
            className="calendar-icon-btn"
            onClick={handleNext}
          >
            <ChevronRight size={22} />
          </button>

          <button
            title="Go to today"
            type="button"
            className="calendar-today-btn"
            onClick={handleToday}
          >
            {new Date().getDate().toString().padStart(2, "0")}
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
        {isLoading && (
          <div className="calendar-status">Loading calendar events...</div>
        )}
        {error && (
          <div className="calendar-status calendar-status-error">
            Failed to load calendar events
          </div>
        )}
        <FullCalendar
          key={`calendar-${view}`}
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialDate={currentDate}
          initialView={view}
          events={calendarEvents}
          datesSet={updateWeekNowIndicator}
          eventContent={renderEventContent}
          eventClassNames="calendar-data-event"
          headerToolbar={false}
          height={view === "dayGridMonth" ? "auto" : "720px"}
          contentHeight={view === "dayGridMonth" ? "auto" : "620px"}
          expandRows={false}
          fixedWeekCount
          handleWindowResize={true}
          windowResizeDelay={100}
          nowIndicator
          allDaySlot={false}
          dayMaxEvents={view === "dayGridMonth" ? 2 : false}
          dayMaxEventRows={false}
          moreLinkContent={(args) => `+${args.num} more`}
          eventMaxStack={view === "timeGridWeek" ? 2 : undefined}
          eventMinHeight={view === "timeGridWeek" ? 44 : 36}
          slotEventOverlap={false}
          slotDuration="01:00:00"
          scrollTime={
            view === "timeGridWeek"
              ? "00:00:00"
              : view === "timeGridDay"
                ? "00:00:00"
                : "00:00:00"
          }
          slotMinTime={
            view === "timeGridWeek"
              ? "00:00:00"
              : view === "timeGridDay"
                ? "00:00:00"
                : "00:00:00"
          }
          slotMaxTime="24:00:00"
          slotLabelContent={(arg) => {
            const hour = arg.date.getHours();
            const period = hour >= 12 ? "PM" : "AM";
            const displayHour = String(hour % 12 || 12).padStart(2, "0");

            if (view === "timeGridWeek") {
              return {
                html: `
                  <div class="week-time-label">
                  <div>${displayHour}</div>
                  <div>${period}</div>
                  </div>
                      `,
              };
            }

            return `${displayHour} ${period}`;
          }}
          dayHeaderContent={(args) => {
            const weekday = args.date
              .toLocaleDateString("en-US", { weekday: "short" })
              .toUpperCase();
            const day = args.date.getDate().toString().padStart(2, "0");
            if (view === "dayGridMonth") {
              const today = new Date();

              const isTodayVisible =
                currentDate.getMonth() === today.getMonth() &&
                currentDate.getFullYear() === today.getFullYear();

              const isTodayHeader =
                isTodayVisible && args.date.getDay() === today.getDay();

              return (
                <span
                  className={`month-day-name ${isTodayHeader ? "month-day-name-today" : ""}`}
                >
                  {weekday}
                </span>
              );
            }

            return (
              <div className="custom-day-header">
                <span className="custom-day-name">{weekday}</span>
                <span className="custom-day-number">{day}</span>
              </div>
            );
          }}
        />
        {view === "timeGridWeek" && (
          <div
            aria-hidden="true"
            className="calendar-week-now-indicator"
            style={weekNowIndicatorStyle}
          />
        )}
      </div>
    </section>
  );
}
