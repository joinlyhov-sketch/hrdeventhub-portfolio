import { z } from "zod";

export const articlePostSchema = z.object({
  title: z.string().min(1, "Article title is required"),
  description: z.string().optional(),
  status: z.enum(["draft", "active"]),
  isPinned: z.boolean().default(false),
});

export type ArticlePostFormValues = z.infer<typeof articlePostSchema>;
