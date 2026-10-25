'use client';

import SplitChars from '@/components/ui/SplitChars';
import s from './Cover.module.scss';

type Props = { title: string; num: string; phase: 'hold' | 'in' | 'out' };

/** Page-transition curtain: rises as a wave, shows the destination, lifts as a wave. */
export default function Cover({ title, num, phase }: Props) {
  return (
    <div className={`${s.cover} ${phase === 'in' ? s.in : ''} ${phase === 'out' ? s.out : ''}`} aria-live="polite">
      <div className={s.inner}>
        <span className={s.num}>{num}</span>
        <p className={s.title}>
          <SplitChars text={title} delay={phase === 'in' ? 0.55 : 0.1} step={0.04} play />
        </p>
        <span className={s.label}>Μουσείο Λιμναίου Πολιτισμού Κάρλας</span>
      </div>
    </div>
  );
}
