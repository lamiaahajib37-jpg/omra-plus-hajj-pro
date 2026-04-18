// ════════════════════════════════════════════════════════════════════════
// ClientLogin.tsx  —  /client
// Page de connexion dédiée aux clients (séparée du login ERP)
// ════════════════════════════════════════════════════════════════════════
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Plane, MapPin, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import logoAccess from "@/assets/Access_.png";
export default function ClientLogin() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Si déjà connecté comme client, redirect
  if (user?.role === "client") {
    navigate("/client/portal");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const result = login(email, password);
    setLoading(false);
    if (!result.success) {
      setError(result.error || "Email ou mot de passe incorrect");
      return;
    }
    // Vérifier que c'est bien un client
    if (user?.role !== "client") {
      // Login d'un employé/admin sur le portal client → redirect vers ERP
      navigate("/");
      return;
    }
    navigate("/client/portal");
  };

  const quickLogin = (email: string) => {
    login(email, "client123");
    navigate("/client/portal");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">

      {/* ── Header minimal ── */}
      <header className="border-b border-border/50 bg-card px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
<img src={logoAccess} alt="Access Morocco" className="h-8 w-auto" />
            <span className="text-sm font-semibold text-foreground hidden sm:block">Espace Client</span>
        </div>
        <a href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
          Espace équipe →
        </a>
      </header>

      <div className="flex-1 flex">

        {/* ── Gauche: branding ── */}
        <div className="hidden lg:flex lg:w-5/12 bg-primary flex-col justify-between p-12 text-primary-foreground relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="absolute rounded-full border border-white/20"
                style={{
                  width: `${(i + 1) * 120}px`,
                  height: `${(i + 1) * 120}px`,
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)"
                }}
              />
            ))}
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5 text-xs font-medium mb-8">
              <Star size={11} className="fill-current" />
              Votre voyage, à portée de main
            </div>
            <h1 className="text-4xl font-bold leading-tight mb-4">
              Suivez votre voyage en temps réel
            </h1>
            <p className="text-lg text-primary-foreground/80 leading-relaxed">
              Consultez votre programme, validez vos présentations, et retrouvez vos souvenirs — tout en un endroit.
            </p>
          </div>

           <div className="relative z-10 space-y-3 mb-[300px]">
            {[
              { icon: <Plane size={15} />, text: "Programme jour par jour" },
              { icon: <MapPin size={15} />, text: "Carte interactive de votre itinéraire" },
              { icon: <Star size={15} />, text: "Photos & souvenirs de votre voyage" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3">
                <span className="text-primary-foreground/80">{item.icon}</span>
                <span className="text-sm font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Droite: formulaire ── */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-sm space-y-6">

            <div>
              <h2 className="text-2xl font-bold text-foreground">Connexion</h2>
              <p className="text-sm text-muted-foreground mt-1">Accédez à votre espace voyage personnalisé</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-lg border border-destructive/20">
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <Label>Adresse email</Label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="votre@email.com"
                    className="pl-10 h-10"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Mot de passe</Label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10 h-10"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full h-10 gap-2" disabled={loading}>
                {loading ? (
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <>Se connecter <ArrowRight size={15} /></>
                )}
              </Button>
            </form>

            {/* Demo acces rapide */}
            <div className="pt-2 border-t border-border/50">
              <p className="text-xs text-muted-foreground mb-3 text-center">Démo — accès rapide</p>
              <div className="space-y-2">
                <button
                  onClick={() => quickLogin("rim.sentissi@gmail.com")}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-card hover:bg-accent transition-colors text-left"
                >
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">RS</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">Rim Sentissi</p>
                    <p className="text-xs text-muted-foreground truncate">rim.sentissi@gmail.com</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium shrink-0">Client</span>
                </button>

                <button
                  onClick={() => quickLogin("christie.rogers@brightspot.com")}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-card hover:bg-accent transition-colors text-left"
                >
                  <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 text-xs font-bold shrink-0">CR</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">Christie Rogers</p>
                    <p className="text-xs text-muted-foreground truncate">christie.rogers@brightspot.com</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium shrink-0">Brightspot</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}