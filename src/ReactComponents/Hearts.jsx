import { useAtom } from 'jotai';
import { heartsAtom } from '../store.js';
import { useEffect, useRef, useState } from 'react';
import './Hearts.css';

export default function Hearts({
  size = 96,
  top = 20,
  right = 20,
  maxHearts = 3,
}) {
  const [hearts] = useAtom(heartsAtom);
  const prevHearts = useRef(hearts);
  const [damagedIndex, setDamagedIndex] = useState(null);

  useEffect(() => {
    if (hearts < prevHearts.current) {
      // animate the heart that was just lost
      setDamagedIndex(hearts);
      setTimeout(() => setDamagedIndex(null), 400);
    }
    prevHearts.current = hearts;
  }, [hearts]);

  // Determine a responsive size on mobile devices so hearts are larger and
  // easier to tap/see. Apply a global shrink factor of 0.85 to make hearts
  // 15% smaller overall as requested.
  const SHRINK = 0.85;
  const isSmall = (typeof window !== 'undefined') && (window.matchMedia('(max-width:640px), (max-height:640px)').matches);
  const scaleMultiplier = isSmall ? 1.5 : 1;
  const effectiveSize = Math.round(size * scaleMultiplier * SHRINK);
  const effectiveTop = typeof top === 'number' ? (isSmall ? Math.round((top + 12) * SHRINK) : Math.round(top * SHRINK)) : top;
  const effectiveRight = typeof right === 'number' ? (isSmall ? Math.round((right + 8) * SHRINK) : Math.round(right * SHRINK)) : right;
  const effectiveGap = Math.round(10 * scaleMultiplier * SHRINK);

  return (
    <div
      style={{
        position: 'fixed',
        top: effectiveTop,
        right: effectiveRight,
        display: 'flex',
        gap: effectiveGap,
        fontSize: effectiveSize,
        zIndex: 100,
        pointerEvents: 'none',
      }}
    >
      {Array.from({ length: maxHearts }).map((_, i) => {
        const isFilled = i < hearts;
        const isDamaged = i === damagedIndex;

        return (
          <span
            key={i}
            className={`heart ${isDamaged ? 'heart-damage' : ''}`}
            style={{
              opacity: isFilled ? 1 : 0.25,
              ['--heart-size']: `${effectiveSize}px`,
            }}
            aria-hidden={true}
          />
        );
      })}
    </div>
  );
}
