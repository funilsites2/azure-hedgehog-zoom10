"use client";

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

const HomeLoginButton: React.FC = () => {
  const location = useLocation();
  if (location.pathname !== "/") return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Link to="/login">
        <Button className="rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg">
          <LogIn className="h-4 w-4 mr-2" />
          Login
        </Button>
      </Link>
    </div>
  );
};

export default HomeLoginButton;