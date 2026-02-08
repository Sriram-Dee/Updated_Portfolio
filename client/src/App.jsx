import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import Portfolio from "./pages/Portfolio";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const { data } = await axios.get("/api/portfolio");
        if (data?.theme) {
          Object.entries(data.theme).forEach(([key, value]) => {
            document.documentElement.style.setProperty(`--color-${key}`, value);
          });
        }
      } catch (error) {
        console.error("Failed to load theme:", error);
      }
    };
    fetchTheme();
  }, []);

  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#1f2937",
            color: "#f9fafb",
            border: "1px solid rgba(139, 92, 246, 0.3)",
            borderRadius: "12px",
            boxShadow: "0 10px 40px -10px rgba(0, 0, 0, 0.5)",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#f9fafb",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#f9fafb",
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
