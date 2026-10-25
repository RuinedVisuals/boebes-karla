import { groq } from 'next-sanity';
import { client, urlFor } from './client';
import { fallbackContent, type HomeContent, type Img, type ManifestoSegment } from '@/lib/content';

const IMAGE = `{ asset, alt, hotspot, crop }`;

export const HOME_QUERY = groq`{
  "settings": *[_type == "siteSettings"][0]{ phone, phoneDisplay, mobile, mobileDisplay, email, address, coords, hours, admission, virtualTourUrl, facebook, youtube },
  "home": *[_type == "homePage"][0]{
    heroImage ${IMAGE}, "heroVideo": heroVideo.asset->url, heroCaption, heroIntro,
    manifesto[]{ _type, text, image ${IMAGE} },
    "exhibits": exhibits[]->{ title, image ${IMAGE} },
    "halls": halls[]->{ kicker, title, text, image ${IMAGE} }
  },
  "events": *[_type == "activity"] | order(date desc)[0...7]{ title, category, date, image ${IMAGE}, "slug": slug.current },
  "videos": *[_type == "mediaItem" && type in ["video", "tv"]] | order(date desc)[0...8]{ title, outlet, date, image ${IMAGE}, youtubeId, url },
  "archive": *[_type == "archivePhoto"] | order(orderRank asc)[0...24]{ caption, year, "category": category->key, photographer, image ${IMAGE}, wide }
}`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const img = (i: any, fallback: Img, width = 1600): Img => (i?.asset ? { src: urlFor(i, width), alt: i.alt || '' } : fallback);
const fmtDate = (d?: string) => (d ? new Date(d).toLocaleDateString('el-GR', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.') : '');

/**
 * Homepage content. Uses Sanity when configured; any missing piece falls back to the local content
 * so the page never renders empty while the CMS is being filled in.
 */
export async function getHomeContent(): Promise<HomeContent> {
  if (!client) return fallbackContent;
  try {
    const d = await client.fetch(HOME_QUERY, {}, { next: { revalidate: 60, tags: ['home'] } });
    const f = fallbackContent;
    const h = d?.home ?? {};
    const manifesto: ManifestoSegment[] | undefined = h.manifesto?.length
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ? h.manifesto.map((m: any) => (m._type === 'manifestoImage' ? { kind: 'image', image: img(m.image, f.hero.image, 240) } : { kind: 'text', text: m.text || '' }))
      : undefined;
    return {
      settings: { ...f.settings, ...(d?.settings ?? {}) },
      hero: { image: img(h.heroImage, f.hero.image, 2400), video: h.heroVideo || null, caption: h.heroCaption || f.hero.caption, intro: h.heroIntro || f.hero.intro },
      manifesto: manifesto ?? f.manifesto,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      exhibits: h.exhibits?.length ? h.exhibits.map((e: any, i: number) => ({ title: e.title, image: img(e.image, f.exhibits[i % f.exhibits.length].image, 1200) })) : f.exhibits,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      halls: h.halls?.length ? h.halls.map((x: any, i: number) => ({ ...x, image: img(x.image, f.halls[i % f.halls.length].image, 900) })) : f.halls,
      events: d?.events?.length
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ? d.events.map((e: any, i: number) => ({ title: e.title, category: e.category, date: fmtDate(e.date), image: img(e.image, f.events[i % f.events.length].image, 600), href: '#events' /* switch to /draseis/${slug} once that route exists */ }))
        : f.events,
      videos: d?.videos?.length
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ? d.videos.map((v: any, i: number) => ({ title: v.title, meta: [v.outlet, fmtDate(v.date)].filter(Boolean).join(' · '), image: img(v.image, f.videos[i % f.videos.length].image, 1400), youtubeId: v.youtubeId || null, href: v.url || null }))
        : f.videos,
      archive: d?.archive?.length
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ? d.archive.map((p: any, i: number) => ({ caption: p.caption, year: p.year || '', category: p.category || 'fishing', photographer: p.photographer || null, image: img(p.image, f.archive[i % f.archive.length].image, 900), height: p.wide ? 200 : [300, 220, 260, 340, 240][i % 5] }))
        : f.archive,
    };
  } catch (err) {
    console.error('[sanity] falling back to local content', err);
    return fallbackContent;
  }
}
