import type { Metadata } from 'next';
import { Syne, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import Schema from '@/components/Schema';

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['400', '600', '700', '800'],
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-plex-mono',
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://harithdivarathna.com'),
  title: {
    default: 'Harith Senura Divarathna | Fullstack Software Engineer',
    template: '%s | Harith Divarathna',
  },
  description: 'Harith Senura Divarathna is a Fullstack Software Engineer specializing in scalable web and mobile products. Expert in Next.js, React Native, Node.js, and Cybersecurity.',
  keywords: [
    'Harith Divarathna',
    'Harith Senura Divarathna',
    'Harith',
    'Divarathna',
    'Senura Divarathna',
    'Fullstack Developer Sri Lanka',
    'Software Engineer Sri Lanka',
    'SLIIT Software Engineering',
    'ESOFT Cybersecurity',
    'React Native Developer',
    'Next.js Expert',
    'Node.js Developer',
    'Mobile App Developer Sri Lanka',
    'Web Developer Colombo',
    'Portfolio',
    'Tech Stack GSAP',
  ],
  authors: [{ name: 'Harith Senura Divarathna' }],
  creator: 'Harith Senura Divarathna',
  openGraph: {
    type: 'website',
    locale: 'en_LK',
    url: 'https://harithdivarathna.com',
    title: 'Harith Senura Divarathna | Fullstack Software Engineer',
    description: 'Explore the portfolio of Harith Divarathna, a Fullstack Developer crafting premium digital experiences.',
    siteName: 'Harith Divarathna Portfolio',
    images: [
      {
        url: '/icon.png',
        width: 1200,
        height: 630,
        alt: 'Harith Divarathna Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Harith Senura Divarathna | Fullstack Software Engineer',
    description: 'Fullstack Software Engineer specializing in modern web and mobile applications.',
    images: ['/icon.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://harithdivarathna.com',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" className={`${syne.variable} ${plexMono.variable}`}>
      <body>
        <Schema />
        {children}
      </body>
    </html>
  );
}
