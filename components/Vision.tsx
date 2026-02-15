import type { VisionItem } from '@/lib/types';

type VisionProps = {
  title: string;
  items: VisionItem[];
};

function VisionIcon({ title }: { title: string }) {
  const key = title.trim().toLowerCase();

  if (key === 'attack') {
    return (
      <svg viewBox="0 0 24 24" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path d="M14.8 4.2l5 5-8 8-3.4.8.8-3.4 8-8z" />
        <path d="M13.1 5.9l5 5" />
        <path d="M8.8 15.2l-2.6 2.6" />
      </svg>
    );
  }

  if (key === 'defend') {
    return (
      <svg viewBox="0 0 24 24" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path d="M12 3l7 3v5c0 5-3.5 8.4-7 10-3.5-1.6-7-5-7-10V6l7-3z" />
        <path d="M12 7v10" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
      <path d="M9 12h6" />
      <path d="M12 9v6" />
    </svg>
  );
}

export default function Vision({ title, items }: VisionProps) {
  return (
    <section id="our-vision" className="border-y border-federation-line bg-federation-panelSoft">
      <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="mb-10 text-5xl uppercase leading-none text-white">{title}</h2>
        <div className="space-y-6">
          {items.map((item, index) => {
            const isDark = index % 2 === 1;

            return (
              <article
                key={item.title}
                className={`relative w-full rounded-sm border p-6 md:pl-24 ${
                  isDark
                    ? 'border-federation-line bg-black text-white'
                    : 'border-[#5d3620] bg-[#6f4024] text-white'
                }`}
              >
                <div
                  className={`left-6 top-1/2 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border md:absolute ${
                    isDark
                      ? 'border-federation-accent bg-federation-accent text-black'
                      : 'border-federation-accent bg-black text-federation-accent'
                  }`}
                >
                  <VisionIcon title={item.title} />
                </div>
                <h3 className="mt-4 text-3xl uppercase md:mt-0">{item.title}</h3>
                <p className={`mt-3 text-lg leading-relaxed ${isDark ? 'text-white/85' : 'text-white/90'}`}>
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
