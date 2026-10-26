import type { Metadata } from 'next';
import Experience from '@/components/providers/Experience';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import Archive from '@/components/sections/Archive';
import { getHomeContent } from '@/lib/sanity/queries';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Φωτογραφικό αρχείο · Μουσείο Κάρλας',
  description: 'Το φωτογραφικό αρχείο της λίμνης Κάρλας: το καράβι, το ψάρεμα, τα λούρα και η αποξήρανση.',
};

export default async function ArchivePage() {
  const c = await getHomeContent();
  return (
    <Experience settings={c.settings}>
      <Nav />
      <main id="main">
        <Archive photos={c.archive} full />
      </main>
      <Footer settings={c.settings} />
    </Experience>
  );
}
