import type { EventTone } from "../types/calendar";

export const monthDays = [
  29, 30, 31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
  20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
];

export const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export const monthEvents: {
  id: number;
  day: number;
  time: string;
  title: string;
  tone: EventTone;
}[] = [
  { id: 1, day: 5, time: "1:00 PM", title: "AI INNOVATION", tone: "accent" },
  { id: 2, day: 5, time: "2:00 PM", title: "NETWORKING", tone: "primary" },
  { id: 3, day: 8, time: "7:00 PM", title: "HOMECOMING", tone: "accent" },
  { id: 4, day: 16, time: "4:00 PM", title: "REUNION PARTY", tone: "action" },
];

export const weekHeaderDays = [
  { day: "SUN", date: "01" },
  { day: "MON", date: "02" },
  { day: "TUE", date: "03" },
  { day: "WED", date: "04" },
  { day: "THU", date: "05" },
  { day: "FRI", date: "06" },
  { day: "SAT", date: "07" },
];

export const weekTimeSlots = [
  "08 AM",
  "09 AM",
  "10 AM",
  "11 AM",
  "12 PM",
  "01 PM",
  "02 PM",
  "03 PM",
];

export const weekEvents = [
  {
    id: 1,
    dayIndex: 2,
    top: 80,
    title: "PRODUCT REVIEW",
    time: "9:00 - 10:30",
    tone: "primary" as EventTone,
  },
  {
    id: 2,
    dayIndex: 3,
    top: 180,
    title: "CLIENT SYNC",
    time: "11:00 - 12:30",
    tone: "accent" as EventTone,
  },
  {
    id: 3,
    dayIndex: 5,
    top: 300,
    title: "DESIGN WORKSHOP",
    time: "1:00 - 3:00",
    tone: "destructive" as EventTone,
  },
];

export const dayEvents = [
  {
    id: 1,
    title: "Tech Innovation Summit",
    location: "Grand Ballroom, Level 4",
    time: "9:15 AM - 11:30 AM",
    tone: "primary" as EventTone,
  },
  {
    id: 2,
    title: "Executive Networking Luncheon",
    location: "Sky Lounge",
    time: "1:00 PM - 2:30 PM",
    tone: "accent" as EventTone,
  },
];

export const upcomingEvents = [
  {
    id: "1",
    month: "April Events",
    day: "16",
    date: "APRIL 2026",
    title: "Tech Innovation Submit",
    time: "09:00 AM - 05:00 PM",
    location: "CKCC",
  },
  {
    id: "2",
    month: "April Events",
    day: "15",
    date: "APRIL 2026",
    title: "Tech Innovation Submit",
    time: "09:00 AM - 05:00 PM",
    location: "CKCC",
  },
  {
    id: "3",
    month: "March Events",
    day: "02",
    date: "MAR 2026",
    title: "Tech Innovation Submit",
    time: "09:00 AM - 05:00 PM",
    location: "CKCC",
  },
  {
    id: "4",
    month: "March Events",
    day: "13",
    date: "MAR 2026",
    title: "Tech Innovation Submit",
    time: "09:00 AM - 05:00 PM",
    location: "CKCC",
  },
  {
    id: "5",
    month: "February Events",
    day: "23",
    date: "FEB 2026",
    title: "Tech Innovation Submit",
    time: "09:00 AM - 05:00 PM",
    location: "CKCC",
  },
  {
    id: "6",
    month: "January Events",
    day: "04",
    date: "JAN 2026",
    title: "Tech Innovation Submit",
    time: "09:00 AM - 05:00 PM",
    location: "CKCC",
  },
];
