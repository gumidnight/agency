import Image from 'next/image';

type WhoWeAreProps = {
  title: string;
  text: string;
  image: string;
};

export default function WhoWeAre({ title, text, image }: WhoWeAreProps) {
  return (
    <section id="who-we-are" className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
      <div className="space-y-6">
        <h2 className="text-4xl uppercase leading-none text-white">{title}</h2>
        <p className="border-l-2 border-federation-accent pl-5 text-lg leading-relaxed text-white/85">{text}</p>
      </div>
      <div className="relative h-[320px] overflow-hidden rounded-md border border-federation-line shadow-glow sm:h-[400px]">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>
    </section>
  );
}
