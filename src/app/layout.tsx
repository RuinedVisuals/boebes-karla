import type { Metadata, Viewport } from 'next';
import './globals.scss';
// Self-hosted fonts (no request to Google): every file carries Greek + Latin via unicode-range.
import '@fontsource/noto-serif-display/200.css';
import '@fontsource/noto-serif-display/200-italic.css';
import '@fontsource/noto-serif-display/300.css';
import '@fontsource/noto-serif-display/300-italic.css';
import '@fontsource/noto-serif-display/400.css';
import '@fontsource/commissioner/400.css';
import '@fontsource/commissioner/500.css';
import '@fontsource/commissioner/600.css';
import '@fontsource/fira-mono/400.css';
import '@fontsource/fira-mono/500.css';

export const metadata: Metadata = {
  title: 'Μουσείο Λιμναίου Πολιτισμού Κάρλας',
  description: 'Θεματικό μουσείο για τον πολιτισμό της λίμνης Κάρλας πριν την αποξήρανση, στα Κανάλια Μαγνησίας. Το Καράβι της Κάρλας, στοιχείο άυλης πολιτιστικής κληρονομιάς.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://boebes-karla.gr'),
  openGraph: { images: ['/images/lake-sunset.jpg'], locale: 'el_GR', type: 'website' },
};

export const viewport: Viewport = { themeColor: '#141a18' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="el">
      <body>
        <a className="skip-link" href="#main">Μετάβαση στο περιεχόμενο</a>
        {children}
      </body>
    </html>
  );
}
