'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { NavigationItem } from '@/lib/types';

type HeaderProps = {
  logo: string;
  orgName: string;
  navigation: NavigationItem[];
};

export default function Header({ logo, orgName, navigation }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const midpoint = Math.ceil(navigation.length / 2);
  const leftItems = navigation.slice(0, midpoint);
  const rightItems = navigation.slice(midpoint);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? 'border-federation-line bg-black/95 backdrop-blur'
          : 'border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <nav className="hidden flex-1 items-center justify-end gap-7 md:flex">
          {leftItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm uppercase tracking-[0.18em] text-white/85 transition hover:text-federation-accent"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="#top"
          className="flex shrink-0 items-center justify-center px-1 py-1"
        >
          <img src={logo} alt={`${orgName} logo`} className="h-20 w-auto shrink-0 object-contain" />
        </Link>

        <nav className="hidden flex-1 items-center gap-7 md:flex">
          {rightItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm uppercase tracking-[0.18em] text-white/85 transition hover:text-federation-accent"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <nav className="mx-auto flex max-w-7xl items-center justify-center gap-5 px-4 pb-4 md:hidden">
        {navigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-[11px] uppercase tracking-[0.15em] text-white/85 transition hover:text-federation-accent"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
