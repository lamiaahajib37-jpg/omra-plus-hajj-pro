import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plane, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logo from "@/assets/logo.png";

export default function ClientLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("client@accessmorocco.ma");
  const [password, setPassword] = useState("demo123");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/client");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full border-2 border-white" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full border-2 border-white" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-white" />
        </div>
        <div className="text-center text-primary-foreground z-10 px-12 space-y-6">
          <Plane size={56} className="mx-auto" />
          <h1 className="text-4xl font-bold leading-tight">Bienvenue sur votre<br />Espace Client</h1>
          <p className="text-lg opacity-80 max-w-md mx-auto">
            Gérez vos dossiers de voyage, suivez vos demandes et restez informé en temps réel.
          </p>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <img src={logo} alt="Access Morocco" className="h-12 mx-auto mb-6" />
            <h2 className="text-2xl font-bold">Connexion Client</h2>
            <p className="text-muted-foreground mt-1">Accédez à votre espace personnel</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  placeholder="votre@email.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <Button type="submit" className="w-full h-11 text-base">
              Se connecter
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground space-y-2">
            <p>Demo — cliquez directement sur "Se connecter"</p>
            <button
              onClick={() => navigate("/")}
              className="text-primary hover:underline font-medium"
            >
              Accès Administrateur →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
