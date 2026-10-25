'use client';

import type { ReactNode } from 'react';
import { useExperience } from '@/components/providers/Experience';
import Icon from './Icon';
import s from './Button.module.scss';

type Variant = 'clay' | 'ink' | 'line' | 'cream' | 'ghost';

type Props = {
  children: ReactNode;
  variant?: Variant;
  arrow?: boolean;
  /** In-page section id: plays the page transition, then jumps there. */
  to?: string;
  /** Title shown on the transition curtain (defaults to the label). */
  toTitle?: string;
  href?: string;
  external?: boolean;
  onClick?: () => void;
  cursor?: string;
};

/** Pill button. With `to` it runs the cinematic transition; with `href` it is a normal link. */
export default function Button({ children, variant = 'clay', arrow, to, toTitle, href, external, onClick, cursor }: Props) {
  const { go } = useExperience();
  const cls = `${s.btn} ${s[variant]}`;
  const inner = (<>{children}{arrow && <Icon name="arrow" />}</>);
  if (to) {
    return (
      <a href={`#${to}`} className={cls} data-cursor={cursor} onClick={(e) => { e.preventDefault(); go(toTitle ?? String(children), to); }}>
        {inner}
      </a>
    );
  }
  if (href) {
    return (
      <a href={href} className={cls} data-cursor={cursor} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {inner}
      </a>
    );
  }
  return <button type="button" className={cls} onClick={onClick} data-cursor={cursor}>{inner}</button>;
}
