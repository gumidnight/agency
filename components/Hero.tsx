import Link from 'next/link';

type HeroProps = {
  badge: string;
  title: string;
  subtitle: string;
  image: string;
  ctaLabel: string;
  ctaHref: string;
};

export default function Hero({ badge, title, subtitle, image, ctaLabel, ctaHref }: HeroProps) {
  return (
    <section
      id="top"
      className="relative flex min-h-[80vh] w-full items-end overflow-hidden border-b border-federation-line bg-cover bg-no-repeat bg-[position:78%_28%] md:bg-contain md:bg-[position:68%_center]"
      style={{
        backgroundColor: '#050505',
        backgroundImage: `url('${image}')`
      }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(5,5,5,0.86),rgba(5,5,5,0.68))] md:bg-[linear-gradient(to_top,rgba(5,5,5,0.78),rgba(5,5,5,0.24))]" />
      <div className="absolute inset-0 bg-black/30 md:bg-black/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,rgba(249,115,22,0.22),transparent_42%)]" />
      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 pb-20 pt-56 sm:px-6 sm:pt-48 lg:px-8 lg:pt-40">
        <p className="text-sm uppercase tracking-[0.22em] text-federation-accent">{badge}</p>
        <h1 className="max-w-4xl text-4xl font-semibold uppercase leading-[1.02] text-white sm:text-5xl lg:text-7xl">
          {title}
        </h1>
        <p className="max-w-3xl text-base text-white/80 sm:text-lg">{subtitle}</p>
        <div>
          <Link
            href={ctaHref}
            className="inline-flex rounded-sm border border-federation-accent bg-federation-accent px-7 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-transparent hover:text-federation-accent"
          >
            {ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
