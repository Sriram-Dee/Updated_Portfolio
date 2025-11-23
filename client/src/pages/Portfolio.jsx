import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import * as FaIcons from "react-icons/fa";
import * as SiIcons from "react-icons/si";
import * as TbIcons from "react-icons/tb";
import * as RiIcons from "react-icons/ri";
import * as IoIcons from "react-icons/io5";
import * as DiIcons from "react-icons/di";
import * as GrIcons from "react-icons/gr";
import * as BiIcons from "react-icons/bi";
import FluidImage from "../components/FluidImage";
import ProjectModal from "../components/ProjectModal";
import SplitText from "../components/reactbits/SplitText";
import Magnet from "../components/reactbits/Magnet";
import SpotlightCard from "../components/reactbits/SpotlightCard";
import BlurText from "../components/reactbits/BlurText";
import ShinyText from "../components/reactbits/ShinyText";
import TargetCursor from "../components/reactbits/TargetCursor";
import GooeyNav from "../components/reactbits/GooeyNav";
import TiltedCard from "../components/reactbits/TiltedCard";
import ScrollFloat from "../components/reactbits/ScrollFloat";
import Particles from "../components/reactbits/Particles";
import Proximity from "../components/reactbits/Proximity";
import Timeline from "../components/Timeline";
import { Building2, Calendar, SendIcon } from "lucide-react";

// Contact Form Component with custom validation and rate limiting
const ContactForm = () => {
  const [loading, setLoading] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const COOLDOWN_PERIOD = 60000; // 60 seconds

  // Update cooldown timer
  useEffect(() => {
    if (cooldownRemaining > 0) {
      const timer = setInterval(() => {
        const remaining = Math.max(
          0,
          COOLDOWN_PERIOD - (Date.now() - lastSubmitTime)
        );
        setCooldownRemaining(remaining);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cooldownRemaining, lastSubmitTime]);

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        if (!value.trim()) {
          return "Name is required";
        }
        if (value.trim().length < 2) {
          return "Name must be at least 2 characters";
        }
        if (value.trim().length > 50) {
          return "Name must be less than 50 characters";
        }
        return "";

      case "email":
        if (!value.trim()) {
          return "Email is required";
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return "Please enter a valid email address";
        }
        return "";

      case "message":
        if (!value.trim()) {
          return "Message is required";
        }
        if (value.trim().length < 10) {
          return "Message must be at least 10 characters";
        }
        if (value.trim().length > 1000) {
          return "Message must be less than 1000 characters";
        }
        return "";

      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate on change if field was touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({ name: true, email: true, message: true });

    // Validate all fields
    const newErrors = {
      name: validateField("name", formData.name),
      email: validateField("email", formData.email),
      message: validateField("message", formData.message),
    };

    setErrors(newErrors);

    // Check if there are any errors
    if (Object.values(newErrors).some((error) => error !== "")) {
      return;
    }

    // Check rate limiting
    const timeSinceLastSubmit = Date.now() - lastSubmitTime;
    if (timeSinceLastSubmit < COOLDOWN_PERIOD) {
      const remainingSeconds = Math.ceil(
        (COOLDOWN_PERIOD - timeSinceLastSubmit) / 1000
      );
      toast.error(
        `Please wait ${remainingSeconds} seconds before sending another message.`,
        {
          duration: 3000,
          icon: "⏱️",
        }
      );
      return;
    }

    setLoading(true);

    try {
      await axios.post("/api/contact", formData);
      toast.success("Message sent successfully! I'll get back to you soon.", {
        duration: 4000,
        icon: "✅",
      });
      setFormData({ name: "", email: "", message: "" });
      setTouched({});
      setErrors({});
      setLastSubmitTime(Date.now());
      setCooldownRemaining(COOLDOWN_PERIOD);
    } catch (err) {
      console.error("Contact form error:", err);
      if (err.response?.status === 429) {
        toast.error("Too many requests. Please try again later.", {
          duration: 4000,
        });
      } else if (err.response?.status === 500) {
        toast.error(
          "Server error. Please try again later or contact me directly via email.",
          {
            duration: 5000,
          }
        );
      } else {
        toast.error(
          "Failed to send message. Please check your connection and try again.",
          {
            duration: 4000,
          }
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const isCooldownActive = cooldownRemaining > 0;
  const cooldownSeconds = Math.ceil(cooldownRemaining / 1000);

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto space-y-5 text-left"
      noValidate
    >
      {/* Name Input */}
      <div className="relative">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={loading || isCooldownActive}
          className={`w-full p-3 rounded-lg bg-primary/50 border-2 transition-all duration-300 ${
            errors.name && touched.name
              ? "border-red-500 focus:border-red-400"
              : "border-gray-700 focus:border-accent"
          } outline-none text-white placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed`}
        />
        {errors.name && touched.name && (
          <div className="flex items-center gap-2 mt-2 text-red-400 text-sm animate-fadeIn">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>{errors.name}</span>
          </div>
        )}
      </div>

      {/* Email Input */}
      <div className="relative">
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={loading || isCooldownActive}
          className={`w-full p-3 rounded-lg bg-primary/50 border-2 transition-all duration-300 ${
            errors.email && touched.email
              ? "border-red-500 focus:border-red-400"
              : "border-gray-700 focus:border-accent"
          } outline-none text-white placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed`}
        />
        {errors.email && touched.email && (
          <div className="flex items-center gap-2 mt-2 text-red-400 text-sm animate-fadeIn">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>{errors.email}</span>
          </div>
        )}
      </div>

      {/* Message Textarea */}
      <div className="relative">
        <textarea
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          onBlur={handleBlur}
          rows="4"
          disabled={loading || isCooldownActive}
          className={`w-full p-3 rounded-lg bg-primary/50 border-2 transition-all duration-300 ${
            errors.message && touched.message
              ? "border-red-500 focus:border-red-400"
              : "border-gray-700 focus:border-accent"
          } outline-none text-white placeholder-gray-500 resize-none disabled:opacity-50 disabled:cursor-not-allowed`}
        ></textarea>
        <div className="flex justify-between items-center mt-1">
          {errors.message && touched.message ? (
            <div className="flex items-center gap-2 text-red-400 text-sm animate-fadeIn">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{errors.message}</span>
            </div>
          ) : (
            <span className="text-gray-500 text-xs">
              {formData.message.length}/1000
            </span>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || isCooldownActive}
        className="w-full py-3 bg-accent text-primary font-bold rounded-lg hover:bg-opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-accent/50"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span>Sending...</span>
          </>
        ) : isCooldownActive ? (
          <>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Wait {cooldownSeconds}s</span>
          </>
        ) : (
          <>
            <SendIcon className="w-5 h-5" />
            <span>Send Message</span>
          </>
        )}
      </button>

      {/* Rate Limit Info */}
      {isCooldownActive && (
        <div className="flex items-center justify-center gap-2 text-yellow-400 text-sm bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-3 animate-fadeIn">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
          <span>
            Please wait {cooldownSeconds} seconds before sending another message
          </span>
        </div>
      )}
    </form>
  );
};

// Comprehensive icon mapping with exact matches
const skillIconMappings = {
  // Programming Languages
  javascript: { pack: "SiIcons", name: "SiJavascript" },
  typescript: { pack: "SiIcons", name: "SiTypescript" },
  python: { pack: "SiIcons", name: "SiPython" },
  "c++": { pack: "SiIcons", name: "SiCplusplus" },
  "c#": { pack: "SiIcons", name: "SiCsharp" },
  go: { pack: "SiIcons", name: "SiGo" },
  rust: { pack: "SiIcons", name: "SiRust" },
  kotlin: { pack: "SiIcons", name: "SiKotlin" },
  swift: { pack: "SiIcons", name: "SiSwift" },
  php: { pack: "SiIcons", name: "SiPhp" },
  ruby: { pack: "SiIcons", name: "SiRuby" },
  scala: { pack: "SiIcons", name: "SiScala" },
  r: { pack: "SiIcons", name: "SiR" },
  dart: { pack: "SiIcons", name: "SiDart" },
  elixir: { pack: "SiIcons", name: "SiElixir" },
  clojure: { pack: "SiIcons", name: "SiClojure" },
  haskell: { pack: "SiIcons", name: "SiHaskell" },
  perl: { pack: "SiIcons", name: "SiPerl" },

  // Frontend Frameworks
  "react.js": { pack: "FaIcons", name: "FaReact" },
  vue: { pack: "SiIcons", name: "SiVuedotjs" },
  angular: { pack: "SiIcons", name: "SiAngular" },
  svelte: { pack: "SiIcons", name: "SiSvelte" },

  // React Ecosystem
  redux: { pack: "SiIcons", name: "SiRedux" },
  mobx: { pack: "SiIcons", name: "SiMobx" },
  zustand: { pack: "SiIcons", name: "SiZustand" },
  "react query": { pack: "SiIcons", name: "SiReactquery" },
  "react router": { pack: "SiIcons", name: "SiReactrouter" },
  "next.js": { pack: "SiIcons", name: "SiNextdotjs" },
  gatsby: { pack: "SiIcons", name: "SiGatsby" },
  remix: { pack: "SiIcons", name: "SiRemix" },

  // Backend Frameworks
  "node.js": { pack: "FaIcons", name: "FaNodeJs" },
  express: { pack: "SiIcons", name: "SiExpress" },
  "nest.js": { pack: "SiIcons", name: "SiNestjs" },
  fastify: { pack: "SiIcons", name: "SiFastify" },
  koa: { pack: "SiIcons", name: "SiKoa" },
  django: { pack: "SiIcons", name: "SiDjango" },
  flask: { pack: "SiIcons", name: "SiFlask" },
  spring: { pack: "SiIcons", name: "SiSpring" },
  rails: { pack: "SiIcons", name: "SiRubyonrails" },
  laravel: { pack: "SiIcons", name: "SiLaravel" },
  java: { pack: "FaIcons", name: "FaJava" },
  "asp.net": { pack: "SiIcons", name: "SiDotnet" },

  // Mobile Development
  "react native": { pack: "FaIcons", name: "FaReact" },
  flutter: { pack: "SiIcons", name: "SiFlutter" },
  ionic: { pack: "SiIcons", name: "SiIonic" },
  xamarin: { pack: "SiIcons", name: "SiXamarin" },

  // Databases
  mongodb: { pack: "SiIcons", name: "SiMongodb" },
  postgresql: { pack: "SiIcons", name: "SiPostgresql" },
  mysql: { pack: "SiIcons", name: "SiMysql" },
  redis: { pack: "SiIcons", name: "SiRedis" },
  sqlite: { pack: "SiIcons", name: "SiSqlite" },
  oracle: { pack: "SiIcons", name: "SiOracle" },
  cassandra: { pack: "SiIcons", name: "SiApachecassandra" },
  dynamodb: { pack: "SiIcons", name: "SiAwselasticache" },
  firebase: { pack: "SiIcons", name: "SiFirebase" },
  supabase: { pack: "SiIcons", name: "SiSupabase" },
  prisma: { pack: "SiIcons", name: "SiPrisma" },

  // Cloud & DevOps
  aws: { pack: "FaIcons", name: "FaAws" },
  docker: { pack: "FaIcons", name: "FaDocker" },
  kubernetes: { pack: "SiIcons", name: "SiKubernetes" },
  terraform: { pack: "SiIcons", name: "SiTerraform" },
  jenkins: { pack: "SiIcons", name: "SiJenkins" },
  "github actions": { pack: "SiIcons", name: "SiGithubactions" },
  gitlab: { pack: "SiIcons", name: "SiGitlab" },
  azure: { pack: "SiIcons", name: "SiMicrosoftazure" },
  gcp: { pack: "SiIcons", name: "SiGooglecloud" },
  digitalocean: { pack: "SiIcons", name: "SiDigitalocean" },
  heroku: { pack: "SiIcons", name: "SiHeroku" },
  netlify: { pack: "SiIcons", name: "SiNetlify" },
  vercel: { pack: "SiIcons", name: "SiVercel" },

  // CSS & Styling
  css: { pack: "FaIcons", name: "FaCss3Alt" },
  html: { pack: "FaIcons", name: "FaHtml5" },
  sass: { pack: "SiIcons", name: "SiSass" },
  less: { pack: "SiIcons", name: "SiLess" },
  "tailwind css": { pack: "SiIcons", name: "SiTailwindcss" },
  bootstrap: { pack: "SiIcons", name: "SiBootstrap" },
  "material ui": { pack: "SiIcons", name: "SiMui" },
  "chakra ui": { pack: "SiIcons", name: "SiChakraui" },
  "styled components": { pack: "SiIcons", name: "SiStyledcomponents" },
  emotion: { pack: "SiIcons", name: "SiEmotion" },
  "ant design": { pack: "SiIcons", name: "SiAntdesign" },
  bulma: { pack: "SiIcons", name: "SiBulma" },

  // Build Tools & Bundlers
  webpack: { pack: "SiIcons", name: "SiWebpack" },
  vite: { pack: "SiIcons", name: "SiVite" },
  rollup: { pack: "SiIcons", name: "SiRollupdotjs" },
  parcel: { pack: "SiIcons", name: "SiParcel" },
  babel: { pack: "SiIcons", name: "SiBabel" },
  esbuild: { pack: "SiIcons", name: "SiEsbuild" },

  // Testing
  jest: { pack: "SiIcons", name: "SiJest" },
  cypress: { pack: "SiIcons", name: "SiCypress" },
  "testing library": { pack: "SiIcons", name: "SiTestinglibrary" },
  mocha: { pack: "SiIcons", name: "SiMocha" },
  chai: { pack: "SiIcons", name: "SiChai" },
  storybook: { pack: "SiIcons", name: "SiStorybook" },
  vitest: { pack: "SiIcons", name: "SiVitest" },

  // Tools & Software
  git: { pack: "FaIcons", name: "FaGitAlt" },
  "git/github": { pack: "FaIcons", name: "FaGitAlt" },
  linux: { pack: "FaIcons", name: "FaLinux" },
  figma: { pack: "SiIcons", name: "SiFigma" },
  vscode: { pack: "TbIcons", name: "TbBrandVscode" },
  "vs code": { pack: "TbIcons", name: "TbBrandVscode" },
  vim: { pack: "SiIcons", name: "SiVim" },
  intellij: { pack: "SiIcons", name: "SiIntellijidea" },
  pycharm: { pack: "SiIcons", name: "SiPycharm" },
  webstorm: { pack: "SiIcons", name: "SiWebstorm" },
  "android studio": { pack: "SiIcons", name: "SiAndroidstudio" },
  xcode: { pack: "SiIcons", name: "SiXcode" },
  postman: { pack: "SiIcons", name: "SiPostman" },
  insomnia: { pack: "SiIcons", name: "SiInsomnia" },
  jira: { pack: "SiIcons", name: "SiJira" },
  trello: { pack: "SiIcons", name: "SiTrello" },
  slack: { pack: "SiIcons", name: "SiSlack" },
  discord: { pack: "SiIcons", name: "SiDiscord" },
  notion: { pack: "SiIcons", name: "SiNotion" },

  // Graphics & 3D
  "three.js": { pack: "SiIcons", name: "SiThreedotjs" },
  blender: { pack: "SiIcons", name: "SiBlender" },
  photoshop: { pack: "SiIcons", name: "SiAdobephotoshop" },
  illustrator: { pack: "SiIcons", name: "SiAdobeillustrator" },
  "premiere pro": { pack: "SiIcons", name: "SiAdobepremierepro" },
  "after effects": { pack: "SiIcons", name: "SiAftereffects" },
  sketch: { pack: "SiIcons", name: "SiSketch" },
  "adobe xd": { pack: "SiIcons", name: "SiAdobexd" },
  framer: { pack: "SiIcons", name: "SiFramer" },

  // Blockchain & Web3
  ethereum: { pack: "SiIcons", name: "SiEthereum" },
  solidity: { pack: "SiIcons", name: "SiSolidity" },
  "web3.js": { pack: "SiIcons", name: "SiWebdotjs" },
  hardhat: { pack: "SiIcons", name: "SiHardhat" },
  truffle: { pack: "SiIcons", name: "SiTruffle" },
  ipfs: { pack: "SiIcons", name: "SiIpfs" },

  // AI/ML
  tensorflow: { pack: "SiIcons", name: "SiTensorflow" },
  pytorch: { pack: "SiIcons", name: "SiPytorch" },
  keras: { pack: "SiIcons", name: "SiKeras" },
  "scikit-learn": { pack: "SiIcons", name: "SiScikitlearn" },
  pandas: { pack: "SiIcons", name: "SiPandas" },
  numpy: { pack: "SiIcons", name: "SiNumpy" },
  opencv: { pack: "SiIcons", name: "SiOpencv" },

  // Additional Technologies
  graphql: { pack: "SiIcons", name: "SiGraphql" },
  apollo: { pack: "SiIcons", name: "SiApollographql" },
  "socket.io": { pack: "SiIcons", name: "SiSocketdotio" },
  nginx: { pack: "SiIcons", name: "SiNginx" },
  apache: { pack: "SiIcons", name: "SiApache" },
  rabbitmq: { pack: "SiIcons", name: "SiRabbitmq" },
  kafka: { pack: "SiIcons", name: "SiApachekafka" },
  elasticsearch: { pack: "SiIcons", name: "SiElasticsearch" },
  kibana: { pack: "SiIcons", name: "SiKibana" },
  logstash: { pack: "SiIcons", name: "SiLogstash" },
  prometheus: { pack: "SiIcons", name: "SiPrometheus" },
  grafana: { pack: "SiIcons", name: "SiGrafana" },
  ansible: { pack: "SiIcons", name: "SiAnsible" },
  puppet: { pack: "SiIcons", name: "SiPuppet" },
  chef: { pack: "SiIcons", name: "SiChef" },
};

const iconPacks = {
  FaIcons,
  SiIcons,
  TbIcons,
  RiIcons,
  IoIcons,
  DiIcons,
  GrIcons,
  BiIcons,
};

// Smart icon getter with exact matching and fallbacks
const getIcon = (skillName) => {
  const name = skillName.toLowerCase().trim();

  // Try exact match first
  if (skillIconMappings[name]) {
    const mapping = skillIconMappings[name];
    const iconPack = iconPacks[mapping.pack];
    const IconComponent = iconPack[mapping.name];

    if (IconComponent) {
      return <IconComponent className="skill-icon" />;
    }
  }

  // Try common variations
  const variations = {
    // Handle common naming variations
    node: "node.js",
    nodejs: "node.js",
    next: "next.js",
    nextjs: "next.js",
    tailwind: "tailwind css",
    antd: "ant design",
    three: "three.js",
    threejs: "three.js",
    postgres: "postgresql",
    mongo: "mongodb",
    "aws ec2": "aws",
    "aws s3": "aws",
    "aws lambda": "aws",
    reactjs: "react",
    vuejs: "vue",
    angularjs: "angular",
  };

  if (variations[name]) {
    const mappedName = variations[name];
    if (skillIconMappings[mappedName]) {
      const mapping = skillIconMappings[mappedName];
      const iconPack = iconPacks[mapping.pack];
      const IconComponent = iconPack[mapping.name];

      if (IconComponent) {
        return <IconComponent className="skill-icon" />;
      }
    }
  }

  // Final fallback - show first letter in a circle
  return (
    <div
      className="skill-fallback flex items-center justify-center w-5 h-5 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full text-xs font-bold text-white shadow-sm"
      title={skillName}
    >
      {skillName.charAt(0).toUpperCase()}
    </div>
  );
};

const Portfolio = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showAllProjects, setShowAllProjects] = useState(false);

  useEffect(() => {
    axios
      .get("/api/portfolio")
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-primary text-white">
        Loading...
      </div>
    );
  if (!data)
    return (
      <div className="h-screen flex items-center justify-center text-white">
        Error loading data
      </div>
    );

  // Get projects to display - initially show 2, then all when "Show More" is clicked
  const displayedProjects = showAllProjects
    ? data.projects
    : data.projects?.slice(0, 2) || [];

  // Check if there are more projects to show
  const hasMoreProjects = data.projects?.length > 2;

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1e293b",
            color: "#fff",
            border: "1px solid #38bdf8",
          },
          success: {
            iconTheme: {
              primary: "#38bdf8",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          zIndex: 0,
        }}
      >
        <Particles
          className="absolute inset-0"
          particleColors={["#38bdf8"]}
          particleCount={200}
          particleSpread={10}
          speed={0.3}
          particleBaseSize={150}
          moveParticlesOnHover={true}
          alphaParticles={true}
          disableRotation={false}
        />
      </div>
      <div className="min-h-screen text-white font-sans overflow-x-hidden relative z-10">
        <TargetCursor />

        {/* Hero Section */}
        <section
          id="hero"
          className="min-h-screen flex items-center justify-center px-6 py-20 relative"
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 w-full relative z-10">
            <div className="order-2 md:order-1 flex-1 text-center md:text-left">
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-5xl md:text-7xl font-bold mb-4"
              >
                <SplitText
                  text={data.profile.name}
                  className="text-white justify-center sm:justify-start"
                  delay={0.1}
                />
              </motion.h1>
              <motion.h2
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-2xl md:text-4xl text-accent mb-6 font-light"
              >
                {data.profile.title}
              </motion.h2>
              <Proximity text={data.profile.summary} />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="mt-4 flex gap-4 justify-center md:justify-start"
              >
                <Magnet>
                  <a
                    href={data.profile.github}
                    target="_blank"
                    rel="noreferrer"
                    className="block px-8 py-3 border border-accent text-accent hover:bg-accent hover:text-primary transition rounded-full font-medium"
                  >
                    GitHub
                  </a>
                </Magnet>
                <Magnet>
                  <a
                    href={data.profile.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="block px-8 py-3 bg-accent text-primary hover:bg-opacity-90 transition rounded-full font-medium"
                  >
                    LinkedIn
                  </a>
                </Magnet>
              </motion.div>
            </div>

            <div className="order-1 md:order-2 flex-1 flex justify-center z-10">
              <FluidImage
                src={data.profile.avatar || "https://via.placeholder.com/400"}
                alt="Profile"
              />
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <motion.section
          id="skills"
          className="py-20 px-6 relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          <div className="max-w-7xl mx-auto relative z-10">
            <ScrollFloat>
              <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center text-white">
                <ShinyText text="Technical Arsenal" />
              </h2>
            </ScrollFloat>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              variants={containerVariants}
            >
              {Object.entries(data.skills).map(([category, skills]) => (
                <motion.div variants={itemVariants} key={category}>
                  <SpotlightCard
                    className="p-6 h-full cursor-target"
                    spotlightColor="rgba(56, 189, 248, 0.2)"
                  >
                    <h3 className="text-xl font-bold mb-6 text-accent border-b border-gray-700 pb-2">
                      {category}
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {skills.map((skill, index) => (
                        <Magnet key={index}>
                          <div className="flex items-center gap-2 bg-primary/50 px-3 py-2 rounded-lg border border-gray-700/50 hover:border-accent/30 transition group cursor-default">
                            <span className="text-xl text-gray-400 group-hover:text-accent transition">
                              {getIcon(skill)}
                            </span>
                            <span className="text-sm text-gray-300">
                              {skill}
                            </span>
                          </div>
                        </Magnet>
                      ))}
                    </div>
                  </SpotlightCard>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Experience Section */}
        <motion.section
          id="experience"
          className="py-20 px-6 relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          <div className="max-w-6xl mx-auto relative z-10">
            <ScrollFloat>
              <h2 className="text-4xl md:text-5xl font-bold mb-20 text-center">
                <ShinyText text="Professional Journey" />
              </h2>
            </ScrollFloat>

            <div className="relative">
              {/* Vertical timeline line */}
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent via-accent/50 to-transparent transform -translate-x-1/2">
                <div className="absolute inset-0 bg-accent/20 blur-sm" />
              </div>

              <motion.div className="space-y-8" variants={containerVariants}>
                {data.experience.map((exp, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="relative flex flex-col md:flex-row items-start"
                  >
                    {/* Timeline dot and connecting lines */}
                    <div className="absolute left-4 md:left-1/2 top-6 z-20 transform -translate-x-1/2">
                      {/* Vertical connecting line to next item */}
                      {index < data.experience.length - 1 && (
                        <motion.div
                          initial={{ scaleY: 0 }}
                          whileInView={{ scaleY: 1 }}
                          viewport={{ once: true }}
                          transition={{
                            delay: index * 0.1 + 0.4,
                            duration: 0.6,
                          }}
                          className="absolute left-1/2 top-6 w-0.5 h-full bg-gradient-to-b from-accent to-accent/30 origin-top transform -translate-x-1/2"
                        />
                      )}

                      {/* Main dot container */}
                      <div className="relative flex items-center justify-center">
                        {/* Main dot */}
                        <motion.div
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true }}
                          transition={{
                            delay: index * 0.1 + 0.3,
                            type: "spring",
                          }}
                          className="w-4 h-4 rounded-full bg-accent border-4 border-primary shadow-lg shadow-accent/50 relative z-10"
                        />

                        {/* Pulsing ring */}
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          whileInView={{ scale: 1, opacity: 1 }}
                          viewport={{ once: true }}
                          animate={{
                            scale: [1, 1.8, 1],
                            opacity: [0.7, 0, 0.7],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "loop",
                            ease: "easeInOut",
                            delay: index * 0.3,
                          }}
                          className="absolute inset-0 w-4 h-4 rounded-full bg-accent/50 border-2 border-accent"
                        />
                      </div>

                      {/* Horizontal connecting lines for desktop */}
                      <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + 0.5, duration: 0.4 }}
                        className={`hidden md:block absolute top-2 w-20 h-0.5 bg-gradient-to-r ${
                          index % 2 === 0
                            ? "from-accent/30 to-accent -left-20"
                            : "from-accent to-accent/30 -right-20"
                        }`}
                      />
                    </div>

                    {/* Left side content (even indexes) */}
                    {index % 2 === 0 ? (
                      <>
                        {/* Date card - left side */}
                        <div className="hidden md:flex flex-1 justify-end pr-12 mt-2">
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 + 0.2 }}
                            className="bg-accent/10 border border-accent/20 rounded-xl p-4 backdrop-blur-sm max-w-xs w-full"
                          >
                            <p className="text-accent font-semibold text-lg">
                              {exp.period}
                            </p>
                            <p className="text-gray-400 text-sm mt-1">
                              {exp.location}
                            </p>
                          </motion.div>
                        </div>

                        {/* Spacer for left side */}
                        <div className="hidden md:block w-8" />

                        {/* Experience card - right side */}
                        <div className="flex-1 md:max-w-lg ml-12 md:ml-0">
                          <motion.div
                            whileHover={{
                              scale: 1.02,
                              y: -2,
                              transition: { type: "spring", stiffness: 300 },
                            }}
                            className="relative bg-gradient-to-br from-secondary/80 to-primary/30 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 hover:border-accent/50 transition-all duration-500 group hover:shadow-2xl hover:shadow-accent/10 overflow-hidden"
                          >
                            {/* Card content */}
                            <div className="relative z-10">
                              {/* Header */}
                              <div className="mb-4">
                                <motion.h3
                                  className="text-2xl font-bold text-white group-hover:text-accent transition-colors duration-300 mb-2"
                                  whileHover={{ x: 2 }}
                                >
                                  {exp.role}
                                </motion.h3>

                                <div className="flex items-center gap-2 text-accent text-lg font-semibold mb-3">
                                  <div className="p-2 bg-accent/20 rounded-lg">
                                    <Building2
                                      className="text-accent"
                                      size={20}
                                    />
                                  </div>
                                  <span>{exp.company}</span>
                                </div>

                                {/* Mobile date */}
                                <div className="md:hidden flex items-center gap-2 text-gray-400 text-sm mb-3 bg-accent/10 border border-accent/20 rounded-lg p-3">
                                  <Calendar size={16} className="text-accent" />
                                  <span className="text-accent font-medium">
                                    {exp.period}
                                  </span>
                                  <span className="text-accent">•</span>
                                  <span className="text-gray-300">
                                    {exp.location}
                                  </span>
                                </div>
                              </div>

                              {/* Description */}
                              <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 + 0.4 }}
                                className="text-gray-300 leading-relaxed space-y-3"
                              >
                                {exp.description.split(". ").map(
                                  (sentence, i) =>
                                    sentence.trim() && (
                                      <p
                                        key={i}
                                        className="flex items-start gap-3"
                                      >
                                        <span className="text-accent mt-2 flex-shrink-0">
                                          ▹
                                        </span>
                                        <span>
                                          {sentence.trim()}
                                          {sentence.trim().endsWith(".")
                                            ? ""
                                            : "."}
                                        </span>
                                      </p>
                                    )
                                )}
                              </motion.div>

                              {/* Technologies used */}
                              {exp.technologies && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  whileInView={{ opacity: 1, y: 0 }}
                                  viewport={{ once: true }}
                                  transition={{ delay: index * 0.1 + 0.6 }}
                                  className="mt-6 pt-4 border-t border-gray-700/50"
                                >
                                  <p className="text-sm text-gray-400 mb-2 font-medium">
                                    Technologies used:
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    {exp.technologies.map((tech, techIndex) => (
                                      <motion.span
                                        key={techIndex}
                                        whileHover={{ scale: 1.05 }}
                                        className="px-3 py-1 bg-accent/10 text-accent border border-accent/20 rounded-full text-sm font-medium"
                                      >
                                        {tech}
                                      </motion.span>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </div>
                          </motion.div>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Experience card - left side */}
                        <div className="flex-1 md:max-w-lg ml-12 md:ml-0">
                          <motion.div
                            whileHover={{
                              scale: 1.02,
                              y: -2,
                              transition: { type: "spring", stiffness: 300 },
                            }}
                            className="relative bg-gradient-to-br from-secondary/80 to-primary/30 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 hover:border-accent/50 transition-all duration-500 group hover:shadow-2xl hover:shadow-accent/10 overflow-hidden"
                          >
                            {/* Card content */}
                            <div className="relative z-10">
                              {/* Header */}
                              <div className="mb-4">
                                <motion.h3
                                  className="text-2xl font-bold text-white group-hover:text-accent transition-colors duration-300 mb-2"
                                  whileHover={{ x: 2 }}
                                >
                                  {exp.role}
                                </motion.h3>

                                <div className="flex items-center gap-2 text-accent text-lg font-semibold mb-3">
                                  <div className="p-2 bg-accent/20 rounded-lg">
                                    <Building2
                                      className="text-accent"
                                      size={20}
                                    />
                                  </div>
                                  <span>{exp.company}</span>
                                </div>

                                {/* Mobile date */}
                                <div className="md:hidden flex items-center gap-2 text-gray-400 text-sm mb-3 bg-accent/10 border border-accent/20 rounded-lg p-3">
                                  <Calendar size={16} className="text-accent" />
                                  <span className="text-accent font-medium">
                                    {exp.period}
                                  </span>
                                  <span className="text-accent">•</span>
                                  <span className="text-gray-300">
                                    {exp.location}
                                  </span>
                                </div>
                              </div>

                              {/* Description */}
                              <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 + 0.4 }}
                                className="text-gray-300 leading-relaxed space-y-3"
                              >
                                {exp.description.split(". ").map(
                                  (sentence, i) =>
                                    sentence.trim() && (
                                      <p
                                        key={i}
                                        className="flex items-start gap-3"
                                      >
                                        <span className="text-accent mt-2 flex-shrink-0">
                                          ▹
                                        </span>
                                        <span>
                                          {sentence.trim()}
                                          {sentence.trim().endsWith(".")
                                            ? ""
                                            : "."}
                                        </span>
                                      </p>
                                    )
                                )}
                              </motion.div>

                              {/* Technologies used */}
                              {exp.technologies && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  whileInView={{ opacity: 1, y: 0 }}
                                  viewport={{ once: true }}
                                  transition={{ delay: index * 0.1 + 0.6 }}
                                  className="mt-6 pt-4 border-t border-gray-700/50"
                                >
                                  <p className="text-sm text-gray-400 mb-2 font-medium">
                                    Technologies used:
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    {exp.technologies.map((tech, techIndex) => (
                                      <motion.span
                                        key={techIndex}
                                        whileHover={{ scale: 1.05 }}
                                        className="px-3 py-1 bg-accent/10 text-accent border border-accent/20 rounded-full text-sm font-medium"
                                      >
                                        {tech}
                                      </motion.span>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </div>
                          </motion.div>
                        </div>

                        {/* Spacer for right side */}
                        <div className="hidden md:block w-8" />

                        {/* Date card - right side */}
                        <div className="hidden md:flex flex-1 justify-start pl-12 mt-2">
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 + 0.2 }}
                            className="bg-accent/10 border border-accent/20 rounded-xl p-4 backdrop-blur-sm max-w-xs w-full"
                          >
                            <p className="text-accent font-semibold text-lg">
                              {exp.period}
                            </p>
                            <p className="text-gray-400 text-sm mt-1">
                              {exp.location}
                            </p>
                          </motion.div>
                        </div>
                      </>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Projects Section */}
        <motion.section
          id="projects"
          className="py-20 px-6 relative z-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
        >
          <div className="max-w-7xl mx-auto">
            <ScrollFloat>
              <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">
                <ShinyText text="Featured Projects" />
              </h2>
            </ScrollFloat>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-10"
              variants={containerVariants}
            >
              {displayedProjects.map((project, index) => (
                <motion.div
                  variants={itemVariants}
                  key={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <TiltedCard onClick={() => setSelectedProject(project)}>
                    <div className="h-64 bg-black/50 relative overflow-hidden rounded-t-xl">
                      <img
                        src={
                          project.images && project.images.length > 0
                            ? project.images[0]
                            : `https://via.placeholder.com/800x450?text=${project.name}`
                        }
                        alt={project.name}
                        className="w-full h-full object-cover transition duration-500 opacity-80 hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-secondary to-transparent opacity-60" />
                      <div className="absolute bottom-4 left-4 right-4 translate-z-20">
                        <h3 className="text-2xl font-bold text-white mb-1">
                          {project.name}
                        </h3>
                        <p className="text-accent text-sm">
                          {project.technologies}
                        </p>
                      </div>
                    </div>
                    <div className="p-6 bg-secondary rounded-b-xl">
                      <p className="text-gray-400 line-clamp-3 mb-4">
                        {project.description}
                      </p>
                      <span className="text-sm text-accent font-bold flex items-center gap-2">
                        View Details <span className="transition">→</span>
                      </span>
                    </div>
                  </TiltedCard>
                </motion.div>
              ))}
            </motion.div>

            {/* Show More/Less Button */}
            {hasMoreProjects && (
              <motion.div
                className="flex justify-center mt-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Magnet>
                  <button
                    onClick={() => setShowAllProjects(!showAllProjects)}
                    className="px-8 py-3 border border-accent text-accent hover:bg-accent hover:text-primary transition rounded-full font-medium flex items-center gap-2"
                  >
                    {showAllProjects ? (
                      <>
                        Show Less
                        <span className="transition-transform">↑</span>
                      </>
                    ) : (
                      <>
                        Show More Projects
                        <span className="transition-transform">↓</span>
                      </>
                    )}
                  </button>
                </Magnet>
              </motion.div>
            )}
          </div>
        </motion.section>

        {/* Achievements Section */}
        {data.achievements && data.achievements.length > 0 && (
          <motion.section
            className="py-20 px-6 relative z-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            <motion.h2
              className="text-4xl font-bold text-center mb-4"
              variants={itemVariants}
            >
              <ScrollFloat>
                <h2 className="text-4xl md:text-5xl font-bold mb-20 text-center">
                  <ShinyText text="Certifications & Awards" />
                </h2>
              </ScrollFloat>
            </motion.h2>
            <motion.p
              className="text-gray-400 text-center mb-12 max-w-2xl mx-auto"
              variants={itemVariants}
            >
              Professional achievements and recognitions
            </motion.p>

            <Timeline achievements={data.achievements} />
          </motion.section>
        )}

        {/* Contact Section */}
        <motion.section
          id="contact"
          className="py-20 px-6 relative z-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          <motion.div
            className="max-w-3xl mx-auto text-center bg-gradient-to-br from-secondary/50 to-primary p-12 rounded-3xl border border-gray-800 backdrop-blur-sm relative z-10"
            variants={itemVariants}
          >
            <ScrollFloat>
              <h2 className="text-4xl font-bold mb-6 text-white">
                Let's Work Together
              </h2>
            </ScrollFloat>
            <p className="text-gray-300 mb-10 text-lg">
              I'm currently available for freelance work or full-time positions.
              If you have a project that needs some creative touch, let's chat!
            </p>

            <ContactForm />
          </motion.div>
        </motion.section>

        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </div>
    </>
  );
};

export default Portfolio;
