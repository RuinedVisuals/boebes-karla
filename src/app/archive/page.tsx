import type { Metadata } from 'next';
import Experience from '@/components/providers/Experience';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import PageHero from '@/components/layout/PageHero';
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
        <PageHero
          kicker="Αρχείο"
          title={['Ό,τι θυμάται', 'η λίμνη']}
          lead="Φωτογραφίες από τη ζωή στην Κάρλα πριν την αποξήρανση: το καράβι, το ψάρεμα, τα λούρα και ο κάμπος που ήρθε μετά. Σύρετε τον πίνακα, επιλέξτε κατηγορία, πατήστε για μεγέθυνση."
          facts={[{ k: 'Κατηγορίες', v: 'Καράβι · Ψάρεμα · Λούρα · Αποξήρανση' }, { k: 'Φωτογράφοι', v: 'Λέτσιος · Τλούπας' }]}
        />
        <Archive photos={c.archive} full />
      </main>
      <Footer settings={c.settings} />
    </Experience>
  );
}
