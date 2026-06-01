import React from "react";
import { ArrowRight, Sparkles, ExternalLink } from "lucide-react";
import FooterLoader from "./FooterLoader";

const Footer = ({ profile }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border bg-[#030712] overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-secondary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left: Hiring CTA */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium">
                <Sparkles size={14} />
                <span>Available for work</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                Ready to build <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-secondary">
                  something exceptional?
                </span>
              </h2>
              <p className="text-text-secondary text-lg max-w-md leading-relaxed">
                I'm currently available for freelance projects and full-time
                positions. Let's discuss how I can contribute to your team.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <a
                href={`mailto:${profile?.email}`}
                className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                Hire Me
                <ArrowRight size={20} />
              </a>
              {/* Optional: Resume or other link could go here */}
            </div>
          </div>

          {/* Right: 3D Loader & Alt Portfolio */}
          <div className="flex flex-col items-center justify-center space-y-8 relative">
            {/* The Loader acts as a visual 'Portal' */}
            <div className="relative group cursor-pointer">
              <div className="absolute inset-0 bg-accent/20 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <FooterLoader />
            </div>

            {profile?.other_portfolio && (
              <a
                href={profile.other_portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-3 text-center"
              >
                <span className="text-text-secondary group-hover:text-accent-secondary transition-colors text-sm font-medium uppercase tracking-widest">
                  Explore Alternate Version
                </span>
                <div className="flex items-center gap-2 text-white font-bold text-lg group-hover:text-accent-secondary transition-colors">
                  View v1 Portfolio
                  <ExternalLink
                    size={18}
                    className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                  />
                </div>
              </a>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-text-muted">
          <p>
            © {currentYear} {profile?.name || "Sriram R"}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {/* Social Icon Links (Minimal) */}
            {profile?.linkedin && (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                LinkedIn
              </a>
            )}
            {profile?.github && (
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                GitHub
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
