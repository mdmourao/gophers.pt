import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    authors: z
      .array(
        z.object({
          name: z.string(),
          x: z
            .string()
            .transform((handle) => handle.replace(/^@/, ''))
            .optional(),
        }),
      )
      .default([{ name: 'Gophers Portugal' }]),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
