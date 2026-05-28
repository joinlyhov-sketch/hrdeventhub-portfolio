export type UpcomingEvent = {
  id: string;
  day: string;
  month: string;
  title: string;
  time: string;
  location: string;
};

export type UpcomingEventGroup = {
  monthTitle: string;
  events: UpcomingEvent[];
};

export const upcomingEventGroups: UpcomingEventGroup[] = [
  {
    monthTitle: "April Events",
    events: [
      {
        id: "1",
        day: "16",
        month: "APRIL 2026",
        title: "Tech Innovation Summit",
        time: "09:00 AM - 05:00 PM",
        location: "CKCC",
      },
      {
        id: "2",
        day: "18",
        month: "APRIL 2026",
        title: "Tech Innovation Summit",
        time: "09:00 AM - 05:00 PM",
        location: "CKCC",
      },
      {
        id: "3",
        day: "27",
        month: "APRIL 2026",
        title: "Tech Innovation Summit",
        time: "09:00 AM - 05:00 PM",
        location: "CKCC",
      },
    ],
  },

  {
    monthTitle: "March Events",
    events: [
      {
        id: "4",
        day: "04",
        month: "MAR 2026",
        title: "Tech Innovation Summit",
        time: "09:00 AM - 05:00 PM",
        location: "CKCC",
      },
      {
        id: "5",
        day: "14",
        month: "MAR 2026",
        title: "Tech Innovation Summit",
        time: "09:00 AM - 05:00 PM",
        location: "CKCC",
      },
      {
        id: "6",
        day: "18",
        month: "MAR 2026",
        title: "Tech Innovation Summit",
        time: "09:00 AM - 05:00 PM",
        location: "CKCC",
      },
    ],
  },

  {
    monthTitle: "February Events",
    events: [
      {
        id: "7",
        day: "12",
        month: "FEB 2026",
        title: "Tech Innovation Summit",
        time: "09:00 AM - 05:00 PM",
        location: "CKCC",
      },
      {
        id: "8",
        day: "16",
        month: "FEB 2026",
        title: "Tech Innovation Summit",
        time: "09:00 AM - 05:00 PM",
        location: "CKCC",
      },
    ],
  },

  {
    monthTitle: "January Events",
    events: [
      {
        id: "9",
        day: "07",
        month: "JAN 2026",
        title: "Tech Innovation Summit",
        time: "09:00 AM - 05:00 PM",
        location: "CKCC",
      },
      {
        id: "10",
        day: "09",
        month: "JAN 2026",
        title: "Tech Innovation Summit",
        time: "09:00 AM - 05:00 PM",
        location: "CKCC",
      },
    ],
  },
];
