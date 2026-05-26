import { Nav } from "../components/Nav";
import { Hero } from "../components/Hero";
import { HowItWorks } from "../components/HowItWorks";
import { Features } from "../components/Features";
import { GuestSection } from "../components/GuestSection";
import { FAQ } from "../components/FAQ";
import { CTA } from "../components/CTA";
import { Footer } from "../components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <GuestSection />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
