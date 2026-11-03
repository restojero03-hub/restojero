import type { Metadata } from "next";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { ConexaFeature } from "@/components/sections/conexa-feature";
import { Faq } from "@/components/sections/faq";
import { FunnelFeature } from "@/components/sections/funnel-feature";
import { Hero } from "@/components/sections/hero";
import { HowIWork } from "@/components/sections/how-i-work";
import { ProofStrip } from "@/components/sections/proof-strip";
import { Projects } from "@/components/sections/projects";
import { Services } from "@/components/sections/services";
import { Testimonials } from "@/components/sections/testimonials";
import { Tools } from "@/components/sections/tools";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Hero />
      <ProofStrip />
      <Services />
      <ConexaFeature />
      <FunnelFeature />
      <HowIWork />
      <About />
      <Tools />
      <Projects />
      <Faq />
      <Testimonials />
      <Contact />
    </>
  );
}
