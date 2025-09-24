import { MadeWithDyad } from "@/components/made-with-dyad";
import { Link } from "react-router-dom";
import { Layers, User } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-900 text-white">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Área de Membros</h1>
        <p className="text-xl text-neutral-400 mb-8">
          Plataforma inspirada em Netflix, Astron Members, The Members e Hotmart.
        </p>
        <div className="flex gap-6 justify-center">
          <Link
            to="/admin"
            className="flex items-center gap-2 px-6 py-3 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition"
          >
            <Layers size={22} /> Área do Admin
          </Link>
          <Link
            to="/aluno"
            className="flex items-center gap-2 px-6 py-3 bg-green-600 rounded-lg hover:bg-green-700 transition"
          >
            <User size={22} /> Área do Aluno
          </Link>
        </div>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;