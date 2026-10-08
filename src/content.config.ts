import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Accepts "YYYY-MM" or "YYYY-MM-DD".
const dateString = z
  .string()
  .regex(/^\d{4}-\d{2}(-\d{2})?$/, 'date must be "YYYY-MM" or "YYYY-MM-DD"');

const tag = z.object({
  name: z.string().min(1, 'tag name is required'),
  type: z.enum(['main', 'sub'], {
    errorMap: () => ({ message: 'tag type must be "main" or "sub"' }),
  }),
});

const commits = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/commits' }),
  schema: z.object({
    id: z.string().min(1, 'id is required'),
    title: z.string().min(1, 'title is required'),
    description: z.string().min(1, 'description is required'),
    date: dateString,
    tags: z.array(tag).min(1, 'at least one tag is required'),
    tech_stack: z.array(z.string()).optional(),
  }),
});

const insights = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/insights' }),
  schema: z.object({
    title: z.string().min(1, 'title is required'),
    date: dateString,
    tags: z.array(tag).min(1, 'at least one tag is required'),
    tech_stack: z.array(z.string()).optional(),
  }),
});

export const collections = { commits, insights };
