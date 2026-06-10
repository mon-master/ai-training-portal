import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const days = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/days' }),
  schema: z.object({
    title: z.string(),
    day: z.number(),
    level: z.string(),
    duration: z.string(),
    goals: z.array(z.string()),
    deliverable: z.string(),
  }),
});

export const collections = { days };
