import Image from 'next/image';
import type { TeamMember } from '@/lib/types';

type TeamProps = {
  title: string;
  members: TeamMember[];
};

export default function Team({ title, members }: TeamProps) {
  return (
    <section id="team" className="border-y border-federation-line bg-federation-panelSoft">
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <h2 className="mb-24 text-5xl uppercase text-white">{title}</h2>

        <div className="grid gap-10 sm:grid-cols-2 xl:grid-cols-5">
          {members.map((member) => (
            <article key={member.name} className="relative rounded-sm border border-federation-line bg-black px-4 pb-8 pt-24">
              <div className="absolute left-1/2 top-0 h-36 w-36 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-4 border-federation-accent bg-federation-panel shadow-glow">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover grayscale"
                  style={{ transform: `scale(${member.imageZoom ?? 1})` }}
                />
              </div>
              <h3 className="text-center text-2xl uppercase text-federation-accent">{member.name}</h3>
              <p className="mt-1 text-center text-sm uppercase tracking-[0.12em] text-white">{member.role}</p>
              <p className="mt-6 text-base leading-relaxed text-white/85">{member.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
