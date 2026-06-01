export interface PostLocation {
  locationId: string;
  locationName?: string;      
  googleMapUrl: string;
  latitude: number;
  longitude: number;
}

export interface PostMedia {
  mediaId: string;
  fileName?: string;            
  filePath: string;
  fileType?: "image" | "document"; 
  isCover: boolean;
  createdAt: string;
}

export interface PostPayment {
  postPaymentId: string;
  paymentType: string;
  paymentAmount: number;
  donationGoal: number;
  amountRaised: number;
  createdAt: string;
  updatedAt: string;
  paymentAccId: string;
  billNo?: string;            
  khqrData?: string;            
  khqrDataBase64?: string;      
}

export interface PostCreator {  
  userId: string;
  fullName: string;
  profilePicture: string | null;
  role: string;
}

export type PostCategory = "event" | "announcement" | "article" | "poll" | "survey";

export interface Post {
  postId: string;
  category: PostCategory;
  title: string;
  content: string;
  purpose?: string;             
  scheduledAt?: string;        
  status: string;
  expiresAt: string;
  eventStart?: string;          
  eventEnd?: string;            
  createdAt: string;
  updatedAt: string;
  appUserId: string;
  location?: PostLocation;
  media?: PostMedia[];
  payment?: PostPayment;
  comments: unknown[];
  creator?: PostCreator;        
  pinned: boolean;
  published: boolean;
}

export interface PostsResponse {
  success: boolean;
  message: string;
  status: string;
  payload: Post[];
  timestamp: string;
}