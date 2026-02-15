import Image from 'next/image';
import type { Partner } from '@/lib/types';

type PartnersProps = {
  title: string;
  items: Partner[];
};

export default function Partners({ title, items }: PartnersProps) {
  return (
    <section id="partners" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <h2 className="mb-10 text-4xl uppercase leading-none text-white">{title}</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((partner) => {
          const card = (
            <div className="relative h-24 w-full max-w-[300px]">
              <Image
                src={partner.logo}
                alt={partner.name || 'Partner logo'}
                fill
                quality={85}
                sizes="(max-width: 640px) 40vw, (max-width: 1024px) 28vw, 180px"
                className="object-contain grayscale transition group-hover:grayscale-0"
              />
            </div>
          );

          if (partner.href) {
            return (
              <a
                key={partner.logo}
                href={partner.href}
                target="_blank"
                rel="noreferrer noopener"
                className="group flex min-h-44 items-center justify-center rounded-sm border border-federation-line bg-federation-panel p-4 transition hover:border-federation-accent"
              >
                {card}
              </a>
            );
          }

          return (
            <div
              key={partner.logo}
              className="group flex min-h-44 items-center justify-center rounded-sm border border-federation-line bg-federation-panel p-4 transition hover:border-federation-accent"
            >
              {card}
            </div>
          );
        })}
      </div>
    </section>
  );
}
