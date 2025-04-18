
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import NotFound from "./pages/NotFound";
import AuthForm from "./components/AuthForm";
import DashboardLayout from "./layouts/DashboardLayout";
import AuthLayout from "./layouts/AuthLayout";
import Dashboard from "./pages/Dashboard";
import MessagesPage from "./pages/MessagesPage";
import ChannelPage from "./pages/ChannelPage";
import AddChannelPage from "./pages/AddChannelPage";
import NotificationsPage from "./pages/NotificationsPage";
import StarredPage from "./pages/StarredPage";
import ArchivedPage from "./pages/ArchivedPage";
import Settings from "./pages/Settings";
import HelpPage from "./pages/HelpPage";
import LandingPage from "./pages/LandingPage";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useApp();
  
  if (isLoading) {
    return <div className="flex h-screen w-screen items-center justify-center">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

const AuthenticatedApp = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      
      <Route path="/auth" element={<AuthLayout />}>
        <Route index element={<AuthForm />} />
      </Route>
      
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="channel/:channelId" element={<ChannelPage />} />
        <Route path="add-channel" element={<AddChannelPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="starred" element={<StarredPage />} />
        <Route path="archived" element={<ArchivedPage />} />
        <Route path="settings" element={<Settings />} />
        <Route path="help" element={<HelpPage />} />
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthenticatedApp />
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
