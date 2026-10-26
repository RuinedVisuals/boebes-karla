'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useExperience } from '@/components/providers/Experience';
import SplitChars from '@/components/ui/SplitChars';
import s from './PageHero.module.scss';

type Props = {
  kicker: string;
  /** Two lines; the second is set in italic clay, like the homepage hero. */
  title: [string, string];
  lead: string;
  facts?: { k: string; v: string }[];
  image?: { src: string; alt: string };
};

/** Opening of an inner page: breadcrumb, a two-line title that rises after the intro, lead + facts. With `image` the photo fills the hero behind the text. */
export default function PageHero({ kicker, title, lead, facts, image }: Props) {
  const { introDone } = useExperience();
  return (
    <header className={`${s.hero} ${image ? s.withImage : ''} ${introDone ? s.go : ''}`}>
      {image && (
        <div className={s.bg}>
          <Image src={image.src} alt={image.alt} fill priority sizes="100vw" />
        </div>
      )}
      <div className={s.inner}>
        <nav className={s.crumbs} aria-label="Διαδρομή">
          <Link href="/">Αρχική</Link><span aria-hidden="true">/</span><span aria-current="page">{kicker}</span>
        </nav>
        <h1 className={s.title}>
          <SplitChars text={title[0]} play={introDone} delay={0.1} />
          <span className={s.second}><SplitChars text={title[1]} play={introDone} delay={0.35} /></span>
        </h1>
        <div className={s.foot}>
          <p className={s.lead}>{lead}</p>
          {facts && (
            <dl className={s.facts}>
              {facts.map((f) => <div key={f.k}><dt>{f.k}</dt><dd>{f.v}</dd></div>)}
            </dl>
          )}
        </div>
      </div>
    </header>
  );
}
