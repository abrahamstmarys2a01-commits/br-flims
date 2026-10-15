import { z } from 'zod';

export const updatePageSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  subtitle: z.string().max(300).optional(),
  content: z.string().min(1).optional(),
  sections: z
    .array(
      z.object({
        title: z.string().min(1),
        content: z.string().min(1),
      })
    )
    .optional(),
  isPublished: z.boolean().optional(),
});
