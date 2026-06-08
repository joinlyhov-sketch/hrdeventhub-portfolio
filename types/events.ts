export interface EventLocation {
  locationName: string;
}

export interface EventItem {
  postId: string;
  title: string;
  eventStart: string;
  eventEnd: string;
  location: EventLocation | null;
}

export interface EventResponse {
  success: boolean;
  message: string;
  status: string;
  payload: EventItem[];
}
