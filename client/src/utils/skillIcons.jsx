import React from "react";
// Import React Icons
import * as FaIcons from "react-icons/fa";
import * as SiIcons from "react-icons/si";
import * as TbIcons from "react-icons/tb";
import * as RiIcons from "react-icons/ri";
import * as IoIcons from "react-icons/io5";
import * as DiIcons from "react-icons/di";
import * as GrIcons from "react-icons/gr";
import * as BiIcons from "react-icons/bi";

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
  react: { pack: "FaIcons", name: "FaReact" },
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
export const getIcon = (skillName) => {
  if (!skillName) return null;
  const name = skillName.toLowerCase().trim();

  // Try exact match first
  if (skillIconMappings[name]) {
    const mapping = skillIconMappings[name];
    const iconPack = iconPacks[mapping.pack];
    const IconComponent = iconPack[mapping.name];

    if (IconComponent) {
      return <IconComponent className="w-5 h-5" />;
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
    reactjs: "react.js",
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
        return <IconComponent className="w-5 h-5" />;
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
