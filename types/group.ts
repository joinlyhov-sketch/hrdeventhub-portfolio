export interface Group {
  id: number;
  type: "Internal" | "External";
  title: string;
  description: string;
  memberCount: number;
}