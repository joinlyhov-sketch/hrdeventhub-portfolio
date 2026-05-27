"use client";

import moment from "moment";
import { Clock3 } from "lucide-react";
import { ComponentType } from "react";
import type { CalendarProps } from "react-big-calendar";
import { momentLocalizer, Views } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";

import type { CalendarView } from "@/types/calendar";
import ShadcnBigCalendar from "./shadcn-big-calendar";

const localizer = momentLocalizer(moment);

type CalendarEvent = {
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
};

type Props = {
  view: CalendarView;
  date: Date;
  onNavigate: (date: Date) => void;
};

const DnDCalendar = withDragAndDrop<CalendarEvent>(
  ShadcnBigCalendar as ComponentType<CalendarProps<CalendarEvent>>,
);

function WeekHeader({ date }: { date: Date }) {
  return (
    <div className="calendar-week-header">
      <span>{moment(date).format("ddd").toUpperCase()}</span>
      <strong>{moment(date).format("DD")}</strong>
    </div>
  );
}

function DayHeader({ date }: { date: Date }) {
  return (
    <div className="calendar-day-header">
      <span>{moment(date).format("ddd").toUpperCase()}</span>
      <strong>{moment(date).format("DD")}</strong>
    </div>
  );
}

function MonthHeader({ date }: { date: Date }) {
  return (
    <div className="calendar-month-header">
      {moment(date).format("ddd").toUpperCase()}
    </div>
  );
}

function TimeGutterHeader() {
  return (
    <div className="flex justify-center items-center calendar-time-gutter-header">
      <Clock3 size={22} />
    </div>
  );
}

export default function BigCalendarView({ view, date, onNavigate }: Props) {
  return (
    <DnDCalendar
      localizer={localizer}
      toolbar={false}
      date={date}
      view={view}
      onNavigate={onNavigate}
      onView={() => {}}
      events={[]}
      selectable
      resizable
      style={{ height: 700, width: "100%" }}
      className={`calendar-rbc calendar-rbc-${view}`}
      components={{
        timeGutterHeader: view === "week" ? TimeGutterHeader : undefined,
        week: {
          header: WeekHeader,
        },
        day: {
          header: DayHeader,
        },
        month: {
          header: MonthHeader,
        },
      }}
    />
  );
}
