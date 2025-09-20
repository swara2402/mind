import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider, useAuth } from "@/components/AuthProvider";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";

// Import new pages (to be created)
import MoodTracker from "@/components/MoodTracker";
import Journal from "@/components/Journal";
import MindfulnessTools from "@/components/MindfulnessTools";
import Community from "@/components/Community";
import { LoginForm } from "@/components/LoginForm";
import { SignupForm } from "@/components/SignupForm";
import SplashScreen from "@/components/SplashScreen";
import { useState, useEffect } from "react";
import flashBg from "@assets/generated_images/flash_screen.png";
import heroBg from "@assets/generated_images/Diverse_Indian_youth_support_group_23098eaa.png";

function AuthRouter() {
  const { user, isLoading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  // Function to require authentication for protected actions
  const requireAuth = (action: string) => {
    if (!user) {
      setPendingAction(action);
      setShowAuth(true);
      return false;
    }
    return true;
  };

  // Function to handle successful login
  const handleAuthSuccess = () => {
    setShowAuth(false);
    setPendingAction(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth modal if needed
  if (showAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundImage: `url(${heroBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-full max-w-md bg-white rounded-lg shadow-xl">
            {isLogin ? (
              <LoginForm
                onSwitchToSignup={() => setIsLogin(false)}
                onSuccess={handleAuthSuccess}
              />
            ) : (
              <SignupForm
                onSwitchToLogin={() => setIsLogin(true)}
                onSuccess={handleAuthSuccess}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundImage: `url(${heroBg})`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh' }}>
      <Switch>
        <Route path="/" component={() => <Home requireAuth={requireAuth} />} />
        <Route path="/mood" component={() => {
          if (requireAuth('mood-tracking')) {
            return <MoodTracker userId={user!.id} />;
          }
          return null;
        }} />
        <Route path="/journal" component={() => {
          if (requireAuth('journaling')) {
            return <Journal userId={user!.id} />;
          }
          return null;
        }} />
        <Route path="/mindfulness" component={MindfulnessTools} />
        <Route path="/community" component={() => {
          if (requireAuth('community')) {
            return <Community userId={user!.id} />;
          }
          return null;
        }} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function Router() {
  return <AuthRouter />;
}

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000); // Match the 3 seconds in SplashScreen

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <ThemeProvider>
            <Toaster />
            <Router />
          </ThemeProvider>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
