import Link from 'next/link';
import type { SocialLink } from '@/lib/types';

type FooterProps = {
  logo: string;
  orgName: string;
  fullName: string;
  contactTitle: string;
  socialTitle: string;
  email: string;
  phone: string;
  address: string;
  copyright: string;
  socials: SocialLink[];
};

function SocialIcon({ label }: { label: string }) {
  const key = label.toLowerCase();

  if (key.includes('instagram')) {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4.2" />
        <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (key.includes('youtube')) {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M22 12s0-3.3-.4-4.9a3 3 0 0 0-2.1-2.1C17.9 4.5 12 4.5 12 4.5s-5.9 0-7.5.5a3 3 0 0 0-2.1 2.1C2 8.7 2 12 2 12s0 3.3.4 4.9a3 3 0 0 0 2.1 2.1c1.6.5 7.5.5 7.5.5s5.9 0 7.5-.5a3 3 0 0 0 2.1-2.1c.4-1.6.4-4.9.4-4.9z" />
        <path d="M10 9.2l5 2.8-5 2.8z" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M9 10.5c0-1.8 1.5-3.3 3.3-3.3h3.7v3.5h-3.7c-.1 0-.2.1-.2.2v2.1c0 .1.1.2.2.2h3.7V17h-3.7A3.3 3.3 0 0 1 9 13.7z" />
      <path d="M8.1 8.1c2.9-1.6 5.7-1.6 8.6 0M8.1 15.9c2.9 1.6 5.7 1.6 8.6 0" />
      <path d="M6.5 9.7A8.6 8.6 0 0 0 5 12a8.6 8.6 0 0 0 1.5 2.3" />
      <path d="M17.5 9.7A8.6 8.6 0 0 1 19 12a8.6 8.6 0 0 1-1.5 2.3" />
    </svg>
  );
}

export default function Footer({
  logo,
  orgName,
  fullName,
  contactTitle,
  socialTitle,
  email,
  phone,
  address,
  copyright,
  socials
}: FooterProps) {
  return (
    <footer className="border-t border-federation-line bg-black">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <div className="inline-flex px-1 py-1">
            <img src={logo} alt={`${orgName} logo`} className="h-20 w-auto object-contain" />
          </div>
          <p className="mt-3 text-sm text-white/70">{fullName}</p>
        </div>

        <div>
          <h3 className="text-sm uppercase tracking-[0.2em] text-federation-accent">{contactTitle}</h3>
          <ul className="mt-3 space-y-2 text-white/80">
            <li>{email}</li>
            <li>{phone}</li>
            <li>{address}</li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm uppercase tracking-[0.2em] text-federation-accent">{socialTitle}</h3>
          <div className="mt-3 flex gap-4">
            {socials.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.08em] text-white/75 transition hover:text-federation-accent"
              >
                <SocialIcon label={social.label} />
                {social.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-federation-line py-4 text-center text-xs uppercase tracking-[0.1em] text-white/60">
        {copyright}
      </div>
    </footer>
  );
}
