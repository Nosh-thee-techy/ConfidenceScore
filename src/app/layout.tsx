import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

import { PageTransition } from '@/components/PageTransition';

export const metadata: Metadata = {
  title: 'Confidence Score | Trust infrastructure',
  description:
    "Africa's trust infrastructure for information — WhatsApp (Angaza), web, and API. One engine. One standard. Three ways in.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} dark`}>
      <body className="bg-slate-950 text-slate-50 antialiased selection:bg-emerald-500/30 selection:text-emerald-200" suppressHydrationWarning>
        <PageTransition>
          {children}
        </PageTransition>
      </body>
    </html>
  );
}
