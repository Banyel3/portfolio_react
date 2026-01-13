import Navigation from "@/components/navigation";
import Hero from "@/components/hero";
import About from "@/components/about";
import Testimonials from "@/components/testimonials";
import Certificates from "@/components/certificates";
import Badges from "@/components/badges";
import Projects from "@/components/projects";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <About />
      <Testimonials />
      <Certificates />
      <Badges />
      <Projects />
      <Footer />
    </main>
  );
}
