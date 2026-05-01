import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const dudasCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/dudas" }),
  schema: z.object({
    pregunta: z.string(),
    orden: z.number().optional().default(0),
  }),
});

const encuentrosCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/encuentros" }),
  schema: z.object({
    nombre: z.string().optional(),
    dia: z.string().optional(),
    horario: z.string().optional(),
    direccion: z.string().optional(),
    instagram_user: z.string().optional(),
    instagram_url: z.string().optional(),
    map_iframe: z.string().optional(),
    orden: z.number().optional().default(0),
  }),
});

const comunidadCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/comunidad" }),
  schema: z.object({
    autor: z.string().optional(),
  }),
});

export const collections = {
  'dudas': dudasCollection,
  'encuentros': encuentrosCollection,
  'comunidad': comunidadCollection,
};
