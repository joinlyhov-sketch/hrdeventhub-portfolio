export type TransactionStatus = "Successful" | "Failed" | "Pending";
export type PaymentMethod = "WebPay" | "PayPal" | "Card";
export type EventStatus = "Published" | "Active" | "Cancel";

export interface Transaction {
  id: string;
  username: string;
  avatar?: string;
  amount: number;
  payment: PaymentMethod;
  status: TransactionStatus;
  timestamp: string;
  eventId?: string;
}

export interface Event {
  id: string;
  date: string;
  title: string;
  status: EventStatus;
  amount: number;
  attendees: number;
  year: number;
}

export interface StatCard {
  title: string;
  value: string;
  icon?: string;
  customIcon?: React.ReactNode;
  color: string;
  bgColor: string;
}
