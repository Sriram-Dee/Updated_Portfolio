import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "@/components/portfolio/Navbar";
import Hero from "@/components/portfolio/Hero";
import Skills from "@/components/portfolio/Skills";
import Projects from "@/components/portfolio/Projects";
import Experience from "@/components/portfolio/Experience";
import Contact from "@/components/portfolio/Contact";
import Footer from "@/components/portfolio/Footer";

const Portfolio = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("hero");

  const sections = [
    { id: "hero", label: "Home" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "experience", label: "Experience" },
    { id: "contact", label: "Contact" },
  ];

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await axios.get("/api/portfolio");
        if (res.data) setData(res.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Could not load portfolio data");
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 300;
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(section.id);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
          <p className="text-text-secondary animate-pulse">
            Loading experience...
          </p>
        </div>
      </div>
    );
  }

  // Filter sections based on settings
  const visibleSections = sections.filter((section) => {
    if (!data?.settings?.sections) return true; // Default to visible if no settings
    return data.settings.sections[section.id] !== false;
  });

  return (
    <div className="bg-primary min-h-screen text-text-primary font-sans selection:bg-accent selection:text-white">
      <Navbar sections={visibleSections} activeSection={activeSection} />

      <main>
        {(!data?.settings?.sections?.hero ||
          data.settings.sections.hero !== false) && (
          <Hero profile={data?.profile} />
        )}

        {(!data?.settings?.sections?.skills ||
          data.settings.sections.skills !== false) && (
          <Skills skills={data?.skills} />
        )}

        {(!data?.settings?.sections?.projects ||
          data.settings.sections.projects !== false) && (
          <Projects
            projects={(data?.projects || []).filter((p) => p.enabled !== false)}
          />
        )}

        {(!data?.settings?.sections?.experience ||
          data.settings.sections.experience !== false) && (
          <Experience
            experience={(data?.experience || []).filter(
              (e) => e.enabled !== false,
            )}
            education={(data?.education || []).filter(
              (e) => e.enabled !== false,
            )}
            achievements={(data?.achievements || []).filter(
              (a) => a.enabled !== false,
            )}
          />
        )}

        {(!data?.settings?.sections?.contact ||
          data.settings.sections.contact !== false) && (
          <Contact profile={data?.profile} />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Portfolio;
