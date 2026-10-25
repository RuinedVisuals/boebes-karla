import { Fragment } from 'react';
import s from './SplitChars.module.scss';

type Props = {
  text: string;
  /** Seconds before the first character moves. */
  delay?: number;
  /** Seconds between characters. */
  step?: number;
  /** Start the reveal (characters stay hidden below the line until true). */
  play?: boolean;
  className?: string;
};

/** Splits a line into masked characters that rise into place. The full text stays readable to screen readers. */
export default function SplitChars({ text, delay = 0, step = 0.03, play = true, className }: Props) {
  // Group characters by word so a line can wrap between words but never inside one.
  let start = 0;
  const words = text.split(' ').map((w) => { const item = { text: w, start }; start += Array.from(w).length + 1; return item; });
  return (
    <span className={`${s.line} ${play ? s.play : ''} ${className ?? ''}`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((w, wi) => (
          <Fragment key={wi}>
            <span className={s.word}>
              {Array.from(w.text).map((ch, i) => (
                <span key={i} className={s.ch} style={{ animationDelay: `${(delay + (w.start + i) * step).toFixed(3)}s` }}>
                  {ch}
                </span>
              ))}
            </span>
            {wi < words.length - 1 ? ' ' : null}
          </Fragment>
        ))}
      </span>
    </span>
  );
}
