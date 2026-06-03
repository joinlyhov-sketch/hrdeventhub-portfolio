import { z } from "zod";

const googleMapsRegex =
  /^(https?:\/\/)?(www\.)?(google\.com\/maps|maps\.google\.com|goo\.gl\/maps)\/.+$/;

export const announcementPostSchema = z.object({
  title: z.string().min(1, "Announcement title is required"),
  purpose: z.string().min(1, "Purpose field is required"),
  status: z.enum(["active", "draft"]),
  date: z.string().min(1, "Event date selection is required"),
  startTime: z.string().min(1, "Start time parameter selection is required"),
  endTime: z.string().min(1, "End time parameter selection is required"),
  locationName: z
    .string()
    .min(1, "Location descriptive layout name is required"),
  googleMapUrl: z
    .string()
    .url("Please enter a valid URL protocol (e.g., https://)")
    .regex(googleMapsRegex, "Must be a valid Google Maps sharing URL")
    .or(z.literal("")),
  scheduleDate: z.string().optional().or(z.literal("")),
  description: z
    .string()
    .min(1, "Content description statement body field is required"),
  media: z
    .array(
      z.object({
        filePath: z.string(),
        isCover: z.boolean(),
      }),
    )
    .default([]),
});

export type AnnouncementPostFormValues = z.infer<typeof announcementPostSchema>;
