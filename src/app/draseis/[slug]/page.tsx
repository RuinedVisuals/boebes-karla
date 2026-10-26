import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Experience from '@/components/providers/Experience';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import { LinkIndex } from '@/components/page/Blocks';
import { PostCover, PostGallery } from '@/components/post/PostMedia';
import { eventCategoryLabel } from '@/lib/content';
import { POSTS, fmtDate, getPost } from '@/lib/posts';
import { getHomeContent } from '@/lib/sanity/queries';
import s from '@/components/post/Post.module.scss';

export const revalidate = 60;

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getPost((await params).slug);
  if (!p) return {};
  return { title: `${p.title} · Μουσείο Λιμναίου Πολιτισμού Κάρλας`, description: p.body[0]?.slice(0, 160), openGraph: { images: [p.cover] } };
}

/** Post body: "## " is a subheading, a run of "- " lines becomes one list, anything else a paragraph. */
function Body({ lines }: { lines: string[] }) {
  const out: React.ReactNode[] = [];
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (l.startsWith('## ')) out.push(<h2 key={i}>{l.slice(3)}</h2>);
    else if (l.startsWith('- ')) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith('- ')) items.push(lines[i++].slice(2));
      i--;
      out.push(<ul key={i}>{items.map((t) => <li key={t}>{t}</li>)}</ul>);
    } else out.push(<p key={i}>{l}</p>);
  }
  return <>{out}</>;
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) notFound();
  const c = await getHomeContent();
  const next = POSTS[(POSTS.indexOf(p) + 1) % POSTS.length];

  return (
    <Experience settings={c.settings}>
      <Nav />
      <main id="main" className={s.post}>
        <header className={s.head}>
          <nav className={s.crumbs} aria-label="Διαδρομή">
            <Link href="/">Αρχική</Link><span aria-hidden="true">/</span>
            <Link href="/draseis">Δράσεις</Link><span aria-hidden="true">/</span>
            <span aria-current="page">{eventCategoryLabel[p.category]}</span>
          </nav>
          <h1 className={s.title}>{p.title}</h1>
          <div className={s.meta}>
            <span className={s.cat}>{eventCategoryLabel[p.category]}</span>
            <time dateTime={p.date}>{fmtDate(p.date)}</time>
          </div>
        </header>

        <PostCover src={p.cover} alt={p.title} youtubeId={p.youtubeId} />

        <div className={s.grid}>
          <aside className={s.side}>
            <Link href="/draseis" className={s.back}>← Όλες οι δράσεις</Link>
          </aside>
          <article className={s.body}>
            <Body lines={p.body} />
            {p.gallery && <PostGallery images={p.gallery} title={p.title} />}
            {p.links && <div className={s.links}><LinkIndex items={p.links} /></div>}
          </article>
        </div>

        <Link href={`/draseis/${next.slug}`} className={s.next}>
          <span className={s.cat}>Επόμενη δράση</span>
          <span className={s.nextTitle}>{next.title}</span>
          <span className={s.arrow} aria-hidden="true">→</span>
        </Link>
      </main>
      <Footer settings={c.settings} />
    </Experience>
  );
}
