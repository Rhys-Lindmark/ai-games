import type { Metadata } from 'next';
import { Archivo_Black, IBM_Plex_Mono, Inter } from 'next/font/google';
import './globals.css';

const display = Archivo_Black({ variable: '--font-display', subsets: ['latin'], weight: '400' });
const sans = Inter({ variable: '--font-sans', subsets: ['latin'] });
const mono = IBM_Plex_Mono({ variable: '--font-mono', subsets: ['latin'], weight: ['400', '600'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://ai.rhyslindmark.com/games'),
  title: 'Games — Website Accelerator',
  description: 'Fast visual games for timelines, quantities, scale, and systems.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${display.variable} ${sans.variable} ${mono.variable}`}>{children}</body></html>;
}

