// ════════════════════════════════════════════════════════════════════════
// Clients.tsx  —  Liste des clients (with NewClientModal wired in)
// ════════════════════════════════════════════════════════════════════════
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, ChevronRight, FolderOpen,
  Users, TrendingUp, Plus,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import NewClientModal from "./Newclientmodal";

// ── Types ──────────────────────────────────────────────────────────────
export interface Client {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  ville: string;
  dateCreation: string;
  statut: "actif" | "en_cours" | "promis" | "inactif";
  departement: "mice" | "leisure" | "hajj_omra" | "outbound";
  nbDossiers: number;
  totalCA: number;
  dernierDossier?: string;
}

// ── Mock data ──────────────────────────────────────────────────────────
const INITIAL_CLIENTS: Client[] = [
  { id: "CL001", nom: "Sentissi",  prenom: "Rim",     telephone: "+212 6 44 55 66 77", email: "r.sentissi@gmail.com",  ville: "Casablanca", dateCreation: "2025-09-10", statut: "actif",    departement: "outbound",  nbDossiers: 3, totalCA: 45200,  dernierDossier: "DOS012" },
  { id: "CL002", nom: "Benali",    prenom: "Karim",   telephone: "+212 6 12 34 56 78", email: "k.benali@gmail.com",    ville: "Rabat",      dateCreation: "2025-11-02", statut: "en_cours", departement: "hajj_omra", nbDossiers: 1, totalCA: 8500,   dernierDossier: "DOS018" },
  { id: "CL003", nom: "Chraibi",   prenom: "Nadia",   telephone: "+212 6 11 22 33 44", email: "n.chraibi@gmail.com",   ville: "Marrakech",  dateCreation: "2025-07-15", statut: "actif",    departement: "mice",      nbDossiers: 5, totalCA: 128000, dernierDossier: "DOS021" },
  { id: "CL004", nom: "El Fassi",  prenom: "Samira",  telephone: "+212 6 98 76 54 32", email: "s.elfassi@gmail.com",   ville: "Fès",         dateCreation: "2026-01-08", statut: "promis",   departement: "hajj_omra", nbDossiers: 0, totalCA: 0,      dernierDossier: undefined },
  { id: "CL005", nom: "Lahlou",    prenom: "Youssef", telephone: "+212 6 22 11 00 99", email: "y.lahlou@gmail.com",    ville: "Casablanca", dateCreation: "2025-03-20", statut: "inactif",  departement: "leisure",   nbDossiers: 2, totalCA: 18700,  dernierDossier: "DOS008" },
  { id: "CL006", nom: "Ouali",     prenom: "Hassan",  telephone: "+212 6 77 88 99 00", email: "h.ouali@hotmail.com",   ville: "Agadir",     dateCreation: "2025-12-01", statut: "actif",    departement: "outbound",  nbDossiers: 2, totalCA: 32400,  dernierDossier: "DOS019" },
  { id: "CL007", nom: "Tazi",      prenom: "Omar",    telephone: "+212 6 55 44 33 22", email: "o.tazi@outlook.com",    ville: "Casablanca", dateCreation: "2026-02-14", statut: "en_cours", departement: "leisure",   nbDossiers: 1, totalCA: 12000,  dernierDossier: "DOS022" },
];

// ── Config ─────────────────────────────────────────────────────────────
const STATUT_CONFIG = {
  actif:     { label: "Actif",    dot: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-700 ring-emerald-200"  },
  en_cours:  { label: "En cours", dot: "bg-amber-400",   badge: "bg-amber-50 text-amber-700 ring-amber-200"        },
  promis:    { label: "Promis",   dot: "bg-blue-400",    badge: "bg-blue-50 text-blue-700 ring-blue-200"           },
  inactif:   { label: "Inactif",  dot: "bg-stone-400",   badge: "bg-stone-100 text-stone-500 ring-stone-200"       },
} as const;

const STAT_CARDS = [
  { key: "actif",    label: "Actifs",   icon: "bg-emerald-100 text-emerald-600" },
  { key: "en_cours", label: "En cours", icon: "bg-amber-100 text-amber-600"     },
  { key: "promis",   label: "Promis",   icon: "bg-blue-100 text-blue-600"       },
  { key: "inactif",  label: "Inactifs", icon: "bg-stone-100 text-stone-500"     },
] as const;

const DEPT_LABELS: Record<Client["departement"], string> = {
  mice: "MICE", leisure: "Leisure", hajj_omra: "Hajj & Omra", outbound: "Outbound",
};

const AVATAR_COLORS = [
  "bg-rose-100 text-rose-700",    "bg-orange-100 text-orange-700",
  "bg-amber-100 text-amber-700",  "bg-teal-100 text-teal-700",
  "bg-sky-100 text-sky-700",      "bg-violet-100 text-violet-700",
  "bg-pink-100 text-pink-700",
];
const avatarColor = (id: string) =>
  AVATAR_COLORS[parseInt(id.replace(/\D/g, ""), 10) % AVATAR_COLORS.length];

// ════════════════════════════════════════════════════════════════════════
export default function Clients() {
  const navigate = useNavigate();
  const [clients,      setClients]      = useState<Client[]>(INITIAL_CLIENTS);
  const [modalOpen,    setModalOpen]    = useState(false);
  const [search,       setSearch]       = useState("");
  const [filterDept,   setFilterDept]   = useState("tous");
  const [filterStatut, setFilterStatut] = useState("tous");

  const filtered = clients.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      `${c.nom} ${c.prenom} ${c.telephone} ${c.email} ${c.ville}`.toLowerCase().includes(q);
    return matchSearch
      && (filterDept   === "tous" || c.departement === filterDept)
      && (filterStatut === "tous" || c.statut      === filterStatut);
  });

  const totalCA = clients.reduce((a, c) => a + c.totalCA, 0);

  const handleCreate = (
    newClient: Omit<Client, "id" | "nbDossiers" | "totalCA" | "dernierDossier">
  ) => {
    const id = `CL${String(clients.length + 1).padStart(3, "0")}`;
    setClients(prev => [{ ...newClient, id, nbDossiers: 0, totalCA: 0, dernierDossier: undefined }, ...prev]);
    setModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 py-6 space-y-6 max-w-7xl mx-auto">

        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Clients</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {clients.length} clients enregistrés ·{" "}
              <span className="font-medium text-foreground">${totalCA.toLocaleString()}</span> CA total
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98] transition-all shadow-sm"
          >
            <Plus size={15} />
            Nouveau client
          </button>
        </div>

        {/* ── KPI strip ──────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {STAT_CARDS.map(({ key, label, icon }) => {
            const count = clients.filter(c => c.statut === key).length;
            const cfg   = STATUT_CONFIG[key as keyof typeof STATUT_CONFIG];
            return (
              <div key={key} className="relative overflow-hidden rounded-xl border border-border/50 bg-card px-4 py-4">
                <div className={cn("inline-flex items-center justify-center w-7 h-7 rounded-lg mb-3", icon)}>
                  <Users size={14} />
                </div>
                <p className="text-2xl font-semibold text-foreground">{count}</p>
                <p className="text-xs text-muted-foreground mt-0.5 font-medium">{label}</p>
                <span className={cn("absolute top-3 right-3 w-2 h-2 rounded-full", cfg.dot)} />
              </div>
            );
          })}
        </div>

        {/* ── CA highlight ────────────────────────────────────────── */}
        <div className="rounded-xl bg-primary/5 border border-primary/10 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <TrendingUp size={16} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Chiffre d'affaires cumulé</p>
              <p className="text-lg font-semibold text-foreground">${totalCA.toLocaleString()}</p>
            </div>
          </div>
          {clients.filter(c => c.totalCA > 0).length > 0 && (
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Moy. par client</p>
              <p className="text-sm font-semibold text-foreground">
                ${Math.round(totalCA / clients.filter(c => c.totalCA > 0).length).toLocaleString()}
              </p>
            </div>
          )}
        </div>

        {/* ── Filters ─────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-52">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Rechercher un client…"
              className="pl-9 h-9 bg-card border-border/60 focus-visible:ring-primary/30"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <Select value={filterDept} onValueChange={setFilterDept}>
            <SelectTrigger className="w-44 h-9 border-border/60 bg-card">
              <SelectValue placeholder="Département" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tous">Tous départements</SelectItem>
              {Object.entries(DEPT_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterStatut} onValueChange={setFilterStatut}>
            <SelectTrigger className="w-36 h-9 border-border/60 bg-card">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tous">Tous statuts</SelectItem>
              {Object.entries(STATUT_CONFIG).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
            </SelectContent>
          </Select>
          {(filterDept !== "tous" || filterStatut !== "tous" || search) && (
            <button
              onClick={() => { setSearch(""); setFilterDept("tous"); setFilterStatut("tous"); }}
              className="text-xs text-primary hover:underline underline-offset-2 font-medium"
            >
              Réinitialiser
            </button>
          )}
        </div>

        {/* ── Table ───────────────────────────────────────────────── */}
        <div className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-sm">
          <table className="w-full" style={{ tableLayout: "fixed" }}>
            <thead>
              <tr className="border-b border-border/40 bg-muted/30">
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground w-52">Client</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground w-44">Contact</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground w-32">Département</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground w-28">Statut</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground w-24">Dossiers</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground w-28">CA Total</th>
                <th className="w-8" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const cfg = STATUT_CONFIG[c.statut];
                const av  = avatarColor(c.id);
                return (
                  <tr
                    key={c.id}
                    onClick={() => navigate(`/clients/${c.id}`)}
                    className="border-b border-border/30 last:border-0 hover:bg-primary/[0.03] cursor-pointer transition-colors duration-100 group"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0", av)}>
                          {c.prenom[0]}{c.nom[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate leading-tight">{c.prenom} {c.nom}</p>
                          <p className="text-xs text-muted-foreground">{c.ville}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-xs text-foreground truncate leading-tight">{c.telephone}</p>
                      <p className="text-xs text-muted-foreground truncate">{c.email}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground">
                        {DEPT_LABELS[c.departement]}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full ring-1 ring-inset", cfg.badge)}>
                        <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", cfg.dot)} />
                        {cfg.label}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <FolderOpen size={13} className="text-muted-foreground shrink-0" />
                        <span className="text-sm text-foreground">{c.nbDossiers}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={cn("text-sm font-semibold", c.totalCA > 0 ? "text-foreground" : "text-muted-foreground")}>
                        {c.totalCA > 0 ? `$${c.totalCA.toLocaleString()}` : "—"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <ChevronRight size={14} className="text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-150" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                <Search size={20} className="text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">Aucun client trouvé</p>
              <p className="text-xs text-muted-foreground mt-1">Modifiez vos filtres ou créez un nouveau client</p>
            </div>
          )}
        </div>

        {filtered.length > 0 && (
          <p className="text-xs text-muted-foreground text-right pb-2">
            {filtered.length} client{filtered.length > 1 ? "s" : ""} affiché{filtered.length > 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* ── Modal ─────────────────────────────────────────────────── */}
      <NewClientModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreate}
      />
    </div>
  );
}