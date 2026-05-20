import { TransactionDetail } from "../types/transaction-detail";

export const transactionDetailsData: TransactionDetail[] = [
  {
    id: "TXN-8842",
    processedDate: "Oct 24, 2023 • 14:32:45",
    amount: 125.0,
    currency: "USD",
    status: "Successful",
    paymentMethod: "WebPay",
    referenceId: "WB-365-FBXZ-99L1",
    transactionId: "#TXN-8842",
    payer: {
      id: "user-001",
      name: "Sarah Conner",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      badge: "ALUMNI",
      generation: "Generation 14th",
      skill: "Cyber Security",
      email: "l.connor@sky-alumni.edu",
      phone: "+855 12 345 678",
    },
    event: {
      id: "evt-001",
      title: "Design & Strategy Workshop",
      date: "Tomorrow",
      time: "1:30 PM - 5:00 PM",
      location: "CKCC",
      image: "/images/Workshop.webp",
      badge: "NEW EVENT",
      status: "Active",
    },
  },
];
