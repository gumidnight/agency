'use client';

import { useEffect, useRef, useState } from 'react';

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
  y?: number;
};

export default function Reveal({ children, className, delayMs = 0, y = 18 }: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      { threshold: 0.18, rootMargin: '0px 0px -6% 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className ?? ''}`}
      style={{
        transitionDelay: `${delayMs}ms`,
        ['--reveal-y' as string]: `${y}px`
      }}
    >
      {children}
    </div>
  );
}
