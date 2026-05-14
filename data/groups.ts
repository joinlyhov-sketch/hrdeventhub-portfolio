export interface Group {
  id: number;
  type: "Internal" | "External";
  title: string;
  description: string;
  memberCount: number;
}
export const mockGroups: Group[] = [
  {
    id: 1,
    type: "Internal",
    title: "14th Generation Group",
    description: "Connect with the 14th generation and grow your network.",
    memberCount: 52,
  },
  {
    id: 2,
    type: "External",
    title: "HRD Center Alumni",
    description: "Connect with the 14th generation and grow your network.",
    memberCount: 52,
  },
  {
    id: 3,
    type: "Internal",
    title: "14th Generation Group",
    description: "Connect with the 14th generation and grow your network.",
    memberCount: 52,
  },
  {
    id: 4,
    type: "Internal",
    title: "14th Generation Group",
    description: "Connect with the 14th generation and grow your network.",
    memberCount: 52,
  },
  {
    id: 5,
    type: "Internal",
    title: "14th Generation Group",
    description: "Connect with the 14th generation and grow your network.",
    memberCount: 52,
  },
  {
    id: 6,
    type: "External",
    title: "HRD Center Alumni",
    description: "Connect with the 14th generation and grow your network.",
    memberCount: 52,
  },
];