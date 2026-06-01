import { z } from "zod";

export const eventPostSchema = z.object({
  title: z.string().min(1, "Event title is required"),
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  locationName: z.string().min(1, "Location name/address is required"),
  googleMapUrl: z
    .string()
    .url("Please enter a valid Google Maps URL")
    .or(z.string().length(0)),
  scheduleDate: z.string().optional(),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  targetGoal: z.coerce
    .number()
    .min(0, "Target goal cannot be negative")
    .optional(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long"),
  media: z
    .array(
      z.object({
        fileName: z.string(),
        filePath: z.string(),
        fileType: z.string().default("image"),
        isCover: z.boolean().default(false),
      }),
    )
    .optional(),
  // .default([]),
});

export type EventPostFormValues = z.infer<typeof eventPostSchema>;
