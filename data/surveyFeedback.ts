export interface SurveyFeedback {
  id: number;
  title: string;
  date: string;
  totalResponse: number;
  status: "Active" | "Closed";
}
export interface User {
  id: number;
  name: string;
  email: string;
}
export const surveyFeedbacks: SurveyFeedback[] = [
  {
    id: 1,
    title: "Event Feedback",
    date: "2026/05/12",
    totalResponse: 45,
    status: "Active",
  },
  {
    id: 2,
    title: "Technical Training Review",
    date: "2026/05/12",
    totalResponse: 60,
    status: "Closed",
  },
  {
    id: 3,
    title: "Training Evaluation",
    date: "2026/05/12",
    totalResponse: 52,
    status: "Closed",
  },
  {
    id: 4,
    title: "Event Feedback",
    date: "2026/05/12",
    totalResponse: 54,
    status: "Closed",
  },
  {
    id: 5,
    title: "Event Feedback",
    date: "2026/05/12",
    totalResponse: 65,
    status: "Closed",
  },
  {
    id: 6,
    title: "Share Your Thoughts",
    date: "2026/05/12",
    totalResponse: 48,
    status: "Closed",
  },
];
