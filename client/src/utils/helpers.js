import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/** Format date to readable string */
export function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Truncate text with ellipsis */
export function truncate(str, length = 100) {
  if (!str || str.length <= length) return str;
  return str.slice(0, length) + "...";
}

/** Debounce function */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/** Generate unique ID */
export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Validate email format */
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Get initials from name */
export function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/** Scroll to element by ID */
export function scrollToSection(id) {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

/** Optimize Cloudinary Image URL */
export function optimizeImage(url, width = "auto", height = "auto") {
  if (!url || typeof url !== "string") return "";
  if (!url.includes("cloudinary.com")) return url;

  // Split URL at '/upload/'
  const parts = url.split("/upload/");
  if (parts.length < 2) return url;

  // Construct optimized URL with transforms
  // f_auto: auto format (webp/avif)
  // q_auto: auto quality
  // w_{width}: resize width
  // h_{height}: resize height
  // c_limit: ensure image doesn't scale up if requested size is larger
  const transforms = [
    "f_auto",
    "q_auto",
    width !== "auto" ? `w_${width}` : "",
    height !== "auto" ? `h_${height}` : "",
    "c_limit",
  ]
    .filter(Boolean)
    .join(",");

  return `${parts[0]}/upload/${transforms}/${parts[1]}`;
}
