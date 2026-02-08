import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

import { Button, Input } from "@/components/ui";
import { GradientText, SpotlightCard } from "@/components/effects";

const Login = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post("/api/login", { password });
      const { token } = response.data;

      // Store token
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      toast.success("Login successful!");
      navigate("/admin");
    } catch (err) {
      const message = err.response?.data?.error || "Login failed";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      {/* Background */}
      <div className="absolute inset-0 mesh-gradient opacity-50" />
      <div className="absolute inset-0 bg-noise" />

      {/* Back to portfolio */}
      <motion.a
        href="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-text-secondary hover:text-white transition"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <ArrowLeft size={20} />
        <span>Back to Portfolio</span>
      </motion.a>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative"
      >
        <SpotlightCard className="glass p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent-secondary flex items-center justify-center mx-auto mb-6 shadow-lg shadow-accent/25">
              <Lock size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold font-heading mb-2">
              <GradientText>Admin Access</GradientText>
            </h1>
            <p className="text-text-secondary">
              Enter your password to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                error={error}
                icon={<Lock size={18} />}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              loading={loading}
            >
              Sign In
            </Button>
          </form>

          {/* Security note */}
          <p className="text-center text-text-muted text-xs mt-6">
            This is a secured admin area. Unauthorized access is prohibited.
          </p>
        </SpotlightCard>

        {/* Decorative elements */}
        <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-accent/20 rounded-full blur-3xl" />
      </motion.div>
    </div>
  );
};

export default Login;
