import { z } from "zod";

export const announcementPostSchema = z
  .object({
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
      .min(1, "GoogleMapUrl is required")
      .url("Please enter a valid URL protocol (e.g., https://)"),
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
      .min(1, "Please upload at least one image"),
    // .default([]),
  })
  .superRefine((data, ctx) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const eventDate = new Date(data.date);
    eventDate.setHours(0, 0, 0, 0);

    if (eventDate <= today) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["date"],
        message: "Event date cannot be in today and past ",
      });
    }

    if (data.status === "draft") {
      if (!data.scheduleDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["scheduleDate"],
          message: "Schedule publish date is required",
        });
      } else {
        const scheduleDate = new Date(data.scheduleDate);
        scheduleDate.setHours(0, 0, 0, 0);

        if (scheduleDate <= today) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["scheduleDate"],
            message: "Schedule publish date must be in the future",
          });
        }
      }
    }

    if (data.startTime && data.endTime) {
      const [startHour, startMinute] = data.startTime.split(":").map(Number);

      const [endHour, endMinute] = data.endTime.split(":").map(Number);

      const startMinutes = startHour * 60 + startMinute;
      const endMinutes = endHour * 60 + endMinute;

      if (endMinutes <= startMinutes) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["endTime"],
          message: "End time must be later than start time",
        });
      }
    }
  });

export type AnnouncementPostFormValues = z.infer<typeof announcementPostSchema>;
