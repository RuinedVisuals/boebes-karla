import Image from 'next/image';
import type { ReactNode } from 'react';
import s from './Blocks.module.scss';

/**
 * Editorial building blocks for the inner pages, in the manner of a museum catalogue / magazine:
 * numbered chapters with oversized headings, a timeline of large years, pull quotes and an index of links.
 * Server components: no client JS.
 */

type Img = { src: string; alt: string };

/** A chapter: index + heading, text in a column, and up to two photos stacked on a clean grid with numbered captions. */
export function Chapter({ id, index, kicker, title, children, images, tone = 'paper' }: {
  id?: string;
  index: string;
  kicker: string;
  title: string;
  children: ReactNode;
  images?: [Img] | [Img, Img];
  tone?: 'paper' | 'sand' | 'ink';
}) {
  return (
    <section id={id} className={`${s.chapter} ${s[tone]}`} aria-labelledby={id ? `${id}-title` : undefined}>
      <div className={s.inner}>
        <header className={s.chHead}>
          <span className={s.big} aria-hidden="true">{index}</span>
          <div>
            <span className={s.kicker}>{kicker}</span>
            <h2 id={id ? `${id}-title` : undefined} className={s.chTitle}>{title}</h2>
          </div>
        </header>
        <div className={`${s.body} ${images ? '' : s.wide}`}>{children}</div>
        {images && (
          <div className={s.collage}>
            {images.map((im, i) => (
              <figure key={im.src} className={i === 0 ? s.main : s.second}>
                <div className={s.frame}><Image src={im.src} alt={im.alt} fill sizes={i === 0 ? '(max-width: 980px) 100vw, 42vw' : '(max-width: 980px) 70vw, 26vw'} /></div>
                <figcaption className={s.cap}><span>Εικ. {String(i + 1).padStart(2, '0')}</span>{im.alt}</figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/** Oversized years with the event beside each; reads top to bottom like a catalogue chronology. */
export function Timeline({ id, index, kicker, title, items, tone = 'sand' }: {
  id?: string;
  index: string;
  kicker: string;
  title: string;
  items: { year: string; title: string; text?: string }[];
  tone?: 'paper' | 'sand' | 'ink';
}) {
  return (
    <section id={id} className={`${s.timeline} ${s[tone]}`}>
      <div className={s.inner}>
        <header className={s.chHead}>
          <span className={s.big} aria-hidden="true">{index}</span>
          <div>
            <span className={s.kicker}>{kicker}</span>
            <h2 className={s.chTitle}>{title}</h2>
          </div>
        </header>
        <ol className={s.years}>
          {items.map((it) => (
            <li key={it.year + it.title} className={s.year}>
              <span className={s.yearNum}>{it.year}</span>
              <div className={s.yearBody}>
                <h3 className={s.yearTitle}>{it.title}</h3>
                {it.text && <p>{it.text}</p>}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** A full-width pull quote, set large in italic serif. */
export function Quote({ children, cite }: { children: ReactNode; cite: string }) {
  return (
    <section className={s.quote}>
      <figure className={s.inner}>
        <span className={s.mark} aria-hidden="true">«</span>
        <blockquote className={s.quoteText}>{children}</blockquote>
        <figcaption className={s.kicker}>{cite}</figcaption>
      </figure>
    </section>
  );
}

/** Numbered index of links (articles, press, resources). External links open in a new tab. */
export function LinkIndex({ items }: { items: { title: string; href: string; meta?: string }[] }) {
  return (
    <ol className={s.links}>
      {items.map((it, i) => {
        const external = it.href.startsWith('http');
        return (
          <li key={it.href}>
            <a href={it.href} className={s.link} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
              <span className={s.n}>{String(i + 1).padStart(2, '0')}</span>
              <span className={s.linkTitle}>{it.title}</span>
              {it.meta && <span className={s.meta}>{it.meta}</span>}
              <span className={s.arrow} aria-hidden="true">{external ? '↗' : '→'}</span>
              {external && <span className="sr-only"> (ανοίγει σε νέα καρτέλα)</span>}
            </a>
          </li>
        );
      })}
    </ol>
  );
}

/** A small cloud of words (species, materials…). */
export function Tags({ label, items }: { label: string; items: string[] }) {
  return (
    <div className={s.tags}>
      <span className={s.kicker}>{label}</span>
      <ul>{items.map((t) => <li key={t}>{t}</li>)}</ul>
    </div>
  );
}
