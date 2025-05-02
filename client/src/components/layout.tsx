import { ReactNode } from "react";
import Navbar from "./navbar";
import HeroSection from "./hero-section";
import ToolsSection from "./tools-section";
import AboutSection from "./about-section";
import ContactSection from "./contact-section";
import Footer from "./footer";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <ToolsSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
