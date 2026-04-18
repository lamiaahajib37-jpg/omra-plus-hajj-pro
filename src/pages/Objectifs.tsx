// ════════════════════════════════════════════════════════════════════════
// Objectifs.tsx — Objectifs & Performance (Admin + Manager + Employé)
// ════════════════════════════════════════════════════════════════════════
import { useState } from "react";
import {
  Target, Plus, X, Building2, Users, User,
  TrendingUp, Clock, CheckCircle2, AlertCircle,
  Calendar, Tag, BarChart2, Timer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell,
} from "recharts";
import { useAuth } from "@/contexts/AuthContext";

// ── Types ──────────────────────────────────────────────────────────────────
type ObjLevel  = "societe" | "departement" | "employe";
type ObjStatus = "En cours" | "En bonne voie" | "En retard" | "Terminé";

interface Objectif {
  id: number;
  titre: string;
  description: string;
  level: ObjLevel;
  cible?: string;
  progress: number;
  status: ObjStatus;
  deadline: string;
  kpi?: string;
}

// ── Static data ────────────────────────────────────────────────────────────
const DEPARTEMENTS = ["Commercial", "Hajj & Omra", "Tourisme", "Marketing", "Finance", "RH"];
const EMPLOYES = [
  "Youssef El Amrani", "Fatima Zahra Bennani", "Karim Tazi",
  "Amina Chraibi", "Hassan Ouazzani", "Sara Berrada",
];

const initialObjectifs: Objectif[] = [
  { id: 1,  titre: "CA Annuel 6M MAD",          description: "Atteindre un chiffre d'affaires de 6 millions MAD",             level: "societe",     progress: 76,  status: "En cours",       deadline: "2026-12-31", kpi: "MAD" },
  { id: 2,  titre: "500 pèlerins Hajj 2026",     description: "Organiser le voyage pour 500 pèlerins",                         level: "societe",     progress: 62,  status: "En cours",       deadline: "2026-05-01", kpi: "Pèlerins" },
  { id: 3,  titre: "Satisfaction client 95%",    description: "Maintenir un taux de satisfaction supérieur à 95%",             level: "societe",     progress: 91,  status: "En bonne voie",  deadline: "2026-12-31", kpi: "%" },
  { id: 4,  titre: "Lancement app mobile",       description: "Déployer l'application mobile pour les clients",               level: "societe",     progress: 30,  status: "En retard",       deadline: "2026-03-01", kpi: "Release" },
  { id: 5,  titre: "50 nouveaux clients B2B",    description: "Acquisition de 50 nouveaux clients entreprises",               level: "departement", cible: "Commercial",           progress: 68, status: "En cours",      deadline: "2026-09-30", kpi: "Clients" },
  { id: 6,  titre: "NPS > 4.5/5",               description: "Score de recommandation supérieur à 4.5",                      level: "departement", cible: "Hajj & Omra",          progress: 88, status: "En bonne voie", deadline: "2026-12-31", kpi: "Score" },
  { id: 7,  titre: "3 nouvelles destinations",  description: "Ouvrir 3 nouvelles destinations touristiques",                 level: "departement", cible: "Tourisme",             progress: 33, status: "En retard",      deadline: "2026-06-30", kpi: "Destinations" },
  { id: 8,  titre: "Budget publicitaire -10%",  description: "Réduire le budget pub tout en maintenant la portée",           level: "departement", cible: "Marketing",            progress: 55, status: "En cours",      deadline: "2026-12-31", kpi: "%" },
  { id: 9,  titre: "Clôture dossiers Hajj Q1",  description: "Finaliser 80 dossiers pèlerins avant fin Q1",                  level: "employe",     cible: "Fatima Zahra Bennani", progress: 95, status: "En bonne voie", deadline: "2026-03-31", kpi: "Dossiers" },
  { id: 10, titre: "Qualifier 20 leads/mois",   description: "Pipeline commercial mensuel de 20 leads qualifiés",            level: "employe",     cible: "Youssef El Amrani",    progress: 80, status: "En cours",      deadline: "2026-12-31", kpi: "Leads" },
  { id: 11, titre: "Rapport financier mensuel", description: "Livrer les rapports avant le 5 de chaque mois",               level: "employe",     cible: "Hassan Ouazzani",      progress: 100, status: "Terminé",      deadline: "2026-12-31", kpi: "Rapports" },
];

const radarData = [
  { subject: "Commercial", value: 85 },
  { subject: "Hajj & Omra", value: 92 },
  { subject: "Tourisme",   value: 78 },
  { subject: "Marketing",  value: 70 },
  { subject: "Finance",    value: 88 },
];

// ── Helpers ────────────────────────────────────────────────────────────────
const statusConfig: Record<ObjStatus, { color: string; icon: React.ReactNode; bg: string }> = {
  "En bonne voie": { color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200", icon: <TrendingUp className="w-3 h-3" /> },
  "En cours":      { color: "text-blue-600",    bg: "bg-blue-50 border-blue-200",       icon: <Clock className="w-3 h-3" /> },
  "En retard":     { color: "text-red-600",      bg: "bg-red-50 border-red-200",         icon: <AlertCircle className="w-3 h-3" /> },
  "Terminé":       { color: "text-slate-600",    bg: "bg-slate-50 border-slate-200",     icon: <CheckCircle2 className="w-3 h-3" /> },
};

const progressColor = (p: number) =>
  p >= 80 ? "#059669" : p >= 50 ? "#2563eb" : "#dc2626";

const levelConfig = {
  societe:     { label: "Société",     icon: <Building2 className="w-4 h-4" />, accent: "hsl(354,85%,42%)" },
  departement: { label: "Département", icon: <Users className="w-4 h-4" />,     accent: "hsl(220,70%,50%)" },
  employe:     { label: "Employé",     icon: <User className="w-4 h-4" />,      accent: "hsl(150,60%,38%)" },
};

function daysLeft(deadline: string): number {
  return Math.max(0, Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000));
}

function fmtDate(d: string): string {
  return new Date(d).toLocaleDateString("fr-MA", { day: "numeric", month: "short", year: "numeric" });
}

// ── StatusBadge ────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: ObjStatus }) {
  const cfg = statusConfig[status];
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color}`}>
      {cfg.icon} {status}
    </span>
  );
}

// ── Detail Modal ───────────────────────────────────────────────────────────
function DetailModal({ obj, onClose }: { obj: Objectif; onClose: () => void }) {
  const pc   = progressColor(obj.progress);
  const lc   = levelConfig[obj.level];
  const days = daysLeft(obj.deadline);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card rounded-2xl border shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 bg-card border-b px-6 py-4 flex items-start justify-between rounded-t-2xl z-10">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span style={{ color: lc.accent }}>{lc.icon}</span>
              <span className="text-xs text-muted-foreground font-medium">{lc.label}</span>
              {obj.cible && (
                <>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground">{obj.cible}</span>
                </>
              )}
            </div>
            <h2 className="font-bold text-lg leading-tight">{obj.titre}</h2>
          </div>
          <button
            onClick={onClose}
            className="ml-3 mt-0.5 text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">

          {/* Status + deadline row */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <StatusBadge status={obj.status} />
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              Échéance : {fmtDate(obj.deadline)}
            </div>
          </div>

          {/* Progress */}
          <div className="bg-muted/40 rounded-xl p-4 border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Avancement global</span>
              <span className="text-2xl font-bold tabular-nums" style={{ color: pc }}>
                {obj.progress}%
              </span>
            </div>
            <div className="h-3 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${obj.progress}%`, background: pc }}
              />
            </div>
          </div>

          {/* KPI Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: <Tag className="w-4 h-4" />,       label: "Indicateur",    value: obj.kpi || "—" },
              { icon: <Timer className="w-4 h-4" />,     label: "Jours restants", value: String(days) },
              { icon: <BarChart2 className="w-4 h-4" />, label: "Réalisé",        value: `${obj.progress}%` },
            ].map((s) => (
              <div key={s.label} className="bg-card rounded-xl border p-3 text-center">
                <div className="flex justify-center mb-1 text-muted-foreground">{s.icon}</div>
                <div className="text-lg font-bold tabular-nums">{s.value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">Description</p>
            <div className="bg-muted/30 rounded-xl border p-4 text-sm leading-relaxed text-foreground">
              {obj.description}
            </div>
          </div>

          {/* Tags */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">Étiquettes</p>
            <div className="flex flex-wrap gap-2">
              {[lc.label, obj.cible, obj.kpi].filter(Boolean).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 rounded-full border bg-muted/40 text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-card border-t px-6 py-4 rounded-b-2xl">
          <Button variant="outline" className="w-full" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── ObjectifCard ───────────────────────────────────────────────────────────
function ObjectifCard({ obj, onClick }: { obj: Objectif; onClick: () => void }) {
  const pc = progressColor(obj.progress);
  const lc = levelConfig[obj.level];
  return (
    <div
      className="bg-card rounded-xl border shadow-sm p-4 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span style={{ color: lc.accent }} className="opacity-80">{lc.icon}</span>
            {obj.cible && (
              <span className="text-xs text-muted-foreground truncate">{obj.cible}</span>
            )}
          </div>
          <h4 className="font-semibold text-sm leading-tight">{obj.titre}</h4>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{obj.description}</p>
        </div>
        <span className="text-lg font-bold ml-3 tabular-nums" style={{ color: pc }}>
          {obj.progress}%
        </span>
      </div>
      <div className="mb-3">
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${obj.progress}%`, background: pc }}
          />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <StatusBadge status={obj.status} />
        <span className="text-xs text-muted-foreground">{fmtDate(obj.deadline)}</span>
      </div>
    </div>
  );
}

// ── Create Modal ───────────────────────────────────────────────────────────
interface CreateModalProps { onClose: () => void; onCreate: (obj: Objectif) => void; }

function CreateModal({ onClose, onCreate }: CreateModalProps) {
  const [level, setLevel] = useState<ObjLevel>("societe");
  const [form, setForm] = useState({
    titre: "", description: "", cible: "",
    progress: 0, status: "En cours" as ObjStatus,
    deadline: "", kpi: "",
  });

  const handleSubmit = () => {
    if (!form.titre || !form.deadline) return;
    onCreate({
      id: Date.now(),
      titre: form.titre,
      description: form.description,
      level,
      cible: level !== "societe" ? form.cible : undefined,
      progress: Number(form.progress),
      status: form.status,
      deadline: form.deadline,
      kpi: form.kpi,
    });
    onClose();
  };

  const field = "w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40";
  const label = "block text-xs font-medium text-muted-foreground mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card rounded-2xl border shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-lg">Nouvel Objectif</h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Level selector */}
          <div>
            <p className={label}>Niveau de l'objectif</p>
            <div className="grid grid-cols-3 gap-2">
              {(["societe", "departement", "employe"] as ObjLevel[]).map((l) => {
                const cfg = levelConfig[l];
                const active = level === l;
                return (
                  <button
                    key={l}
                    onClick={() => setLevel(l)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-sm font-medium ${
                      active
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border text-muted-foreground hover:border-muted-foreground"
                    }`}
                  >
                    {cfg.icon}
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>

          {level === "departement" && (
            <div>
              <label className={label}>Département</label>
              <select className={field} value={form.cible} onChange={e => setForm({ ...form, cible: e.target.value })}>
                <option value="">Sélectionner un département</option>
                {DEPARTEMENTS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
          )}
          {level === "employe" && (
            <div>
              <label className={label}>Employé</label>
              <select className={field} value={form.cible} onChange={e => setForm({ ...form, cible: e.target.value })}>
                <option value="">Sélectionner un employé</option>
                {EMPLOYES.map(e => <option key={e}>{e}</option>)}
              </select>
            </div>
          )}

          <div>
            <label className={label}>Titre de l'objectif *</label>
            <input
              className={field} placeholder="Ex: Atteindre 500 pèlerins Hajj"
              value={form.titre} onChange={e => setForm({ ...form, titre: e.target.value })}
            />
          </div>

          <div>
            <label className={label}>Description</label>
            <textarea
              className={`${field} resize-none`} rows={2}
              placeholder="Détails, contexte..."
              value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={label}>Indicateur (KPI)</label>
              <input className={field} placeholder="Ex: MAD, %, Dossiers"
                value={form.kpi} onChange={e => setForm({ ...form, kpi: e.target.value })} />
            </div>
            <div>
              <label className={label}>Date limite *</label>
              <input type="date" className={field}
                value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={label}>Avancement initial: {form.progress}%</label>
              <input type="range" min={0} max={100} className="w-full accent-primary"
                value={form.progress} onChange={e => setForm({ ...form, progress: Number(e.target.value) })} />
            </div>
            <div>
              <label className={label}>Statut</label>
              <select className={field} value={form.status} onChange={e => setForm({ ...form, status: e.target.value as ObjStatus })}>
                {(["En cours", "En bonne voie", "En retard", "Terminé"] as ObjStatus[]).map(s => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Preview bar */}
          <div className="rounded-xl bg-muted/50 p-4 border">
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span className="font-medium truncate">{form.titre || "Titre de l'objectif..."}</span>
              <span>{form.progress}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${form.progress}%`, background: progressColor(form.progress) }}
              />
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-card border-t px-6 py-4 flex gap-3 rounded-b-2xl">
          <Button variant="outline" className="flex-1" onClick={onClose}>Annuler</Button>
          <Button className="flex-1" onClick={handleSubmit} disabled={!form.titre || !form.deadline}>
            <Plus className="w-4 h-4 mr-1" /> Créer l'objectif
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function Objectifs() {
  const { isAdmin, isManager, user } = useAuth();
  const isEmployee = !isAdmin && !isManager;

  const [objectifs, setObjectifs] = useState<Objectif[]>(initialObjectifs);
  const [activeTab, setActiveTab]     = useState<ObjLevel | "all">("all");
  const [showCreate, setShowCreate]   = useState(false);
  const [selected, setSelected]       = useState<Objectif | null>(null);

  const visibleObjectifs = isEmployee
    ? objectifs.filter((o) => o.level === "employe" && o.cible === user?.name)
    : objectifs;

  const filtered = activeTab === "all"
    ? visibleObjectifs
    : visibleObjectifs.filter((o) => o.level === activeTab);

  const byLevel = (l: ObjLevel) => visibleObjectifs.filter((o) => o.level === l);

  const addObjectif = (obj: Objectif) => setObjectifs(prev => [obj, ...prev]);

  const avgProgress = (list: Objectif[]) =>
    list.length ? Math.round(list.reduce((s, o) => s + o.progress, 0) / list.length) : 0;

  const tabs: { key: ObjLevel | "all"; label: string }[] = [
    { key: "all",         label: "Tous" },
    { key: "societe",     label: "Société" },
    { key: "departement", label: "Départements" },
    { key: "employe",     label: "Employés" },
  ];

  const deptData = DEPARTEMENTS.map(d => ({
    name: d.split(" ")[0],
    progress: avgProgress(objectifs.filter(o => o.level === "departement" && o.cible === d)),
  })).filter(d => d.progress > 0);

  return (
    <div className="space-y-6 fade-in">

   
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Target className="w-6 h-6 text-primary" />
            {isEmployee ? "Mes Objectifs" : "Objectifs & Performance"}
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {visibleObjectifs.length} objectif{visibleObjectifs.length !== 1 ? "s" : ""} · {visibleObjectifs.filter(o => o.status === "Terminé").length} terminé{visibleObjectifs.filter(o => o.status === "Terminé").length !== 1 ? "s" : ""}
          </p>
        </div>
        {!isEmployee && (
          <Button onClick={() => setShowCreate(true)} className="gap-2">
            <Plus className="w-4 h-4" /> Créer un objectif
          </Button>
        )}
      </div>

      {/* KPI Cards */}
      {!isEmployee && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Société",      count: byLevel("societe").length,     avg: avgProgress(byLevel("societe")),     icon: <Building2 className="w-5 h-5" />, color: "text-red-600",     bg: "bg-red-50" },
            { label: "Départements", count: byLevel("departement").length, avg: avgProgress(byLevel("departement")), icon: <Users className="w-5 h-5" />,     color: "text-blue-600",    bg: "bg-blue-50" },
            { label: "Employés",     count: byLevel("employe").length,     avg: avgProgress(byLevel("employe")),     icon: <User className="w-5 h-5" />,      color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "En retard",    count: visibleObjectifs.filter(o => o.status === "En retard").length, avg: 0, icon: <AlertCircle className="w-5 h-5" />, color: "text-orange-600", bg: "bg-orange-50" },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-card rounded-xl border shadow-sm p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={`${kpi.bg} ${kpi.color} p-1.5 rounded-lg`}>{kpi.icon}</div>
                <span className="text-sm text-muted-foreground">{kpi.label}</span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold">{kpi.count}</span>
                {kpi.avg > 0 && <span className="text-sm text-muted-foreground mb-0.5">moy. {kpi.avg}%</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Charts */}
      {!isEmployee && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-xl border shadow-sm p-5">
            <h3 className="font-semibold mb-4">Performance Départements</h3>
            <ResponsiveContainer width="100%" height={240}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(220,14%,90%)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                <Radar dataKey="value" stroke="hsl(354,85%,42%)" fill="hsl(354,85%,42%)" fillOpacity={0.2} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-card rounded-xl border shadow-sm p-5">
            <h3 className="font-semibold mb-4">Avancement Objectifs Dép.</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={deptData} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,14%,93%)" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => [`${v}%`, "Avancement"]} />
                <Bar dataKey="progress" radius={[6, 6, 0, 0]}>
                  {deptData.map((entry, i) => (
                    <Cell key={i} fill={progressColor(entry.progress)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Tabs */}
      {!isEmployee && (
        <div className="flex gap-1 bg-muted rounded-xl p-1 w-fit">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === t.key
                  ? "bg-background shadow text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
              <span className="ml-1.5 text-xs opacity-60">
                {t.key === "all" ? visibleObjectifs.length : byLevel(t.key as ObjLevel).length}
              </span>
            </button>
          ))}
        </div>
      )}


      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Target className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">
            {isEmployee ? "Aucun objectif ne vous a été assigné" : "Aucun objectif dans cette catégorie"}
          </p>
          {!isEmployee && (
            <Button variant="outline" className="mt-3" onClick={() => setShowCreate(true)}>
              <Plus className="w-4 h-4 mr-1" /> Créer le premier
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(obj => (
            <ObjectifCard key={obj.id} obj={obj} onClick={() => setSelected(obj)} />
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <DetailModal obj={selected} onClose={() => setSelected(null)} />
      )}

      {/* Create Modal */}
      {showCreate && !isEmployee && (
        <CreateModal onClose={() => setShowCreate(false)} onCreate={addObjectif} />
      )}
    </div>
  );
}