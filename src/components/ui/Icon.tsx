type Name = 'arrow' | 'arrow-up-right' | 'prev' | 'next' | 'play' | 'pause' | 'close';

const PATHS: Record<Name, string> = {
  arrow: 'M3 9h12M10 4l5 5-5 5',
  'arrow-up-right': 'M5 13L13 5M6 5h7v7',
  prev: 'M11 3L5 9l6 6',
  next: 'M7 3l6 6-6 6',
  play: 'M5 3v12l10-6z',
  pause: 'M4 3h3.5v12H4zM10.5 3H14v12h-3.5z',
  close: 'M3 3l12 12M15 3L3 15',
};

/** Inline stroke icons, 18px grid. Decorative unless given a label by the parent control. */
export default function Icon({ name, size = 18 }: { name: Name; size?: number }) {
  const filled = name === 'play' || name === 'pause';
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" aria-hidden="true" focusable="false">
      <path d={PATHS[name]} fill={filled ? 'currentColor' : 'none'} stroke={filled ? 'none' : 'currentColor'} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
