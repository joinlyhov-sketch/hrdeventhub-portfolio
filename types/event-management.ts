export type EventCategory = "Announcement" | "Event" | "Article";
export interface EventManagement {
  id: string;
  no: number;
  name: string;
  date: string;
  category: EventCategory;
  status: "Published" | "Draft" | "Cancel";
  attendees: number | null;
}
