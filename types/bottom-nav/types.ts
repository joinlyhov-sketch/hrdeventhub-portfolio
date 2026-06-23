export type CheckInResult = {
  attendeeName: string;
  eventName: string;
  registeredAt: string;
  isLate?: boolean;
};

export type CheckInError = {
  message: string;
};