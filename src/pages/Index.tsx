import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import ChatWidget from "@/components/ChatWidget";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <Hero />
    <Projects />
    <ChatWidget />
    <About />
    <Skills />
    <Experience />
    <Contact />
    <Footer />
  </div>
);

export default Index;
