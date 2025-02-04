import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import Embed from "./pages/Embed";
import type { Session } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);

        if (session) {
          const { data: roles, error } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id);

          if (error && error.code !== 'PGRST116') {
            toast({
              title: "Error checking user role",
              description: error.message,
              variant: "destructive"
            });
            setLoading(false);
            return;
          }

          // Check if user has admin role
          setIsAdmin(roles && roles.length > 0 && roles[0]?.role === 'admin');
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Auth check error:', error);
        toast({
          title: "Authentication Error",
          description: "There was an error checking your authentication status",
          variant: "destructive"
        });
        setLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const App = () => {
  // Check if the app is running in embedded mode
  const isEmbedded = window.location.pathname === '/embed' || window.location.search.includes('embedded=true');

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {!isEmbedded && (
          <>
            <Toaster />
            <Sonner />
          </>
        )}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/embed" element={<Embed />} />
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />
            {/* Catch-all route for Vercel */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;