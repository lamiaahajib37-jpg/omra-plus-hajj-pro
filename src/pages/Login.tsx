// ════════════════════════════════════════════════════════════════════════
// Login.tsx — Mobile redesign (full-screen, clean)
// ════════════════════════════════════════════════════════════════════════
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Lock, Mail, Eye, EyeOff, Plane,
  Shield, Briefcase, ArrowRight, Users, ChevronRight,
} from "lucide-react";
import logoAccess from "@/assets/Access_.png";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]             = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const result = login(email, password);
    if (!result.success) setError(result.error || "Erreur de connexion");
  };

  const quickLogin = (role: "admin" | "manager" | "employee") => {
    if (role === "admin")        login("admin@accessmorocco.ma",        "admin123");
    else if (role === "manager") login("manager.mice@accessmorocco.ma", "manager123");
    else                         login("employe@accessmorocco.ma",      "employe123");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">

      {/* ══════════════════════════════════════════
          DESKTOP  (lg+) — inchangé
      ══════════════════════════════════════════ */}
      <div className="hidden lg:flex flex-1 bg-muted/30">
        {/* Left panel */}
        <div className="lg:w-1/2 bg-primary relative overflow-hidden flex flex-col items-center justify-center text-primary-foreground p-12">
          <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTRWMjhIMjR2MmgxMnpNMjQgMjRoMTJ2LTJIMjR2MnoiLz48L2c+PC9nPjwvc3ZnPg==')]" />
          <div className="relative z-10 text-center space-y-8">
            <img src={logoAccess} alt="Access Morocco" />
            <div>
              <h1 className="text-4xl font-bold mb-3">Access Morocco ERP</h1>
              <p className="text-lg opacity-90">Système de gestion intégré pour agence de voyage</p>
            </div>
            <div className="grid grid-cols-1 gap-4 max-w-sm mx-auto mt-8">
              {[
                { icon: <Plane size={20} />,    text: "Gestion Hajj, Omra & Tourisme" },
                { icon: <Shield size={20} />,   text: "Contrôle d'accès par rôle" },
                { icon: <Briefcase size={20} />, text: "Admin · Manager · Employé" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/10 rounded-lg px-4 py-3">
                  <span className="shrink-0">{item.icon}</span>
                  <span className="text-sm">{item.text}</span>
                </div>
              ))}
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
                <FormFields
                  email={email} setEmail={setEmail}
                  password={password} setPassword={setPassword}
                  showPassword={showPassword} setShowPassword={setShowPassword}
                  error={error} handleSubmit={handleSubmit}
                  inputClass="h-10" btnClass="h-10"
                />
              </CardContent>
            </Card>
            <DemoCard quickLogin={quickLogin} />
            <div className="text-center">
              <button
                onClick={() => navigate("/client")}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5"
              >
                <Users size={13} />
                Accéder à l'espace client
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          MOBILE  (< lg) — nouveau design full-screen
      ══════════════════════════════════════════ */}
      <div className="flex flex-col flex-1 lg:hidden">

        {/* ── Hero rouge ── */}
        <div className="relative bg-primary overflow-hidden px-7 pt-14 pb-10">
          {/* Cercles décoratifs */}
          {[
            { size: 220, right: -70, top: -70 },
            { size: 140, right: -30, top: 20 },
            { size: 80,  right: 20,  top: 80 },
          ].map((c, i) => (
            <div key={i} className="absolute rounded-full border border-white/10"
              style={{ width: c.size, height: c.size, right: c.right, top: c.top }}
            />
          ))}

          {/* Top bar */}
          <div className="relative z-10 flex items-center justify-between mb-8">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
                <img src={logoAccess} alt="Access Morocco" className="h-5 w-auto" />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-white leading-none">Access Morocco</p>
                <p className="text-[10px] text-white/55 leading-none mt-0.5">ERP</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/client")}
              className="flex items-center gap-1.5 text-[11px] text-white/85 bg-white/14 border border-white/20 px-3 py-1.5 rounded-full"
            >
              <Users size={10} />
              Espace client
            </button>
          </div>

          {/* Title */}
          <h1 className="relative z-10 text-[30px] font-bold text-white leading-tight mb-2">
            Access Morocco<br />ERP
          </h1>
          <p className="relative z-10 text-[13px] text-white/65 leading-relaxed mb-6">
            Système de gestion intégré<br />pour agence de voyage
          </p>

          {/* Feature pills */}
          <div className="relative z-10 flex flex-wrap gap-2">
            {[
              { icon: <Plane size={11} />,      text: "Hajj, Omra & Tourisme" },
              { icon: <Shield size={11} />,     text: "Accès par rôle" },
              { icon: <Briefcase size={11} />,  text: "Admin · Manager · Employé" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1.5">
                <span className="text-white/75">{item.icon}</span>
                <span className="text-[11px] font-medium text-white">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Carte blanche (overlap) ── */}
        <div className="-mt-4 rounded-t-[28px] bg-card flex-1 px-7 pt-8 pb-12 shadow-sm">

          <h2 className="text-[22px] font-bold text-foreground mb-1">Connexion</h2>
          <p className="text-[13px] text-muted-foreground mb-6">Accédez à votre espace de travail</p>

          {/* Form */}
          <FormFields
            email={email} setEmail={setEmail}
            password={password} setPassword={setPassword}
            showPassword={showPassword} setShowPassword={setShowPassword}
            error={error} handleSubmit={handleSubmit}
            inputClass="h-[52px] text-[15px]"
            btnClass="h-[52px] text-[16px]"
          />

          {/* Demo box */}
          <div className="mt-6 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/[0.03] p-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] font-bold tracking-widest text-primary border border-primary/30 rounded-full px-2.5 py-0.5 uppercase bg-primary/10">
                Démo
              </span>
              <span className="text-[14px] font-medium text-foreground">Accès rapide</span>
            </div>

            <div className="space-y-2.5">
              <DemoButton
                initials="AM"
                initialsClass="bg-primary/10 text-primary"
                name="Admin Manager"
                email="admin@accessmorocco.ma"
                badgeLabel="Admin"
                badgeClass="bg-primary/10 text-primary"
                onClick={() => quickLogin("admin")}
              />
              <DemoButton
                initials="KH"
                initialsClass="bg-amber-100 text-amber-700"
                name="Karim Hamdoune"
                email="manager.mice@accessmorocco.ma"
                badgeLabel="Manager MICE"
                badgeClass="bg-amber-100 text-amber-700"
                onClick={() => quickLogin("manager")}
              />
              <DemoButton
                initials="YE"
                initialsClass="bg-muted text-muted-foreground"
                name="Youssef El Amrani"
                email="employe@accessmorocco.ma"
                badgeLabel="Employé"
                badgeClass="bg-muted text-muted-foreground"
                onClick={() => quickLogin("employee")}
              />
            </div>
          </div>

          {/* Espace client button */}
          <button
            onClick={() => navigate("/client")}
            className="mt-4 w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border border-border bg-card hover:bg-accent active:scale-[0.98] transition-all"
          >
            <Users size={15} className="text-muted-foreground" />
            <span className="text-[14px] font-medium text-foreground flex-1 text-left">
              Accéder à l'espace client
            </span>
            <ChevronRight size={14} className="text-muted-foreground" />
          </button>

          {/* Home indicator */}
          <div className="flex justify-center mt-7">
            <div className="w-28 h-1 bg-border rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   FormFields
───────────────────────────────────────────────────────────── */
interface FormFieldsProps {
  email: string; setEmail: (v: string) => void;
  password: string; setPassword: (v: string) => void;
  showPassword: boolean; setShowPassword: (v: boolean) => void;
  error: string;
  handleSubmit: (e: React.FormEvent) => void;
  inputClass: string;
  btnClass: string;
}

function FormFields({
  email, setEmail, password, setPassword,
  showPassword, setShowPassword, error, handleSubmit,
  inputClass, btnClass,
}: FormFieldsProps) {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-xl border border-destructive/20">
          {error}
        </div>
      )}
      <div className="space-y-1.5">
        <Label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
          Adresse email
        </Label>
        <div className="relative">
          <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="email" placeholder="votre@email.com"
            className={`pl-10 ${inputClass} rounded-[14px] bg-muted/40 border-border/60`}
            value={email} onChange={e => setEmail(e.target.value)} required
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
          Mot de passe
        </Label>
        <div className="relative">
          <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            type={showPassword ? "text" : "password"} placeholder="••••••••"
            className={`pl-10 pr-10 ${inputClass} rounded-[14px] bg-muted/40 border-border/60`}
            value={password} onChange={e => setPassword(e.target.value)} required
          />
          <button type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      </div>
      <Button type="submit"
        className={`w-full ${btnClass} gap-2 rounded-[14px] font-semibold mt-2`}
      >
        Se connecter <ArrowRight size={15} />
      </Button>
    </form>
  );
}

/* ─────────────────────────────────────────────────────────────
   DemoCard — desktop
───────────────────────────────────────────────────────────── */
function DemoCard({ quickLogin }: { quickLogin: (r: "admin" | "manager" | "employee") => void }) {
  return (
    <Card className="border-dashed border-2 border-primary/30 bg-primary/5">
      <CardHeader className="pb-3 pt-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-primary text-primary text-xs">DÉMO</Badge>
          <span className="text-sm font-medium text-foreground">Accès rapide</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 pb-4">
        <DemoButton initials="AM" initialsClass="bg-primary/10 text-primary"
          name="Admin Manager" email="admin@accessmorocco.ma"
          badgeLabel="Admin" badgeClass="bg-primary/10 text-primary"
          onClick={() => quickLogin("admin")} />
        <DemoButton initials="KH" initialsClass="bg-amber-100 text-amber-700"
          name="Karim Hamdoune" email="manager.mice@accessmorocco.ma"
          badgeLabel="Manager MICE" badgeClass="bg-amber-100 text-amber-700"
          onClick={() => quickLogin("manager")} />
        <DemoButton initials="YE" initialsClass="bg-muted text-muted-foreground"
          name="Youssef El Amrani" email="employe@accessmorocco.ma"
          badgeLabel="Employé" badgeClass="bg-muted text-muted-foreground"
          onClick={() => quickLogin("employee")} />
      </CardContent>
    </Card>
  );
}

/* ─────────────────────────────────────────────────────────────
   DemoButton
───────────────────────────────────────────────────────────── */
interface DemoBtnProps {
  initials: string; initialsClass: string;
  name: string; email: string;
  badgeLabel: string; badgeClass: string;
  onClick: () => void;
}
function DemoButton({ initials, initialsClass, name, email, badgeLabel, badgeClass, onClick }: DemoBtnProps) {
  return (
    <button onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl border border-border bg-background hover:bg-accent active:scale-[0.98] transition-all text-left"
    >
      <div className={`w-11 h-11 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${initialsClass}`}>
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold text-foreground leading-tight">{name}</p>
        <p className="text-[12px] text-muted-foreground truncate">{email}</p>
      </div>
      <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold shrink-0 ${badgeClass}`}>
        {badgeLabel}
      </span>
    </button>
  );
}