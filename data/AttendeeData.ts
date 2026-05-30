export interface AttendeeData {
  no: number;
  avatar: string;
  name: string;
  gender: "Male" | "Female";
  timestamp: string;
  remark: string;
  amount: number;
  status: "Successful" | "Pending" | "Failed";
}
