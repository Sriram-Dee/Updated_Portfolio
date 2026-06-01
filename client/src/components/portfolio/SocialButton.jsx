import React from "react";

const SocialButton = ({ href, icon: Icon, label }) => {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative p-3 rounded-lg bg-surface border border-border hover:border-accent transition-colors duration-300"
      aria-label={label}
    >
      <Icon className="w-5 h-5 text-text-secondary group-hover:text-accent transition-colors duration-300" />
      <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-surface border border-border rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
        {label}
      </span>
    </a>
  );
};

export default SocialButton;
