import { z } from "zod";

const googleMapsRegex =
  /^(https?:\/\/)?(www\.)?(google\.com\/maps|maps\.google\.com|goo\.gl\/maps)\/.+$/;

export const eventPostSchema = z.object({
  title: z.string().min(1, "Event title is required"),
  purpose: z.string().min(1, "Purpose selection is required"),
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  locationName: z.string().min(1, "Location name/address is required"),
  googleMapUrl: z
    .string()
    .url("Please enter a valid URL protocol (e.g., https://)")
    .regex(googleMapsRegex, "Must be a valid Google Maps sharing URL")
    .or(z.literal("")),
  status: z.enum(["draft", "active", "closed"]),
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
        filePath: z.string().min(1),
        isCover: z.boolean(),
      }),
    )
    .default([]),
});

export type EventPostFormValues = z.infer<typeof eventPostSchema>;
