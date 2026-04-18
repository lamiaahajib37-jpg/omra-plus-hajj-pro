// ════════════════════════════════════════════════════════════════════════
// ClientLogin.tsx  —  /client
// Page de connexion dédiée aux clients — redesign mobile-first
// ════════════════════════════════════════════════════════════════════════
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail, Lock, Eye, EyeOff, Plane, MapPin, Star,
  ArrowRight, Grid2X2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import logoAccess from "@/assets/Access_.png";
 
export default function ClientLogin() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
 
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
    if (user?.role !== "client") {
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
 
      {/* ══════════════════════════════════════════
          DESKTOP LAYOUT  (lg et plus)
          — identique à l'original
      ══════════════════════════════════════════ */}
      <div className="hidden lg:flex flex-col flex-1">
        {/* Header */}
        <header className="border-b border-border/50 bg-card px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoAccess} alt="Access Morocco" className="h-8 w-auto" />
            <span className="text-sm font-semibold text-foreground">Espace Client</span>
          </div>
          <a href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Espace équipe →
          </a>
        </header>
 
        <div className="flex-1 flex">
          {/* Gauche branding */}
          <div className="lg:w-5/12 bg-primary flex flex-col justify-between p-12 text-primary-foreground relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="absolute rounded-full border border-white/20"
                  style={{
                    width: `${(i + 1) * 120}px`,
                    height: `${(i + 1) * 120}px`,
                    top: "50%", left: "50%",
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
                { icon: <Plane size={15} />,  text: "Programme jour par jour" },
                { icon: <MapPin size={15} />, text: "Carte interactive de votre itinéraire" },
                { icon: <Star size={15} />,   text: "Photos & souvenirs de votre voyage" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3">
                  <span className="text-primary-foreground/80">{item.icon}</span>
                  <span className="text-sm font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
 
          {/* Droite formulaire */}
          <div className="flex-1 flex items-center justify-center p-8">
            <DesktopFormContent
              email={email} setEmail={setEmail}
              password={password} setPassword={setPassword}
              showPass={showPass} setShowPass={setShowPass}
              error={error} loading={loading}
              handleSubmit={handleSubmit} quickLogin={quickLogin}
            />
          </div>
        </div>
      </div>
 
      {/* ══════════════════════════════════════════
          MOBILE LAYOUT  (< lg)
          — nouveau design
      ══════════════════════════════════════════ */}
      <div className="flex flex-col flex-1 lg:hidden">
 
        {/* ── Hero rouge ── */}
        <div className="relative bg-primary overflow-hidden px-6 pt-12 pb-10">
 
          {/* Cercles décoratifs */}
          {[140, 100, 64].map((size, i) => (
            <div key={i} className="absolute rounded-full border border-white/10"
              style={{
                width: size, height: size,
                right: -size / 3, top: -size / 3,
              }}
            />
          ))}
 
          {/* Header row */}
          <div className="relative z-10 flex items-center justify-between mb-8">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center">
                <img src={logoAccess} alt="Access Morocco" className="h-5 w-auto" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-white leading-none">Access Morocco</p>
                <p className="text-[10px] text-white/60 leading-none mt-0.5">Espace Client</p>
              </div>
            </div>
            <a href="/"
              className="text-[11px] text-white/70 bg-white/10 px-3 py-1.5 rounded-full hover:bg-white/20 transition-colors">
              Équipe →
            </a>
          </div>
 
          {/* Badge */}
          <div className="relative z-10 inline-flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1.5 mb-3">
            <Star size={10} className="fill-white text-white" />
            <span className="text-[11px] font-medium text-white">Votre voyage, à portée de main</span>
          </div>
 
          {/* Titre */}
          <h1 className="relative z-10 text-[22px] font-bold text-white leading-snug mb-2">
            Suivez votre voyage<br />en temps réel
          </h1>
          <p className="relative z-10 text-[13px] text-white/70 leading-relaxed mb-5">
            Programme, itinéraire & souvenirs — tout en un endroit.
          </p>
 
          {/* Feature pills */}
          <div className="relative z-10 flex flex-wrap gap-2">
            {[
              { icon: <Plane size={11} />,   text: "Itinéraire jour/jour" },
              { icon: <MapPin size={11} />,  text: "Carte interactive" },
              { icon: <Grid2X2 size={11} />, text: "Photos & souvenirs" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1.5">
                <span className="text-white/80">{item.icon}</span>
                <span className="text-[11px] font-medium text-white">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
 
        {/* ── Carte blanche qui overlap ── */}
        <div className="-mt-4 rounded-t-3xl bg-card flex-1 px-6 pt-8 pb-10 shadow-sm">
 
          <h2 className="text-xl font-bold text-foreground mb-1">Connexion</h2>
          <p className="text-[13px] text-muted-foreground mb-6">
            Accédez à votre espace voyage personnalisé
          </p>
 
          <MobileFormContent
            email={email} setEmail={setEmail}
            password={password} setPassword={setPassword}
            showPass={showPass} setShowPass={setShowPass}
            error={error} loading={loading}
            handleSubmit={handleSubmit} quickLogin={quickLogin}
          />
        </div>
      </div>
    </div>
  );
}
 
/* ─────────────────────────────────────────────────────────────
   FormFields — props partagés
───────────────────────────────────────────────────────────── */
interface FormProps {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  showPass: boolean;
  setShowPass: (v: boolean) => void;
  error: string;
  loading: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  quickLogin: (email: string) => void;
}
 
/* ─────────────────────────────────────────────────────────────
   Desktop form (inchangé)
───────────────────────────────────────────────────────────── */
function DesktopFormContent(p: FormProps) {
  return (
    <div className="w-full max-w-sm space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Connexion</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Accédez à votre espace voyage personnalisé
        </p>
      </div>
      <FormBody {...p} inputClass="h-10" btnClass="h-10" />
    </div>
  );
}
 
/* ─────────────────────────────────────────────────────────────
   Mobile form
───────────────────────────────────────────────────────────── */
function MobileFormContent(p: FormProps) {
  return <FormBody {...p} inputClass="h-11" btnClass="h-12" />;
}
 
/* ─────────────────────────────────────────────────────────────
   FormBody — réutilisé dans les deux layouts
───────────────────────────────────────────────────────────── */
function FormBody({ 
  email, setEmail, password, setPassword,
  showPass, setShowPass, error, loading,
  handleSubmit, quickLogin, inputClass, btnClass
}: FormProps & { inputClass: string; btnClass: string }) {
  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-xl border border-destructive/20">
            {error}
          </div>
        )}
 
        {/* Email */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Adresse email
          </Label>
          <div className="relative">
            <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="email"
              placeholder="votre@email.com"
              className={`pl-10 ${inputClass} rounded-xl bg-muted/40 border-border/60`}
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
 
        {/* Password */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Mot de passe
          </Label>
          <div className="relative">
            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type={showPass ? "text" : "password"}
              placeholder="••••••••"
              className={`pl-10 pr-10 ${inputClass} rounded-xl bg-muted/40 border-border/60`}
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
 
        <Button
          type="submit"
          className={`w-full ${btnClass} gap-2 rounded-xl text-base font-semibold`}
          disabled={loading}
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          ) : (
            <>Se connecter <ArrowRight size={15} /></>
          )}
        </Button>
      </form>
 
      {/* Demo accès rapide */}
      <div className="pt-5 border-t border-border/50">
        <p className="text-xs text-muted-foreground mb-3 text-center">Démo — accès rapide</p>
        <div className="space-y-2.5">
 
          <button
            onClick={() => quickLogin("rim.sentissi@gmail.com")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl border border-border bg-card hover:bg-accent active:scale-[0.98] transition-all text-left"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
              RS
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground leading-tight">Rim Sentissi</p>
              <p className="text-xs text-muted-foreground truncate">rim.sentissi@gmail.com</p>
            </div>
            <span className="text-[11px] px-2.5 py-1 rounded-full bg-primary/10 text-primary font-semibold shrink-0">
              Client
            </span>
          </button>
 
          <button
            onClick={() => quickLogin("christie.rogers@brightspot.com")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl border border-border bg-card hover:bg-accent active:scale-[0.98] transition-all text-left"
          >
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 text-xs font-bold shrink-0">
              CR
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground leading-tight">Christie Rogers</p>
              <p className="text-xs text-muted-foreground truncate">christie.rogers@brightspot.com</p>
            </div>
            <span className="text-[11px] px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 font-semibold shrink-0">
              Brightspot
            </span>
          </button>
 
        </div>
      </div>
    </>
  );
}