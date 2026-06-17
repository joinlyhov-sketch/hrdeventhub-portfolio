import { z } from "zod";

export const articlePostSchema = z.object({
  title: z
    .string()
    .min(3, "Article title must be between 3 and 100 characters")
    .max(100, "Article title must not exceed 100 characters"),
  description: z
    .string()
    .max(1300, "Description must not exceed 1300 characters")
    .optional(),
  status: z.enum(["draft", "active"]),
  isPinned: z.boolean().default(false),
});

export type ArticlePostFormValues = z.infer<typeof articlePostSchema>;
