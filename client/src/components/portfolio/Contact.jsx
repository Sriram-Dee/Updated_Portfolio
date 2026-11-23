import { useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Send, Mail, MapPin, Github, Linkedin, Twitter } from "lucide-react";
import SectionHeader from "./SectionHeader";
import SocialButton from "./SocialButton";
import { isValidEmail } from "@/utils/helpers";

const Contact = ({ profile }) => {
  const [loading, setLoading] = useState(false);
  const formRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(formRef.current);
    const data = Object.fromEntries(formData.entries());

    try {
      if (!data.name || !data.email || !data.message) {
        throw new Error("Please fill in all fields");
      }
      if (!isValidEmail(data.email)) {
        throw new Error("Invalid email address");
      }

      await axios.post("/api/contact", data);
      toast.success("Message sent successfully!");
      formRef.current.reset();
    } catch (err) {
      toast.error(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="section relative overflow-hidden py-20 md:py-32"
    >
      {/* Background Gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-accent/10 to-transparent blur-[120px] rounded-full pointer-events-none" />

      <div className="container relative z-10">
        <SectionHeader
          title="Let's Work Together"
          subtitle="Get in Touch"
          centered
        />

        <div className="max-w-5xl mx-auto flex flex-col md:grid md:grid-cols-2 gap-8 lg:gap-12 bg-surface/50 backdrop-blur-2xl border border-white/10 rounded-3xl md:rounded-[2.5rem] p-4 md:p-12 shadow-2xl">
          <div className="contents md:flex md:flex-col md:justify-between space-y-8">
            <div className="order-1 md:order-none">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 font-display">
                Let's build something amazing.
              </h3>
              <p className="text-secondary text-lg leading-relaxed font-light">
                Have a project in mind or want to discuss new opportunities? I'm
                always open to discussing new projects and creative ideas.
              </p>
            </div>

            <div className="space-y-4 order-3 md:order-none">
              <a
                href={`mailto:${profile?.email}`}
                className="flex items-center gap-5 p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-accent/40 hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-full bg-accent-secondary/20 flex items-center justify-center text-accent-secondary shadow-lg shadow-accent-secondary/10">
                  <Mail size={24} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-secondary uppercase font-bold tracking-wider mb-1">
                    Email
                  </div>
                  <div className="font-medium text-primary text-sm group-hover:text-accent transition-colors break-words">
                    {profile?.email}
                  </div>
                </div>
              </a>

              <div className="flex items-center gap-5 p-5 rounded-2xl bg-white/5 border border-white/5">
                <div className="w-12 h-12 rounded-full bg-accent-secondary/20 flex items-center justify-center text-accent-secondary shadow-lg shadow-accent-secondary/10">
                  <MapPin size={24} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-secondary uppercase font-bold tracking-wider mb-1">
                    Location
                  </div>
                  <div className="font-medium text-primary text-sm break-words">
                    {profile?.location}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/10 order-4 md:order-none">
              <div className="text-sm font-medium text-secondary mb-4 uppercase tracking-wider">
                Connect with me
              </div>
              <div className="flex gap-4">
                <SocialButton
                  href={profile?.github}
                  icon={Github}
                  label="GitHub"
                />
                <SocialButton
                  href={profile?.linkedin}
                  icon={Linkedin}
                  label="LinkedIn"
                />
                <SocialButton
                  href={profile?.twitter}
                  icon={Twitter}
                  label="Twitter"
                />
              </div>
            </div>
          </div>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="space-y-4 md:space-y-5 bg-white/5 p-6 md:p-8 rounded-3xl md:rounded-[2rem] border border-white/5 shadow-inner order-2 md:order-none"
          >
            <div className="group">
              <label className="text-sm font-medium text-secondary mb-2 block group-focus-within:text-accent transition-colors">
                Name
              </label>
              <input
                name="name"
                type="text"
                placeholder="John Doe"
                className="w-full px-5 py-4 bg-black/20 rounded-2xl border border-white/10 focus:border-accent/50 focus:ring-1 focus:ring-accent/50 outline-none transition-all placeholder:text-primary/20 text-primary text-base"
              />
            </div>

            <div className="group">
              <label className="text-sm font-medium text-secondary mb-2 block group-focus-within:text-accent transition-colors">
                Email
              </label>
              <input
                name="email"
                type="email"
                placeholder="john@example.com"
                className="w-full px-5 py-4 bg-black/20 rounded-2xl border border-white/10 focus:border-accent/50 focus:ring-1 focus:ring-accent/50 outline-none transition-all placeholder:text-primary/20 text-primary text-base"
              />
            </div>

            <div className="group">
              <label className="text-sm font-medium text-secondary mb-2 block group-focus-within:text-accent transition-colors">
                Message
              </label>
              <textarea
                name="message"
                rows={4}
                placeholder="Tell me about your project..."
                className="w-full px-5 py-4 bg-black/20 rounded-2xl border border-white/10 focus:border-accent/50 focus:ring-1 focus:ring-accent/50 outline-none transition-all placeholder:text-primary/20 text-primary resize-none text-base"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-4 text-lg shadow-xl shadow-accent/20 hover:shadow-accent/40 rounded-xl"
            >
              {loading ? (
                <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send size={20} />
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
