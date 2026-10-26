import type { Metadata } from 'next';
import Experience from '@/components/providers/Experience';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import PageHero from '@/components/layout/PageHero';
import { Chapter, LinkIndex } from '@/components/page/Blocks';
import { getHomeContent } from '@/lib/sanity/queries';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Χρήσιμοι σύνδεσμοι · Μουσείο Λιμναίου Πολιτισμού Κάρλας',
  description: 'Ρεπορτάζ, κανάλια και σελίδες για τη λίμνη Κάρλα και το μουσείο.',
};

export default async function LinksPage() {
  const c = await getHomeContent();
  return (
    <Experience settings={c.settings}>
      <Nav />
      <main id="main">
        <PageHero
          kicker="Σύνδεσμοι"
          title={['Χρήσιμοι', 'σύνδεσμοι']}
          lead="Ρεπορτάζ για τη λίμνη σήμερα και τα κανάλια του μουσείου."
        />
        <Chapter index="01" kicker="Η λίμνη σήμερα" title="Ρεπορτάζ">
          <LinkIndex
            items={[
              { title: 'Οδοιπορικό στην πλημμυρισμένη λίμνη Κάρλα', meta: 'ΕΡΤ3', href: 'https://www.ertnews.gr/ert3/odoiporiko-stin-plimmyrismeni-limni-karla/' },
              { title: 'Έρευνες στην Κάρλα: στένεψε η διατομή στον αγωγό προς τον Παγασητικό', meta: 'gegonota.news', href: 'https://gegonota.news/2024/01/21/erevnes-sti-karla-stenepse-i-diatomi-ston-agogo-pros-pagasitiko-logo-ferton-ylikon/' },
            ]}
          />
        </Chapter>
        <Chapter index="02" kicker="Το μουσείο" title="Βρείτε μας" tone="sand">
          <LinkIndex
            items={[
              { title: 'Facebook', meta: 'mouseiokarlas1', href: c.settings.facebook },
              { title: 'YouTube', meta: 'Ταινίες & εκπομπές', href: c.settings.youtube },
              { title: 'Virtual Tour 360°', meta: 'Περιήγηση', href: c.settings.virtualTourUrl },
            ]}
          />
        </Chapter>
      </main>
      <Footer settings={c.settings} />
    </Experience>
  );
}
