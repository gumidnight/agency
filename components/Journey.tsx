import type { JourneyMilestone } from '@/lib/types';

type JourneyProps = {
  title: string;
  milestones: JourneyMilestone[];
};

export default function Journey({ title, milestones }: JourneyProps) {
  return (
    <section id="our-journey" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <h2 className="mb-12 text-4xl uppercase leading-none text-white">{title}</h2>
      <div className="relative mx-auto max-w-5xl">
        <div className="absolute left-5 top-0 h-full w-px bg-federation-accent/50 md:left-1/2 md:-translate-x-1/2" />
        <div className="space-y-8">
          {milestones.map((milestone) => (
            <article
              key={`${milestone.year}-${milestone.title}`}
              className="relative grid grid-cols-[2.25rem_1fr] gap-4 md:grid-cols-[1fr_auto_1fr] md:gap-6"
            >
              <div className="hidden md:block md:pt-1 md:text-right md:text-3xl md:font-semibold md:text-federation-accent">
                {milestone.year}
              </div>
              <div className="relative z-10 flex items-start md:items-center">
                <div className="mt-2 h-4 w-4 rounded-full border-2 border-federation-accent bg-black md:mt-0" />
              </div>
              <div className="rounded-sm border border-federation-line bg-federation-panel p-5">
                <p className="mb-2 text-xl font-semibold text-federation-accent md:hidden">{milestone.year}</p>
                <h3 className="text-xl uppercase text-white">{milestone.title}</h3>
                <p className="mt-2 text-white/80">{milestone.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
