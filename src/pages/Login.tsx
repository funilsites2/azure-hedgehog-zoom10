import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ShoppingBag, Mail, Lock, ChevronRight, Twitter, Facebook } from "lucide-react";
import { showError, showSuccess } from "@/utils/toast";

type Role = "admin" | "aluno";

const gradientBg =
  "bg-gradient-to-br from-emerald-300 via-teal-300 to-emerald-400";

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validate = (r: Role, em: string, pw: string) => {
    if (!em.trim() || !pw.trim()) {
      showError("Preencha e-mail e senha");
      return false;
    }
    if (r === "admin") {
      // Regras simples de exemplo para admin
      const ok =
        (em === "admin@exemplo.com" && pw === "admin123") ||
        (em.toLowerCase().includes("admin") && pw.length >= 6);
      if (!ok) {
        showError("Credenciais de admin inválidas");
        return false;
      }
    } else {
      // Aluno: validação simples
      if (pw.length < 3) {
        showError("Senha do aluno precisa ter pelo menos 3 caracteres");
        return false;
      }
    }
    return true;
  };

  const onSubmit = (r: Role) => {
    if (!validate(r, email, password)) return;
    try {
      localStorage.setItem("auth_role", r);
      localStorage.setItem("auth_email", email);
    } catch {}
    showSuccess(r === "admin" ? "Bem-vindo, admin!" : "Bem-vindo, aluno!");
    navigate(r === "admin" ? "/admin" : "/aluno");
  };

  const SocialButtons = () => (
    <div className="space-y-2">
      <Button
        type="button"
        variant="secondary"
        className="w-full justify-start bg-neutral-100 hover:bg-neutral-200 text-neutral-800"
        onClick={() => showError("Login social não implementado")}
      >
        <Twitter className="mr-2 h-4 w-4 text-sky-500" />
        Entrar com Twitter
      </Button>
      <Button
        type="button"
        variant="secondary"
        className="w-full justify-start bg-neutral-100 hover:bg-neutral-200 text-neutral-800"
        onClick={() => showError("Login social não implementado")}
      >
        <Facebook className="mr-2 h-4 w-4 text-sky-700" />
        Entrar com Facebook
      </Button>
    </div>
  );

  const Form = () => (
    <div className="space-y-3">
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
        <Input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
        <Input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="pl-9"
        />
      </div>
      <Button
        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center gap-2"
        onClick={() => onSubmit(role)}
      >
        CONTINUAR <ChevronRight className="h-4 w-4" />
      </Button>
      <div className="text-xs text-neutral-500 text-center">
        ou conecte-se com redes sociais
      </div>
      <SocialButtons />
    </div>
  );

  return (
    <div className={`min-h-screen w-full ${gradientBg} flex items-center justify-center p-4`}>
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Painel de boas-vindas (esquerda) */}
        <div className="hidden md:flex rounded-2xl relative overflow-hidden p-8 text-white items-center">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute w-40 h-40 bg-white rounded-xl blur-3xl top-6 left-8" />
            <div className="absolute w-56 h-56 bg-white rounded-2xl blur-3xl bottom-8 right-10" />
            <div className="absolute w-24 h-24 bg-white rounded-xl blur-2xl top-1/3 right-20" />
          </div>
          <div className="relative z-10">
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-white/20 mb-6">
              <ShoppingBag className="h-7 w-7" />
            </div>
            <h2 className="text-3xl font-bold">Welcome Page</h2>
            <p className="text-white/90 mt-2">Sign in to continue access pages</p>
          </div>
        </div>

        {/* Card de Login (direita) */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-neutral-900">Sign In</h1>
            <p className="text-sm text-neutral-500">
              Sign in to continue access pages
            </p>
          </div>

          <Tabs value={role} onValueChange={(v) => setRole(v as Role)} className="w-full">
            <TabsList className="grid grid-cols-2 w-full bg-neutral-100">
              <TabsTrigger value="admin" className="data-[state=active]:bg-white">
                Admin
              </TabsTrigger>
              <TabsTrigger value="aluno" className="data-[state=active]:bg-white">
                Aluno
              </TabsTrigger>
            </TabsList>

            <TabsContent value="admin" className="mt-4">
              <Form />
            </TabsContent>
            <TabsContent value="aluno" className="mt-4">
              <Form />
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-xs text-neutral-500 text-center">
            Dica: Admin de exemplo — admin@exemplo.com / admin123
          </div>
        </div>
      </div>
    </div>
  );
}