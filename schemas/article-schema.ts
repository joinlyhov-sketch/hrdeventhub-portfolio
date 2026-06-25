import { z } from "zod";

const safeTextRegex = /^[a-zA-Z0-9\s.,'()\-–—!]+$/;
const safeTextErrorMessage = "Special characters are not allowed";

export const articlePostSchema = z.object({
  title: z
    .string()
    .min(3, "Article title must be between 3 and 100 characters")
    .max(100, "Article title must not exceed 100 characters")
    .regex(safeTextRegex, {
      message: `Article title ${safeTextErrorMessage.toLowerCase()}`,
    }),
  description: z
    .string()
    .max(500, "Description must not exceed 500 characters")
    .optional(),
  status: z.enum(["draft", "active"]),
  isPinned: z.boolean().default(false),
});

export type ArticlePostFormValues = z.infer<typeof articlePostSchema>;
