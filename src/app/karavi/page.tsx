import type { Metadata } from 'next';
import Experience from '@/components/providers/Experience';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import Karavi from '@/components/sections/Karavi';
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
        <Karavi />
        <Hall exhibits={c.exhibits} />
        <Visit settings={c.settings} />
      </main>
      <Footer settings={c.settings} />
    </Experience>
  );
}
