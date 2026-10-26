import type { Metadata } from 'next';
import Experience from '@/components/providers/Experience';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import PageHero from '@/components/layout/PageHero';
import Karavi from '@/components/sections/Karavi';
import BoatStage from '@/components/sections/BoatStage';
import KaraviFilms from '@/components/sections/KaraviFilms';
import Hall from '@/components/sections/Hall';
import Visit from '@/components/sections/Visit';
import { getHomeContent } from '@/lib/sanity/queries';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Το Καράβι της Λίμνης Κάρλας · Μουσείο Κάρλας',
  description: 'Το Καράβι της Κάρλας, στοιχείο άυλης πολιτιστικής κληρονομιάς: η ιστορία, η τέχνη του καραβομαραγκού και τα εκθέματα του μουσείου.',
};

export default async function KaraviPage() {
  const c = await getHomeContent();
  return (
    <Experience settings={c.settings}>
      <Nav />
      <main id="main" className="page">
        <PageHero
          kicker="Το Καράβι"
          title={['Το Καράβι', 'της Λίμνης Κάρλας']}
          lead="Πλατύ, ρηχό, φτιαγμένο για τα νερά και τις καλαμιές της Κάρλας. Για εκατοντάδες χρόνια στο κέντρο της ζωής των παραλίμνιων χωριών, σήμερα στοιχείο άυλης πολιτιστικής κληρονομιάς."
          facts={[{ k: 'Εθνικό Ευρετήριο', v: 'Άυλη κληρονομιά' }, { k: 'Η τέχνη', v: 'Από πατέρα σε γιο' }, { k: 'Ημερίδα', v: '13.12.2026 · 10:30' }, { k: 'Πού', v: 'Κεντρική αίθουσα' }]}
          image={{ src: '/images/karavi-exhibit.webp', alt: 'Το καράβι της Κάρλας στην κεντρική αίθουσα του μουσείου, με ομοιώματα ψαράδων και το λούρο' }}
        />
        <Karavi />
        <BoatStage />
        <KaraviFilms />
        <Hall exhibits={c.exhibits} />
        <Visit settings={c.settings} />
      </main>
      <Footer settings={c.settings} />
    </Experience>
  );
}
