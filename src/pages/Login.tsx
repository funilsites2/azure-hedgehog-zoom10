import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      if (data.session) navigate("/aluno", { replace: true });
    });
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) navigate("/aluno", { replace: true });
    });
    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-neutral-900">
      <div className="w-full max-w-md p-6 bg-white rounded-xl">
        <Auth
          supabaseClient={supabase}
          providers={[]}
          appearance={{ theme: ThemeSupa }}
          theme="light"
        />
      </div>
    </div>
  );
}