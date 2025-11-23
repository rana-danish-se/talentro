import Benefits from './Home/Benefits.jsx';
import CTA from './Home/CTA.jsx';
import FAQ from './Home/FAQ.jsx';
import HomeHero from './Home/HomeHero.jsx';
import HomeServices from './Home/HomeServices.jsx';
import Pricing from './Home/Pricing.jsx';
import Process from './Home/Process.jsx';
export default function HomePage() {
  return (
    <main>
      <HomeHero />
      <HomeServices />
      <Process/>
      <Benefits/>
      <Pricing/>
      <FAQ/>
      <CTA/>
    </main>
  );
}
