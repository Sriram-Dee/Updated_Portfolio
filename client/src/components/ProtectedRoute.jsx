import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        await axios.post(
          "/api/verify-token",
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        // Token valid, set default header for future requests
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } catch {
        // Token invalid or expired
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
        navigate("/login");
      }
    };

    verifyToken();
  }, [navigate]);

  return children;
};

export default ProtectedRoute;
