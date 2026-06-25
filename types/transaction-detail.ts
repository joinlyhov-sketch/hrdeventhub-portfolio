import { EventStatus, TransactionStatus } from "./transaction";

export interface Payer {
  id: string;
  name: string;
  avatar: string;
  badge: string;
  generation: string;
  skill: string;
  email: string;
  phone: string;
}

export interface EventDetail {
  id: string;
  workspaceId: string;
  title: string;
  date: string;
  time: string;
  location: string;
  image: string;
  badge: string;
  status: EventStatus;
}

export interface TransactionDetail {
  id: string;
  processedDate: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  referenceId: string;
  transactionId: string;
  senderBankName: string;
  payer: Payer;
  event: EventDetail;
}