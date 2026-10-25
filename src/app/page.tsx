import Experience from '@/components/providers/Experience';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import Manifesto from '@/components/sections/Manifesto';
import No1 from '@/components/sections/No1';
import Hall from '@/components/sections/Hall';
import Halls from '@/components/sections/Halls';
import Events from '@/components/sections/Events';
import Cinema from '@/components/sections/Cinema';
import Archive from '@/components/sections/Archive';
import Visit from '@/components/sections/Visit';
import { getHomeContent } from '@/lib/sanity/queries';

export const revalidate = 60;

export default async function Home() {
  const c = await getHomeContent();
  return (
    <Experience settings={c.settings}>
      <Nav />
      <main id="main">
        <Hero hero={c.hero} settings={c.settings} />
        <Manifesto segments={c.manifesto} />
        <No1 />
        <Hall exhibits={c.exhibits} />
        <Halls halls={c.halls} />
        <Events events={c.events} />
        <Cinema videos={c.videos} />
        <Archive photos={c.archive} />
        <Visit settings={c.settings} />
      </main>
      <Footer settings={c.settings} />
    </Experience>
  );
}
