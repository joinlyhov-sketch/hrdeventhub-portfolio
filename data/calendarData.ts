export const calendarEvents = [
  { id: 1, day: 5, time: "1:00 PM", title: "AI INNOVATION", type: "green" },
  { id: 2, day: 5, time: "2:00 PM", title: "NETWORKING", type: "blue" },
  { id: 3, day: 8, time: "7:00 PM", title: "HOMECOMING", type: "green" },
  { id: 4, day: 16, time: "4:00 PM", title: "REUNION PARTY", type: "orange" },
];

export const upcomingEvents = [
  { month: "April Events" },
  { month: "March Events" },
  { month: "February Events" },
  { month: "January Events" },
].flatMap((group) =>
  [1, 2].map((item) => ({
    id: `${group.month}-${item}`,
    month: group.month,
    day: "24",
    date: "OCT 2026",
    title: "Tech Innovation Submit",
    time: "09:00 AM - 05:00 PM",
    location: "CKCC",
  })),
);
