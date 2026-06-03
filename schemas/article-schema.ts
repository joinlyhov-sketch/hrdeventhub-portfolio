import { z } from "zod";

export const articlePostSchema = z.object({
  title: z.string().min(1, "Article title is required"),
  description: z.string().min(1, "Article description is required"),
  status: z.enum(["draft", "active"]),
});

export type ArticlePostFormValues = z.infer<typeof articlePostSchema>;
