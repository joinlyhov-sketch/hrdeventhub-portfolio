import { z } from "zod";

export const eventPostSchema = z
  .object({
    title: z
      .string()
      .min(3, "Title must be between 3 and 100 characters")
      .max(100, "Event title must not exceed 100 characters"),

    purpose: z
      .string()
      .min(1, "Purpose selection is required")
      .max(255, "Purpose must not exceed 255 characters"),

    date: z.string().min(1, "Date is required"),

    startTime: z.string().min(1, "Start time is required"),

    endTime: z.string().min(1, "End time is required"),

    locationName: z
      .string()
      .min(1, "Location name/address is required")
      .max(100, "Location name must not exceed 100 characters"),

    googleMapUrl: z
      .string()
      .trim()
      .min(1, "Google Maps URL is required")
      .max(800, "Google Maps URL must not exceed 800 characters")
      .url("Please enter a valid URL")
      .refine((url) => {
        try {
          const { hostname, pathname } = new URL(url);

          return (
            hostname === "maps.app.goo.gl" ||
            hostname === "maps.google.com" ||
            ((hostname === "www.google.com" || hostname === "google.com") &&
              pathname.startsWith("/maps"))
          );
        } catch {
          return false;
        }
      }, "Please enter a valid Google Maps URL"),
    status: z.enum(["active", "draft"]),
    scheduleDate: z.string().optional(),
    isPinned: z.boolean().default(false),
    price: z.coerce
      .number()
      .optional()
      .superRefine((val, ctx) => {
        if (val === undefined || val === null) return;

        if (val < 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Payment amount must be greater than or equal to 0",
          });
          return;
        }

        const strVal = val.toString();
        const parts = strVal.split(".");
        const integerPart = parts[0].replace("-", "");
        const fractionPart = parts[1] || "";

        if (integerPart.length > 10 || fractionPart.length > 2) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Payment amount format is invalid",
          });
        }
      }),

    targetGoal: z.coerce
      .number()
      .optional()
      .superRefine((val, ctx) => {
        if (val === undefined || val === null) return;

        if (val < 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Target goal must be greater than or equal to 0",
          });
          return;
        }

        const strVal = val.toString();
        const parts = strVal.split(".");
        const integerPart = parts[0].replace("-", "");
        const fractionPart = parts[1] || "";

        if (integerPart.length > 10 || fractionPart.length > 2) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Target goal format is invalid",
          });
        }
      }),

    description: z
      .string()
      .max(1300, "Description must not exceed 1300 characters")
      .optional(),

    media: z
      .array(
        z.object({
          filePath: z.string().min(1),
          isCover: z.boolean(),
        }),
      )
      .min(1, "Please upload at least one image")
      .max(10, "A post can have at most 10 media files"),
    workspaceId: z.string().optional(),

    paymentType: z.enum(["fixed", "flexible"]),
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
    if (data.paymentType === "fixed") {
      if (!data.price || Number(data.price) < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["price"],
          message: "Price is required and must be at least $1",
        });
      }
    }

    if (data.paymentType === "flexible") {
      if (!data.targetGoal || Number(data.targetGoal) < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["targetGoal"],
          message: "Target goal is required and must be at least $1",
        });
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
