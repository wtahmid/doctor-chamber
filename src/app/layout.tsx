// Root layout — providers, metadata, global CSS, skip link, header, footer.

import type { Metadata, Viewport } from 'next';
import { I18nProvider } from '@/lib/i18n';
import { siteConfig } from '@/lib/config';
import './globals.css';
import { Header } from '@/components/layout/Header';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s · ${siteConfig.name}`,
  },
  description: 'Zahra Health Point — doctor’s chamber and attached pharmacy in Phultala, Bangladesh.',
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
  appleWebApp: {
    title: siteConfig.name,
  },
};

const currentYear = new Date().getFullYear();

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={siteConfig.defaultLocale}>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased">
        <I18nProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-blue-600 focus:text-white focus:p-3"
          >
            {siteConfig.name} — {siteConfig.tagline}
          </a>
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <footer className="bg-slate-900 text-slate-300">
            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
              <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                <p className="text-sm text-slate-400">
                  © {currentYear} {siteConfig.name}. All rights reserved.
                </p>
                <p className="text-sm text-slate-500">{siteConfig.tagline}</p>
              </div>
            </div>
          </footer>
        </I18nProvider>
      </body>
    </html>
  );
}
