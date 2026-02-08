import React from "react";

const Footer = () => (
  <footer className="py-12 border-t border-border bg-black">
    <div className="container text-center">
      <div className="flex justify-center items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent-tertiary flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-accent/20">
          P
        </div>
        <span className="text-2xl font-bold tracking-tight text-white">
          Portfolio
        </span>
      </div>
      <p className="text-text-secondary">
        © {new Date().getFullYear()} All rights reserved.{" "}
        <br className="md:hidden" />
        Built with <span className="text-accent">React</span> &{" "}
        <span className="text-accent">Tailwind CSS</span>.
      </p>
    </div>
  </footer>
);

export default Footer;
