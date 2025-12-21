
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication and user role
    const auth = localStorage.getItem("postpulse-authenticated");
    const isAdmin = localStorage.getItem("postpulse-admin") === "true";
    
    if (!auth) {
      navigate("/login");
    } else if (isAdmin) {
      navigate("/admin");
    } else {
      // This is a regular user, already on the right page
      // This component will not be used directly anymore
    }
  }, [navigate]);

  return null;
};

export default Dashboard;
