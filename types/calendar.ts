export type CalendarView = "dayGridMonth" | "timeGridWeek" | "timeGridDay";

export type EventTone = "blue" | "green" | "red" | "orange";

export type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end?: string;
  tone: EventTone;
  location?: string;
};
