import type { Metadata } from 'next';
import { Rajdhani, Teko } from 'next/font/google';
import './globals.css';
import { siteContent } from '@/lib/site-content';

const bodyFont = Rajdhani({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700']
});

const displayFont = Teko({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700']
});

export function generateMetadata(): Metadata {
  const title = siteContent.seo.title;
  const description = siteContent.seo.description;
  const ogImage = siteContent.seo.ogImage;
  const metadataBase = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000');

  return {
    title,
    description,
    metadataBase,
    icons: {
      icon: '/icon.png',
      shortcut: '/icon.png',
      apple: '/icon.png'
    },
    keywords: siteContent.seo.keywords,
    openGraph: {
      type: 'website',
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage]
    }
  };
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bodyFont.variable} ${displayFont.variable} font-[var(--font-body)] antialiased`}>
        {children}
      </body>
    </html>
  );
}
