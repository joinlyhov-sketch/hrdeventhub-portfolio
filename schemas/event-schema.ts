import { z } from "zod";

export const eventPostSchema = z
  .object({
    title: z.string().min(1, "Event title is required"),

    purpose: z.string().min(1, "Purpose selection is required"),

    date: z.string().min(1, "Date is required"),

    startTime: z.string().min(1, "Start time is required"),

    endTime: z.string().min(1, "End time is required"),

    locationName: z.string().min(1, "Location name/address is required"),

    googleMapUrl: z
      .string()
      .min(1, "Google Maps URL is required")
      .url("Please enter a valid URL protocol (e.g., https://)"),

    status: z.enum(["draft", "active"]),

    scheduleDate: z.string().optional(),
    isPinned: z.boolean().default(false),
    price: z.coerce
      .number()
      .min(1, "Price at least 1$ and cannot be negative value"),

    targetGoal: z.coerce
      .number()
      .min(10, "Target goal at least 10$ cannot be negative value")
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
      .min(1, "Please upload at least one image"),
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
        message: "Event date must be in the future",
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

        const diffDays =
          (eventDate.getTime() - scheduleDate.getTime()) /
          (1000 * 60 * 60 * 24);

        if (diffDays < 1) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["scheduleDate"],
            message:
              "Schedule publish date must be at least 1 day before the event date",
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

    const coverImages = data.media.filter((image) => image.isCover);

    if (coverImages.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["media"],
        message: "One image must be selected as cover",
      });
    }

    if (coverImages.length > 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["media"],
        message: "Only one image can be selected as cover",
      });
    }
  });

export type EventPostFormValues = z.infer<typeof eventPostSchema>;
