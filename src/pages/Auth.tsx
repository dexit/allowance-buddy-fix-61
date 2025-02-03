import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function AuthPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: error.message
        });
        return;
      }

      if (session) {
        navigate('/admin');
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate('/admin');
      }
      
      if (event === 'SIGNED_OUT') {
        navigate('/auth');
      }

      if (event === 'USER_DELETED' || event === 'PASSWORD_RECOVERY') {
        toast({
          variant: "destructive",
          title: "Authentication Event",
          description: `Event: ${event}`
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          src="https://f5fostercare.co.uk/wp-content/smush-webp/2024/08/f5-web-logo-done.png.webp"
          alt="F5 Foster Care"
          className="mx-auto h-16"
        />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Admin Login
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Auth
            supabaseClient={supabase}
            appearance={{ 
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#2563eb',
                    brandAccent: '#1d4ed8'
                  }
                }
              }
            }}
            providers={['github']}
            redirectTo={`${window.location.origin}/admin`}
          />
        </Card>
      </div>
    </div>
  );
}