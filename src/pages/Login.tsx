// ════════════════════════════════════════════════════════════════════════
// Login.tsx — Mis à jour avec accès rapide Manager
// ════════════════════════════════════════════════════════════════════════
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Mail, Eye, EyeOff, Plane, Shield, User, Briefcase } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const result = login(email, password);
    if (!result.success) setError(result.error || "Erreur de connexion");
  };

  const quickLogin = (role: "admin" | "manager" | "employee") => {
    if (role === "admin") login("admin@accessmorocco.ma", "admin123");
    else if (role === "manager") login("manager.mice@accessmorocco.ma", "manager123");
    else login("employe@accessmorocco.ma", "employe123");
  };

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden flex-col items-center justify-center text-primary-foreground p-12">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTRWMjhIMjR2MmgxMnpNMjQgMjRoMTJ2LTJIMjR2MnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
        <div className="relative z-10 text-center space-y-8">
          <img src="/src/assets/access_.png" alt="Access Morocco" />
          <div>
            <h1 className="text-4xl font-bold mb-3">Access Morocco ERP</h1>
            <p className="text-lg opacity-90">Système de gestion intégré pour agence de voyage</p>
          </div>
          <div className="grid grid-cols-1 gap-4 max-w-sm mx-auto mt-8">
            <div className="flex items-center gap-3 bg-white/10 rounded-lg px-4 py-3">
              <Plane className="shrink-0" size={20} />
              <span className="text-sm">Gestion Hajj, Omra & Tourisme</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 rounded-lg px-4 py-3">
              <Shield className="shrink-0" size={20} />
              <span className="text-sm">Contrôle d'accès par rôle</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 rounded-lg px-4 py-3">
              <Briefcase className="shrink-0" size={20} />
              <span className="text-sm">Admin · Manager · Employé</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground">Connexion</h2>
            <p className="text-muted-foreground mt-1">Accédez à votre espace de travail</p>
          </div>

          <Card className="border-border/50 shadow-lg">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-lg border border-destructive/20">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Adresse email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <Input id="email" type="email" placeholder="votre@email.com" className="pl-10" value={email} onChange={e => setEmail(e.target.value)} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" className="pl-10 pr-10" value={password} onChange={e => setPassword(e.target.value)} required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full">Se connecter</Button>
              </form>
            </CardContent>
          </Card>

          {/* Demo quick access — 3 rôles */}
          <Card className="border-dashed border-2 border-primary/30 bg-primary/5">
            <CardHeader className="pb-3 pt-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-primary text-primary text-xs">DÉMO</Badge>
                <span className="text-sm font-medium text-foreground">Accès rapide</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 pb-4">

              {/* Admin */}
              <button onClick={() => quickLogin("admin")} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-border bg-background hover:bg-accent transition-colors text-left">
                <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">AM</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Admin Manager</p>
                  <p className="text-xs text-muted-foreground">admin@accessmorocco.ma</p>
                </div>
                <Badge className="bg-primary/10 text-primary border-0 text-xs">Admin</Badge>
              </button>

              {/* Manager */}
              <button onClick={() => quickLogin("manager")} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-border bg-background hover:bg-accent transition-colors text-left">
                <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 text-xs font-bold">KH</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Karim Hamdoune</p>
                  <p className="text-xs text-muted-foreground">manager.mice@accessmorocco.ma</p>
                </div>
                <Badge className="bg-amber-100 text-amber-700 border-0 text-xs">Manager MICE</Badge>
              </button>

              {/* Employé */}
              <button onClick={() => quickLogin("employee")} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-border bg-background hover:bg-accent transition-colors text-left">
                <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-accent-foreground text-xs font-bold">YE</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Youssef El Amrani</p>
                  <p className="text-xs text-muted-foreground">employe@accessmorocco.ma</p>
                </div>
                <Badge variant="secondary" className="text-xs">Employé</Badge>
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}