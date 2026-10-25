import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '';
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
export const apiVersion = '2025-01-01';

/** Null until a project id is configured — the site then renders from local fallback content. */
export const client = projectId
  ? createClient({ projectId, dataset, apiVersion, useCdn: true, perspective: 'published' })
  : null;

const builder = projectId ? imageUrlBuilder({ projectId, dataset }) : null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any, width = 1600): string {
  if (!builder || !source) return '';
  return builder.image(source).width(width).auto('format').quality(80).url();
}
