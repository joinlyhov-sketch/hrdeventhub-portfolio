import { z } from "zod";

export const articlePostSchema = z.object({
  title: z.string().min(1, "Article title is required"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long"),
  media: z
    .array(
      z.object({
        fileName: z.string(),
        filePath: z.string(),
        fileType: z.string(),
        isCover: z.boolean(),
      }),
    )
    .default([]),
});

export type ArticlePostFormValues = z.infer<typeof articlePostSchema>;
