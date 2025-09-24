"use client";

import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSession } from "@/context/SessionProvider";

type Props = { children: React.ReactNode };

const RequireAuth: React.FC<Props> = ({ children }) => {
  const { session, loading } = useSession();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return;
    if (!session) {
      const next = encodeURIComponent(location.pathname + location.search);
      navigate(`/login?next=${next}`, { replace: true });
    }
  }, [session, loading, navigate, location.pathname, location.search]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-white">
        <div className="animate-pulse text-neutral-300">Verificando sessão...</div>
      </div>
    );
  }

  if (!session) return null;

  return <>{children}</>;
};

export default RequireAuth;