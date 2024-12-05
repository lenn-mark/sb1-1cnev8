import { z } from 'zod';

export const createTagSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Tag name is required'),
    color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format')
  })
});