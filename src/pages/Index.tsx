
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useApp } from "@/context/AppContext";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useApp();
  
  useEffect(() => {
    // Redirect based on authentication status
    if (isAuthenticated) {
      navigate("/");
    } else {
      navigate("/auth");
    }
  }, [isAuthenticated, navigate]);
  
  // This is just a loading screen while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <img src="/logo.svg" alt="Channel Nexus Logo" className="h-16 w-16 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Channel Nexus</h1>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
};

export default Index;
