import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus, Search, FolderOpen, Calendar, Users, TrendingUp,
  LayoutList, LayoutGrid, ChevronUp, ChevronDown, ChevronsUpDown,
  CheckSquare, Square, X, ChevronRight, ChevronLeft,
  Download, Filter, UserCheck, Building2, Banknote,
  MapPin, Hash, User, Briefcase, Check, Loader2,
  AlertCircle, RefreshCw, GripVertical, Lock
} from "lucide-react";
import { mockDossiers, DEPARTEMENTS_LABELS } from "@/data/crmData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

// ─── Types ────────────────────────────────────────────────────────────────────
type Statut = "en_cours" | "confirme" | "annule" | "termine";
type SortField = "reference" | "clientNom" | "totalContrat" | "dateVoyage" | "statut";
type SortDir = "asc" | "desc";
type ViewMode = "list" | "kanban";

interface Dossier {
  id: string;
  reference: string;
  clientNom: string;
  destination: string;
  departement: string;
  statut: Statut;
  nombrePax: number;
  dateVoyage?: string;
  totalContrat: number;
  totalPaye: number;
  presentations: unknown[];
  paiements: unknown[];
  assigneA?: string;
  notes?: string;
}

// ─── Extra dossiers assignés à Youssef (employé démo) ────────────────────────
// Ces dossiers s'ajoutent à mockDossiers pour que l'employé démo ait des données
const YOUSSEF_DOSSIERS: Dossier[] = [
  {
    id: "YE-001",
    reference: "DOS-2026-0042",
    clientNom: "Ahmed Benali",
    destination: "Médine & La Mecque",
    departement: "hajj_omra",
    statut: "en_cours",
    nombrePax: 4,
    dateVoyage: "2026-06-15",
    totalContrat: 28000,
    totalPaye: 8000,
    presentations: [
      { version: 1, dateCreation: "2026-03-10", totalHT: 26000, valideParClient: false, notes: "Première proposition", commentaireClient: "Peut-on réviser le prix du vol ?" },
    ],
    paiements: [
      { id: "P1", montant: 8000, mode: "virement", reference: "VIR-2026-001", note: "1er acompte", date: "2026-03-12", valide: true },
    ],
    assigneA: "Youssef",
    notes: "Client régulier — traiter en priorité",
  },
  {
    id: "YE-002",
    reference: "DOS-2026-0051",
    clientNom: "Fatima Zahra Idrissi",
    destination: "Istanbul, Turquie",
    departement: "leisure",
    statut: "confirme",
    nombrePax: 2,
    dateVoyage: "2026-05-20",
    totalContrat: 9500,
    totalPaye: 9500,
    presentations: [
      { version: 1, dateCreation: "2026-02-20", totalHT: 9500, valideParClient: true, notes: "Voyage de noces" },
    ],
    paiements: [
      { id: "P2", montant: 9500, mode: "carte", note: "Paiement intégral", date: "2026-02-22", valide: true },
    ],
    assigneA: "Youssef",
    notes: "Voyage de noces — attention particulière",
  },
  {
    id: "YE-003",
    reference: "DOS-2026-0058",
    clientNom: "Omar Tazi",
    destination: "Dubai, Émirats",
    departement: "outbound",
    statut: "en_cours",
    nombrePax: 6,
    dateVoyage: "2026-07-01",
    totalContrat: 42000,
    totalPaye: 15000,
    presentations: [],
    paiements: [
      { id: "P3", montant: 15000, mode: "virement", note: "Acompte initial", date: "2026-03-20", valide: true },
    ],
    assigneA: "Youssef",
    notes: "Groupe famille élargie",
  },
  {
    id: "YE-004",
    reference: "DOS-2026-0063",
    clientNom: "Sara Mohammedi",
    destination: "Médine — Omra Ramadan",
    departement: "hajj_omra",
    statut: "en_cours",
    nombrePax: 3,
    dateVoyage: "2026-04-20",
    totalContrat: 18500,
    totalPaye: 5000,
    presentations: [
      { version: 1, dateCreation: "2026-03-25", totalHT: 18000, valideParClient: false, notes: "Devis initial Omra" },
    ],
    paiements: [
      { id: "P4", montant: 5000, mode: "cheque", note: "Acompte réservation", date: "2026-03-26", valide: true },
    ],
    assigneA: "Youssef",
    notes: "Départ urgent — prioriser les visas",
  },
  {
    id: "YE-005",
    reference: "DOS-2026-0071",
    clientNom: "Karim El Fassi",
    destination: "Marrakech MICE",
    departement: "mice",
    statut: "en_cours",
    nombrePax: 45,
    dateVoyage: "2026-05-10",
    totalContrat: 185000,
    totalPaye: 60000,
    presentations: [
      { version: 1, dateCreation: "2026-03-01", totalHT: 180000, valideParClient: false, notes: "Gala dinner + activités" },
      { version: 2, dateCreation: "2026-03-15", totalHT: 185000, valideParClient: false, notes: "Version révisée avec Agafay" },
    ],
    paiements: [
      { id: "P5", montant: 60000, mode: "virement", reference: "VIR-2026-089", note: "1er acompte corporate", date: "2026-03-18", valide: true },
    ],
    assigneA: "Youssef",
    notes: "Événement corporate — client VIP",
  },
];

// ─── Merge: mockDossiers + YOUSSEF_DOSSIERS ──────────────────────────────────
// On fusionne les deux sources pour que la liste complète soit disponible
const ALL_DOSSIERS: Dossier[] = [
  ...(mockDossiers as Dossier[]),
  ...YOUSSEF_DOSSIERS,
];

// ─── Statut config ────────────────────────────────────────────────────────────
const STATUT_CFG: Record<Statut, {
  label: string; dot: string;
  badgeBg: string; badgeText: string;
  colBg: string; headerBg: string; headerText: string;
  countBg: string; countText: string;
}> = {
  en_cours: {
    label: "En cours",   dot: "#378ADD",
    badgeBg: "bg-blue-100",    badgeText: "text-blue-800",
    colBg: "bg-blue-50/40",    headerBg: "bg-blue-50 border-blue-100",
    headerText: "text-blue-800", countBg: "bg-blue-100", countText: "text-blue-700",
  },
  confirme: {
    label: "Confirmé",   dot: "#1D9E75",
    badgeBg: "bg-emerald-100", badgeText: "text-emerald-800",
    colBg: "bg-emerald-50/40", headerBg: "bg-emerald-50 border-emerald-100",
    headerText: "text-emerald-800", countBg: "bg-emerald-100", countText: "text-emerald-700",
  },
  annule: {
    label: "Annulé",     dot: "#E24B4A",
    badgeBg: "bg-red-100",     badgeText: "text-red-700",
    colBg: "bg-red-50/40",     headerBg: "bg-red-50 border-red-100",
    headerText: "text-red-800", countBg: "bg-red-100", countText: "bg-red-700",
  },
  termine: {
    label: "Terminé",    dot: "#888780",
    badgeBg: "bg-gray-100",    badgeText: "text-gray-600",
    colBg: "bg-gray-50/40",    headerBg: "bg-gray-50 border-gray-200",
    headerText: "text-gray-700", countBg: "bg-gray-200", countText: "text-gray-600",
  },
};

const EMPLOYES = ["Feras", "Adam", "Sara", "Youssef", "Nadia", "Hassan"];

const MOCK_CLIENTS = [
  { id: "CL001", nom: "Benali Karim",    telephone: "+212 6 12 34 56 78" },
  { id: "CL002", nom: "El Fassi Samira", telephone: "+212 6 98 76 54 32" },
  { id: "CL003", nom: "Tazi Omar",       telephone: "+212 6 55 44 33 22" },
  { id: "CL004", nom: "Chraibi Nadia",   telephone: "+212 6 11 22 33 44" },
  { id: "CL005", nom: "Sentissi Rim",    telephone: "+212 6 44 55 66 77" },
  { id: "CL006", nom: "Berrada Amine",   telephone: "+212 6 66 77 88 99" },
];

const DEPT_KEY_MAP: Record<string, string> = {
  "MICE":        "mice",
  "Leisure":     "leisure",
  "Outbound":    "outbound",
  "Hajj & Omra": "hajj_omra",
  "Hajj":        "hajj_omra",
  "Omra":        "hajj_omra",
};

function genRef() {
  return `DOS-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100).padStart(4, "0")}`;
}

// ─── Access scope banner ──────────────────────────────────────────────────────
function ScopeBanner({ role, dept, count }: { role: string; dept?: string; count: number }) {
  const config = {
    admin:    { bg: "bg-primary/5",   border: "border-primary/20",   icon: <Building2 size={13} className="text-primary" />,     text: "text-primary",   label: `Accès complet — tous les dossiers (${count})` },
    manager:  { bg: "bg-amber-50",    border: "border-amber-200",    icon: <Lock size={13} className="text-amber-700" />,         text: "text-amber-700", label: `Département ${dept} uniquement — ${count} dossier${count > 1 ? "s" : ""}` },
    employee: { bg: "bg-blue-50",     border: "border-blue-200",     icon: <UserCheck size={13} className="text-blue-700" />,     text: "text-blue-700", label: `Vos dossiers assignés uniquement — ${count} dossier${count > 1 ? "s" : ""}` },
  }[role] ?? { bg: "", border: "", icon: null, text: "", label: "" };

  return (
    <div className={cn("flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium", config.bg, config.border)}>
      {config.icon}
      <span className={config.text}>{config.label}</span>
    </div>
  );
}

// ─── New Dossier Modal (multi-step) ───────────────────────────────────────────
const STEPS = ["Client", "Voyage", "Équipe", "Aperçu"];

function NewDossierModal({ open, onClose, onAdd, defaultDept }: {
  open: boolean; onClose: () => void; onAdd: (d: Dossier) => void; defaultDept?: string;
}) {
  const [step, setStep] = useState(0);
  const [clientSearch, setClientSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState<typeof MOCK_CLIENTS[0] | null>(null);
  const [saving, setSaving] = useState(false);
  const [ref] = useState(genRef());

  const [form, setForm] = useState({
    destination: "",
    departement: defaultDept || "mice",
    dateVoyage: "",
    nombrePax: "2",
    totalContrat: "",
    assigneA: "Feras",
    notes: "",
  });
  const f = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const filteredClients = MOCK_CLIENTS.filter(c =>
    !clientSearch || c.nom.toLowerCase().includes(clientSearch.toLowerCase()) || c.telephone.includes(clientSearch)
  );

  const canNext = () => {
    if (step === 0) return !!selectedClient;
    if (step === 1) return !!(form.destination && form.totalContrat);
    return true;
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 700));
    onAdd({
      id: `D${Date.now()}`, reference: ref,
      clientNom: selectedClient!.nom, destination: form.destination,
      departement: form.departement, statut: "en_cours",
      nombrePax: parseInt(form.nombrePax) || 1,
      dateVoyage: form.dateVoyage || undefined,
      totalContrat: parseFloat(form.totalContrat) || 0,
      totalPaye: 0, presentations: [], paiements: [],
      assigneA: form.assigneA, notes: form.notes,
    });
    setSaving(false);
    toast.success(`Dossier ${ref} créé`);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-0 overflow-hidden gap-0">
        <div className="px-6 pt-5 pb-4 border-b border-border/50 bg-card">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-0.5">Étape {step + 1} / {STEPS.length}</p>
              <h2 className="text-base font-bold text-foreground">{STEPS[step]}</h2>
            </div>
            <div className="flex items-center gap-2 bg-muted px-2.5 py-1.5 rounded-lg">
              <Hash size={11} className="text-muted-foreground" />
              <span className="text-xs font-mono font-semibold">{ref}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2 flex-1 last:flex-none">
                <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 transition-all",
                  i < step ? "bg-primary text-primary-foreground" : i === step ? "bg-primary text-primary-foreground ring-2 ring-primary/20" : "bg-muted text-muted-foreground"
                )}>
                  {i < step ? <Check size={10} /> : i + 1}
                </div>
                <span className={cn("text-[11px] font-medium hidden sm:block", i === step ? "text-foreground" : "text-muted-foreground")}>{s}</span>
                {i < STEPS.length - 1 && (
                  <div className="flex-1 h-px bg-border mx-1 hidden sm:block">
                    <div className="h-full bg-primary transition-all" style={{ width: i < step ? "100%" : "0%" }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 min-h-64">
          {step === 0 && (
            <div className="space-y-3">
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Chercher client..." className="pl-9 h-9 text-sm" value={clientSearch} onChange={e => setClientSearch(e.target.value)} />
              </div>
              <div className="space-y-1.5 max-h-56 overflow-y-auto">
                {filteredClients.map(c => (
                  <div key={c.id} onClick={() => { setSelectedClient(c); setClientSearch(c.nom); }}
                    className={cn("flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all",
                      selectedClient?.id === c.id ? "border-primary bg-primary/5" : "border-border/50 hover:border-border hover:bg-muted/50"
                    )}
                  >
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[11px] font-bold flex-shrink-0">
                      {c.nom.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{c.nom}</p>
                      <p className="text-xs text-muted-foreground font-mono">{c.telephone}</p>
                    </div>
                    {selectedClient?.id === c.id && <Check size={14} className="text-primary flex-shrink-0" />}
                  </div>
                ))}
              </div>
              {selectedClient && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/5 border border-primary/20">
                  <UserCheck size={13} className="text-primary" />
                  <span className="text-xs font-medium text-primary">Sélectionné : {selectedClient.nom}</span>
                </div>
              )}
            </div>
          )}

          {step === 1 && (
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Destination *</Label>
                <Input value={form.destination} onChange={e => f("destination", e.target.value)} placeholder="ex: Marrakech, Dubai..." className="h-9" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Département</Label>
                <Select value={form.departement} onValueChange={v => f("departement", v)} disabled={!!defaultDept}>
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(DEPARTEMENTS_LABELS).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v as string}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Date voyage</Label>
                <Input type="date" value={form.dateVoyage} onChange={e => f("dateVoyage", e.target.value)} className="h-9 text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Nombre de pax</Label>
                <Input type="number" min="1" value={form.nombrePax} onChange={e => f("nombrePax", e.target.value)} className="h-9" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Montant contrat ($) *</Label>
                <Input type="number" min="0" value={form.totalContrat} onChange={e => f("totalContrat", e.target.value)} placeholder="0.00" className="h-9 font-mono" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Agent responsable</Label>
                <div className="grid grid-cols-3 gap-2">
                  {EMPLOYES.map(emp => (
                    <div key={emp} onClick={() => f("assigneA", emp)}
                      className={cn("flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all",
                        form.assigneA === emp ? "border-primary bg-primary/5" : "border-border/50 hover:border-border"
                      )}
                    >
                      <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold",
                        form.assigneA === emp ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      )}>{emp[0]}</div>
                      <span className="text-xs font-medium text-foreground">{emp}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Notes internes</Label>
                <Textarea value={form.notes} onChange={e => f("notes", e.target.value)} placeholder="Informations complémentaires..." rows={4} className="resize-none text-sm" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <div className="bg-muted/50 rounded-xl border border-border/50 p-4 space-y-2.5">
                {[
                  { icon: <Hash size={12} />, label: "Référence", value: ref },
                  { icon: <User size={12} />, label: "Client", value: selectedClient?.nom ?? "—" },
                  { icon: <MapPin size={12} />, label: "Destination", value: form.destination },
                  { icon: <Building2 size={12} />, label: "Département", value: DEPARTEMENTS_LABELS[form.departement] as string },
                  { icon: <Users size={12} />, label: "Pax", value: form.nombrePax },
                  { icon: <Calendar size={12} />, label: "Date voyage", value: form.dateVoyage || "—" },
                  { icon: <Banknote size={12} />, label: "Montant contrat", value: `${parseFloat(form.totalContrat || "0").toLocaleString()} $` },
                  { icon: <User size={12} />, label: "Assigné à", value: form.assigneA },
                ].map(row => (
                  <div key={row.label} className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="opacity-60">{row.icon}</span>{row.label}</span>
                    <span className="text-xs font-semibold text-foreground">{row.value}</span>
                  </div>
                ))}
              </div>
              {form.notes && (
                <div className="px-3 py-2 rounded-lg bg-amber-50 border border-amber-100">
                  <p className="text-xs text-amber-800 italic">{form.notes}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-border/50 bg-muted/30">
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" onClick={() => step === 0 ? onClose() : setStep(s => s - 1)}>
            <ChevronLeft size={13} />{step === 0 ? "Annuler" : "Précédent"}
          </Button>
          {step < STEPS.length - 1 ? (
            <Button size="sm" className="h-8 gap-1.5 text-xs" disabled={!canNext()} onClick={() => setStep(s => s + 1)}>
              Suivant <ChevronRight size={13} />
            </Button>
          ) : (
            <Button size="sm" className="h-8 gap-1.5 text-xs" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
              {saving ? "Création..." : "Créer le dossier"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, icon, accent }: { label: string; value: string | number; sub?: string; icon: React.ReactNode; accent?: string }) {
  return (
    <div className="bg-card border border-border/60 rounded-xl p-4 flex items-start gap-3">
      <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0", accent ?? "bg-primary/10 text-primary")}>{icon}</div>
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-0.5">{label}</p>
        <p className="text-xl font-bold text-foreground leading-none">{value}</p>
        {sub && <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Dossier Row ──────────────────────────────────────────────────────────────
function DossierRow({ d, selected, onToggle, highlight, canSelect }: {
  d: Dossier; selected: boolean; onToggle: () => void; highlight: string; canSelect: boolean;
}) {
  const navigate = useNavigate();
  const sc = STATUT_CFG[d.statut];
  const pct = d.totalContrat > 0 ? Math.round((d.totalPaye / d.totalContrat) * 100) : 0;

  function hl(text: string): React.ReactNode {
    if (!highlight) return text;
    const idx = text.toLowerCase().indexOf(highlight.toLowerCase());
    if (idx === -1) return text;
    return <>{text.slice(0, idx)}<mark className="bg-yellow-200 text-yellow-900 rounded px-0.5">{text.slice(idx, idx + highlight.length)}</mark>{text.slice(idx + highlight.length)}</>;
  }

  return (
    <div
      className={cn("group flex items-center bg-card border border-border/60 rounded-xl px-4 py-3.5 gap-3 transition-all cursor-pointer hover:border-border hover:shadow-sm",
        selected && "ring-1 ring-primary border-primary/40 bg-primary/5"
      )}
      onClick={() => navigate(`/dossiers/${d.id}`)}
    >
      {canSelect && (
        <div className="flex-shrink-0 text-muted-foreground hover:text-primary transition-colors" onClick={e => { e.stopPropagation(); onToggle(); }}>
          {selected ? <CheckSquare size={15} className="text-primary" /> : <Square size={15} className="opacity-0 group-hover:opacity-100" />}
        </div>
      )}
      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", sc.badgeBg)}>
        <FolderOpen size={14} className={sc.badgeText} />
      </div>
      <div className="w-32 flex-shrink-0">
        <p className="text-[12px] font-mono font-semibold text-foreground">{d.reference}</p>
        <p className="text-[11px] text-muted-foreground truncate">{hl(d.clientNom)}</p>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{hl(d.destination)}</p>
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
          <span className="flex items-center gap-1"><Users size={10} />{d.nombrePax} pax</span>
          {d.dateVoyage && <span className="flex items-center gap-1"><Calendar size={10} />{new Date(d.dateVoyage).toLocaleDateString("fr-FR")}</span>}
          {d.assigneA && <span className="flex items-center gap-1"><User size={10} />{d.assigneA}</span>}
        </div>
      </div>
      <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-muted text-muted-foreground flex-shrink-0 hidden md:block">
        {(DEPARTEMENTS_LABELS[d.departement] as string) ?? d.departement}
      </span>
      <span className={cn("text-[11px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0", sc.badgeBg, sc.badgeText)}>{sc.label}</span>
      <div className="w-28 flex-shrink-0 text-right">
        <p className="text-sm font-bold text-emerald-600">{d.totalContrat.toLocaleString()} $</p>
        <div className="flex items-center gap-1.5 mt-1 justify-end">
          <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
          <span className="text-[10px] text-muted-foreground">{pct}%</span>
        </div>
      </div>
    </div>
  );
}

// ─── Kanban Card ──────────────────────────────────────────────────────────────
function KanbanCard({ d, onDragStart }: { d: Dossier; onDragStart: (id: string) => void }) {
  const navigate = useNavigate();
  const sc = STATUT_CFG[d.statut];
  const pct = d.totalContrat > 0 ? Math.round((d.totalPaye / d.totalContrat) * 100) : 0;
  return (
    <div
      draggable
      onDragStart={() => onDragStart(d.id)}
      onClick={() => navigate(`/dossiers/${d.id}`)}
      className="bg-card border border-border/60 rounded-xl p-3 cursor-pointer hover:border-border hover:shadow-sm transition-all active:scale-[0.98]"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <p className="text-[11px] font-mono font-semibold text-muted-foreground">{d.reference}</p>
          <p className="text-[13px] font-semibold text-foreground leading-tight mt-0.5">{d.clientNom}</p>
        </div>
        <GripVertical size={13} className="text-muted-foreground/40 flex-shrink-0 mt-0.5" />
      </div>
      <div className="flex items-center gap-1.5 mb-2.5">
        <MapPin size={10} className="text-muted-foreground" />
        <span className="text-[11px] text-muted-foreground">{d.destination}</span>
      </div>
      <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-2">
        <span className="flex items-center gap-1"><Users size={10} />{d.nombrePax} pax</span>
        {d.assigneA && <span className="flex items-center gap-1"><User size={10} />{d.assigneA}</span>}
      </div>
      <div className="pt-2 border-t border-border/40">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[11px] font-bold text-emerald-600">{d.totalContrat.toLocaleString()} $</span>
          <span className="text-[10px] text-muted-foreground">{pct}%</span>
        </div>
        <div className="h-1 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}

// ─── Sort Header ──────────────────────────────────────────────────────────────
function SortTh({ field, current, dir, onSort, children }: { field: SortField; current: SortField; dir: SortDir; onSort: (f: SortField) => void; children: React.ReactNode }) {
  const active = current === field;
  return (
    <button className={cn("flex items-center gap-1 text-xs font-semibold uppercase tracking-wide transition-colors", active ? "text-foreground" : "text-muted-foreground hover:text-foreground")} onClick={() => onSort(field)}>
      {children}
      {active ? (dir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />) : <ChevronsUpDown size={11} className="opacity-40" />}
    </button>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Dossiers() {
  const { user, isAdmin, isManager, isEmployee } = useAuth();

  // ── Role-based scope ──────────────────────────────────────────────────────
  const scopedDossiers = useMemo(() => {
    if (isAdmin) return ALL_DOSSIERS;

    if (isManager && user?.departement) {
      const deptKey = DEPT_KEY_MAP[user.departement] ?? user.departement.toLowerCase();
      return ALL_DOSSIERS.filter(d => d.departement === deptKey);
    }

    if (isEmployee && user?.name) {
      // ── FIX: on cherche le prénom dans assigneA (insensible à la casse)
      // On extrait aussi le nom complet pour matcher les deux
      const fullName = user.name.toLowerCase();
      const prenom   = user.name.split(" ")[0].toLowerCase();
      return ALL_DOSSIERS.filter(d => {
        if (!d.assigneA) return false;
        const a = d.assigneA.toLowerCase();
        return a === prenom || a === fullName || fullName.includes(a) || a.includes(prenom);
      });
    }

    return ALL_DOSSIERS;
  }, [isAdmin, isManager, isEmployee, user]);

  const [dossiers, setDossiers] = useState<Dossier[]>(scopedDossiers);
  const [search, setSearch] = useState("");
  const [filtreStatut, setFiltreStatut] = useState("tous");
  const [filtreDept, setFiltreDept] = useState("tous");
  const [filtreAgent, setFiltreAgent] = useState("tous");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [sortField, setSortField] = useState<SortField>("reference");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [batchStatut, setBatchStatut] = useState<Statut | "">("");
  const [newOpen, setNewOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<Statut | null>(null);

  const filtered = useMemo(() => {
    let list = dossiers.filter(d => {
      const q = search.toLowerCase();
      const matchSearch = !q || `${d.reference} ${d.clientNom} ${d.destination}`.toLowerCase().includes(q);
      const matchStatut = filtreStatut === "tous" || d.statut === filtreStatut;
      const matchDept = filtreDept === "tous" || d.departement === filtreDept;
      const matchAgent = filtreAgent === "tous" || d.assigneA === filtreAgent;
      return matchSearch && matchStatut && matchDept && matchAgent;
    });
    return [...list].sort((a, b) => {
      let va: string | number = a[sortField] ?? "";
      let vb: string | number = b[sortField] ?? "";
      if (typeof va === "string") va = va.toLowerCase();
      if (typeof vb === "string") vb = vb.toLowerCase();
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [dossiers, search, filtreStatut, filtreDept, filtreAgent, sortField, sortDir]);

  const totalCA    = filtered.reduce((a, d) => a + d.totalContrat, 0);
  const totalPaye  = filtered.reduce((a, d) => a + d.totalPaye, 0);
  const encRate    = totalCA > 0 ? Math.round((totalPaye / totalCA) * 100) : 0;

  const handleSort = (f: SortField) => {
    if (sortField === f) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(f); setSortDir("asc"); }
  };

  const toggleSelect = (id: string) => setSelected(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleAll    = () => selected.size === filtered.length ? setSelected(new Set()) : setSelected(new Set(filtered.map(d => d.id)));

  const applyBatch = () => {
    if (!batchStatut) return;
    setDossiers(p => p.map(d => selected.has(d.id) ? { ...d, statut: batchStatut as Statut } : d));
    toast.success(`${selected.size} dossier(s) → ${STATUT_CFG[batchStatut as Statut].label}`);
    setSelected(new Set()); setBatchStatut("");
  };

  const handleKanbanDrop = (toStatut: Statut) => {
    if (!dragId) return;
    setDossiers(p => p.map(d => d.id === dragId ? { ...d, statut: toStatut } : d));
    toast.success(`Dossier → ${STATUT_CFG[toStatut].label}`);
    setDragId(null); setDragOver(null);
  };

  const addDossier = (d: Dossier) => setDossiers(p => [d, ...p]);
  const defaultDept = isManager ? (DEPT_KEY_MAP[user?.departement ?? ""] ?? undefined) : undefined;
  const roleKey = isAdmin ? "admin" : isManager ? "manager" : "employee";

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Top bar */}
      <div className="flex-shrink-0 border-b border-border bg-card px-6 py-4 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Briefcase size={17} className="text-primary" />
              <h1 className="text-xl font-bold text-foreground tracking-tight">
                {isEmployee ? "Mes Dossiers" : isManager ? `Dossiers — ${user?.departement}` : "Dossiers"}
              </h1>
            </div>
            <p className="text-sm text-muted-foreground">
              {filtered.length} dossier{filtered.length !== 1 ? "s" : ""} · CA {totalCA.toLocaleString()} $ · {encRate}% encaissé
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!isEmployee && (
              <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" onClick={() => toast.info("Export en cours...")}>
                <Download size={13} />Exporter
              </Button>
            )}
            {!isEmployee && (
              <Button size="sm" className="h-8 gap-1.5 text-xs font-semibold bg-primary hover:bg-primary/90" onClick={() => setNewOpen(true)}>
                <Plus size={13} />Nouveau dossier
              </Button>
            )}
          </div>
        </div>

        <ScopeBanner role={roleKey} dept={user?.departement} count={dossiers.length} />

        <div className="grid grid-cols-4 gap-3">
          <KpiCard label="Total dossiers" value={dossiers.length} sub={`${filtered.length} filtrés`} icon={<FolderOpen size={16} />} accent="bg-primary/10 text-primary" />
          <KpiCard label="En cours" value={dossiers.filter(d => d.statut === "en_cours").length} sub={`${dossiers.filter(d => d.statut === "confirme").length} confirmés`} icon={<TrendingUp size={16} />} accent="bg-blue-100 text-blue-700" />
          <KpiCard label="CA total" value={`${totalCA.toLocaleString()} $`} sub={`${totalPaye.toLocaleString()} $ encaissé`} icon={<Banknote size={16} />} accent="bg-emerald-100 text-emerald-700" />
          <KpiCard label="Taux encaissement" value={`${encRate}%`} sub={encRate >= 70 ? "Bon rythme" : "À surveiller"} icon={<TrendingUp size={16} />} accent={encRate >= 70 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"} />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-40 max-w-64">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Rechercher..." className="pl-8 h-8 text-sm" value={search} onChange={e => setSearch(e.target.value)} />
            {search && <button className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setSearch("")}><X size={12} /></button>}
          </div>
          <div className="flex items-center gap-1.5">
            {["tous", "en_cours", "confirme", "annule", "termine"].map(s => {
              const cfg = s !== "tous" ? STATUT_CFG[s as Statut] : null;
              return (
                <button key={s} onClick={() => setFiltreStatut(s)}
                  className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all",
                    filtreStatut === s
                      ? s === "tous" ? "bg-foreground text-background border-foreground" : cn(cfg!.badgeBg, cfg!.badgeText, "border-transparent")
                      : "border-border text-muted-foreground hover:border-border/80"
                  )}
                >
                  {cfg && <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />}
                  {s === "tous" ? "Tous" : cfg!.label}
                </button>
              );
            })}
          </div>
          {isAdmin && (
            <button onClick={() => setShowFilters(v => !v)}
              className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all",
                showFilters ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-border/80"
              )}
            >
              <Filter size={11} />Filtres
            </button>
          )}
          <div className="flex items-center gap-0.5 bg-muted rounded-lg p-0.5 ml-auto">
            {(["list", "kanban"] as ViewMode[]).map(m => (
              <button key={m} onClick={() => setViewMode(m)}
                className={cn("p-1.5 rounded-md transition-all", viewMode === m ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
              >
                {m === "list" ? <LayoutList size={14} /> : <LayoutGrid size={14} />}
              </button>
            ))}
          </div>
        </div>

        {showFilters && isAdmin && (
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl border border-border/50">
            <span className="text-xs font-semibold text-muted-foreground">Filtrer par :</span>
            <Select value={filtreDept} onValueChange={setFiltreDept}>
              <SelectTrigger className="h-7 w-36 text-xs"><SelectValue placeholder="Département" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous depts.</SelectItem>
                {Object.entries(DEPARTEMENTS_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v as string}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filtreAgent} onValueChange={setFiltreAgent}>
              <SelectTrigger className="h-7 w-32 text-xs"><SelectValue placeholder="Agent" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous agents</SelectItem>
                {EMPLOYES.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
              </SelectContent>
            </Select>
            {(filtreDept !== "tous" || filtreAgent !== "tous") && (
              <button className="text-xs text-primary hover:underline ml-auto" onClick={() => { setFiltreDept("tous"); setFiltreAgent("tous"); }}>Réinitialiser</button>
            )}
          </div>
        )}

        {selected.size > 0 && !isEmployee && (
          <div className="flex items-center gap-3 px-3 py-2 bg-primary/5 border border-primary/20 rounded-xl">
            <CheckSquare size={14} className="text-primary" />
            <span className="text-xs font-semibold text-foreground">{selected.size} sélectionné(s)</span>
            <div className="flex items-center gap-2 ml-auto">
              <Select value={batchStatut} onValueChange={v => setBatchStatut(v as Statut)}>
                <SelectTrigger className="h-7 w-40 text-xs"><SelectValue placeholder="Changer statut..." /></SelectTrigger>
                <SelectContent>
                  {Object.entries(STATUT_CFG).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button size="sm" className="h-7 text-xs" disabled={!batchStatut} onClick={applyBatch}>Appliquer</Button>
              <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setSelected(new Set())}><X size={12} /></Button>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-5">
        {viewMode === "list" && (
          <div className="max-w-6xl mx-auto space-y-2">
            <div className="flex items-center gap-3 px-4 mb-1">
              {!isEmployee && (
                <div className="flex-shrink-0 w-5">
                  <button onClick={toggleAll} className="text-muted-foreground hover:text-primary transition-colors">
                    {selected.size === filtered.length && filtered.length > 0 ? <CheckSquare size={14} className="text-primary" /> : <Square size={14} />}
                  </button>
                </div>
              )}
              <div className="w-8 flex-shrink-0" />
              <div className="w-32 flex-shrink-0"><SortTh field="reference" current={sortField} dir={sortDir} onSort={handleSort}>Réf.</SortTh></div>
              <div className="flex-1"><SortTh field="clientNom" current={sortField} dir={sortDir} onSort={handleSort}>Client / Destination</SortTh></div>
              <div className="hidden md:block w-28 flex-shrink-0" />
              <div className="w-20 flex-shrink-0"><SortTh field="statut" current={sortField} dir={sortDir} onSort={handleSort}>Statut</SortTh></div>
              <div className="w-28 text-right flex-shrink-0"><SortTh field="totalContrat" current={sortField} dir={sortDir} onSort={handleSort}>Montant</SortTh></div>
            </div>

            {filtered.map(d => (
              <DossierRow key={d.id} d={d} selected={selected.has(d.id)} onToggle={() => toggleSelect(d.id)} highlight={search} canSelect={!isEmployee} />
            ))}

            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <AlertCircle size={32} className="text-muted-foreground/30 mb-3" />
                <p className="text-sm font-medium text-muted-foreground">Aucun dossier trouvé</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {isEmployee ? "Aucun dossier ne vous a été assigné pour le moment" : "Modifiez vos filtres ou créez un nouveau dossier"}
                </p>
              </div>
            )}
          </div>
        )}

        {viewMode === "kanban" && (
          <div className="flex gap-4 h-full" style={{ minWidth: "max-content" }}
            onDragEnd={() => { setDragId(null); setDragOver(null); }}>
            {(Object.keys(STATUT_CFG) as Statut[]).map(statut => {
              const sc = STATUT_CFG[statut];
              const colDossiers = filtered.filter(d => d.statut === statut);
              const isOver = dragOver === statut;
              return (
                <div key={statut} className="flex flex-col" style={{ width: 240, flexShrink: 0 }}>
                  <div className={cn("flex items-center gap-2 px-3 py-2 rounded-xl border mb-2", sc.headerBg)}>
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: sc.dot }} />
                    <span className={cn("text-[12px] font-semibold flex-1", sc.headerText)}>{sc.label}</span>
                    <span className={cn("text-[11px] font-bold px-2 py-0.5 rounded-full", sc.countBg, sc.countText)}>{colDossiers.length}</span>
                  </div>
                  <div
                    className={cn("flex-1 rounded-xl p-2 space-y-2 min-h-64 transition-all", sc.colBg, isOver && dragId && "ring-2 ring-offset-1 scale-[1.01]")}
                    onDragOver={e => { e.preventDefault(); setDragOver(statut); }}
                    onDragLeave={() => setDragOver(null)}
                    onDrop={() => handleKanbanDrop(statut)}
                  >
                    {colDossiers.length === 0 && (
                      <div className="flex items-center justify-center h-20 rounded-lg border-2 border-dashed border-border/40">
                        <p className="text-xs text-muted-foreground">Déposer ici</p>
                      </div>
                    )}
                    {colDossiers.map(d => <KanbanCard key={d.id} d={d} onDragStart={setDragId} />)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <NewDossierModal open={newOpen} onClose={() => setNewOpen(false)} onAdd={addDossier} defaultDept={defaultDept} />
    </div>
  );
}