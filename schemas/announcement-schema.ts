import { z } from "zod";

export const announcementPostSchema = z.object({
  title: z.string().min(1, "Announcement title is required"),
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  locationName: z.string().min(1, "Location address is required"),
  googleMapUrl: z.string().optional(),
  scheduleDate: z.string().optional(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long"),
  media: z
    .array(
      z.object({
        fileName: z.string(),
        filePath: z.string(),
        fileType: z.string(),
        isCover: z.boolean(),
      }),
    )
    .default([]),
});

export type AnnouncementPostFormValues = z.infer<typeof announcementPostSchema>;
