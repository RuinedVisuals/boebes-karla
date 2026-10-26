import s from './SectionHead.module.scss';

type Props = {
  index: string;
  kicker: string;
  title: string;
  id?: string;
  /** Light text for dark sections. */
  tone?: 'dark' | 'light';
  className?: string;
};

/**
 * One consistent, quiet section heading: catalogue index + rule + kicker, then a sentence-case serif title.
 * Keeps hierarchy editorial — the content (images, film, objects) carries the size, not the headings.
 */
export default function SectionHead({ index, kicker, title, id, tone = 'dark', className }: Props) {
  return (
    <div className={`${s.head} ${tone === 'light' ? s.light : ''} ${className ?? ''}`}>
      <div className={s.meta}>
        <span className={s.index}>{index}</span>
        <span className={s.rule} aria-hidden="true" />
        <span className={s.kicker}>{kicker}</span>
      </div>
      <h2 id={id} className={s.title}>{title}</h2>
    </div>
  );
}
