import { useAtom } from 'jotai';
import { heartsAtom } from '../store.js';
import { useEffect, useRef, useState } from 'react';
import './Hearts.css';

export default function Hearts({
  size = 48,
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

  return (
    <div
      style={{
        position: 'fixed',
        top,
        right,
        display: 'flex',
        gap: 8,
        fontSize: size,
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
            className={isDamaged ? 'heart-damage' : ''}
            style={{ opacity: isFilled ? 1 : 0.25 }}
          >
            ❤️
          </span>
        );
      })}
    </div>
  );
}
