import { z } from "zod";

export const postFrontmatterSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.string(),
  slug: z.string().optional(),
  tags: z.array(z.string()).default([]),
  locale: z.enum(["en", "es"]),
});

export type PostFrontmatter = z.infer<typeof postFrontmatterSchema>;
