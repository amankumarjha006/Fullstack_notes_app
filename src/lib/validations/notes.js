import { z } from "zod";

export const createNoteSchema = z
  .object({
    title: z.string().max(255).optional(),
    content: z.string().optional(),
  })
  .optional()
  .default({});

export const updateNoteSchema = z.object({
  title: z.string().max(255).optional(),
  content: z.string().optional(),
  archived: z.boolean().optional(),
  visibility: z.enum(["private", "public"]).optional(),
});
