import { TopNav } from "@/components/shared/top-nav";
import { SiteFooter } from "@/components/shared/site-footer";
import { AmbientBackdrop } from "@/components/sections/ambient-backdrop";
import { Hero } from "@/components/sections/hero";
import { Projects } from "@/components/sections/projects";
import { Experience } from "@/components/sections/experience";
import { About } from "@/components/sections/about";
import { Education } from "@/components/sections/education";
import { Services } from "@/components/sections/services";
import { Contact } from "@/components/sections/contact";
import { EasterEggs } from "@/components/fx/easter-eggs";

/**
 * Portfolio landing page.
 *
 * Composition (top → bottom):
 *   1. TopNav (fixed)
 *   2. Hero with ambient backdrop
 *   3. Projects — selected work          (01)
 *   4. Experience                         (02)
 *   5. About + skills + focus areas       (03)
 *   6. Education & certifications         (04)
 *   7. Services — build with me           (05)
 *   8. Contact                            (06)
 *   9. Footer
 */
export default function Home() {
  return (
    <main id="top" className="relative overflow-x-clip">
      <TopNav />

      <div className="relative">
        <AmbientBackdrop />
        <Hero />
      </div>

      <Projects />
      <Experience />
      <About />
      <Education />
      <Services />
      <Contact />
      <SiteFooter />
      <EasterEggs />
    </main>
  );
}
