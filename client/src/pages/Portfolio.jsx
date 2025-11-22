import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FaReact,
  FaNodeJs,
  FaHtml5,
  FaCss3Alt,
  FaGitAlt,
  FaDocker,
  FaAws,
  FaLinux,
} from "react-icons/fa";
import {
  SiJavascript,
  SiTypescript,
  SiMongodb,
  SiPostgresql,
  SiTailwindcss,
  SiExpress,
  SiNextdotjs,
  SiRedux,
  SiThreedotjs,
  SiFigma,
} from "react-icons/si";
import { TbBrandVscode } from "react-icons/tb";
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

// Icon mapping helper
const getIcon = (skillName) => {
  const name = skillName.toLowerCase();
  if (name.includes("react")) return <FaReact />;
  if (name.includes("node")) return <FaNodeJs />;
  if (name.includes("html")) return <FaHtml5 />;
  if (name.includes("css")) return <FaCss3Alt />;
  if (name.includes("javascript")) return <SiJavascript />;
  if (name.includes("typescript")) return <SiTypescript />;
  if (name.includes("mongo")) return <SiMongodb />;
  if (name.includes("postgres")) return <SiPostgresql />;
  if (name.includes("tailwind")) return <SiTailwindcss />;
  if (name.includes("express")) return <SiExpress />;
  if (name.includes("next")) return <SiNextdotjs />;
  if (name.includes("redux")) return <SiRedux />;
  if (name.includes("git")) return <FaGitAlt />;
  if (name.includes("docker")) return <FaDocker />;
  if (name.includes("aws")) return <FaAws />;
  if (name.includes("linux")) return <FaLinux />;
  if (name.includes("three")) return <SiThreedotjs />;
  if (name.includes("figma")) return <SiFigma />;
  if (name.includes("vscode")) return <TbBrandVscode />;
  return null;
};

const Portfolio = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);

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

  const navSections = [
    { href: "#hero", label: "Home" },
    { href: "#skills", label: "Skills" },
    { href: "#experience", label: "Experience" },
    { href: "#projects", label: "Projects" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <>
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
                  className="text-white"
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
              <Proximity text={data.profile.summary}/>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex gap-4 justify-center md:justify-start"
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
          <div className="max-w-4xl mx-auto relative z-10">
            <ScrollFloat>
              <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">
                <ShinyText text="Experience" />
              </h2>
            </ScrollFloat>
            <motion.div className="space-y-12" variants={containerVariants}>
              {data.experience.map((exp, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="border-l-2 border-accent pl-8 relative py-2"
                >
                  <div className="absolute w-4 h-4 bg-accent rounded-full -left-[9px] top-2 shadow-[0_0_10px_rgba(56,189,248,0.5)]"></div>
                  <h3 className="text-2xl font-bold text-white">{exp.role}</h3>
                  <h4 className="text-xl text-accent mb-2">{exp.company}</h4>
                  <p className="text-gray-500 text-sm mb-4 uppercase tracking-wider">
                    {exp.period} | {exp.location}
                  </p>
                  <BlurText
                    text={exp.description}
                    className="text-gray-300 leading-relaxed"
                    delay={0.01}
                  />
                </motion.div>
              ))}
            </motion.div>
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
              {data.projects.map((project, index) => (
                <motion.div variants={itemVariants} key={index}>
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
          </div>
        </motion.section>

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

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const data = Object.fromEntries(formData.entries());
                try {
                  await axios.post("/api/contact", data);
                  alert("Message sent successfully!");
                  e.target.reset();
                } catch (err) {
                  alert(
                    "Failed to send message. Please check console or try again later."
                  );
                  console.error(err);
                }
              }}
              className="max-w-md mx-auto space-y-4 text-left"
            >
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                required
                className="w-full p-3 rounded bg-primary/50 border border-gray-700 focus:border-accent outline-none text-white"
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                required
                className="w-full p-3 rounded bg-primary/50 border border-gray-700 focus:border-accent outline-none text-white"
              />
              <textarea
                name="message"
                placeholder="Your Message"
                required
                rows="4"
                className="w-full p-3 rounded bg-primary/50 border border-gray-700 focus:border-accent outline-none text-white"
              ></textarea>
              <button
                type="submit"
                className="w-full py-3 bg-accent text-primary font-bold rounded hover:bg-opacity-90 transition"
              >
                Send Message
              </button>
            </form>
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
