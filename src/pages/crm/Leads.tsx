import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Phone, Mail, UserPlus, Search, MoreHorizontal,
  Clock, AlertCircle, CheckCircle2, XCircle, Upload,
  GripVertical, ChevronRight, Sparkles, TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
  DropdownMenuSeparator, DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────
export type LeadStatus = "new" | "appel" | "followup1" | "followup2" | "promis" | "lost";

export interface Lead {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  source: "foire" | "salon" | "referral" | "web" | "autre";
  service_interesse: "hajj" | "omra" | "tourisme" ;
  status: LeadStatus;
  assigneA: string;
  dateCreation: string;
  derniereAction: string;
  notes: string;
  tentativesAppel: number;
}

// ─── Mock data ─────────────────────────────────────────────────────────────────
const MOCK_LEADS: Lead[] = [
  { id: "L001", nom: "Benali", prenom: "Karim", telephone: "+212 6 12 34 56 78", email: "k.benali@gmail.com", source: "foire", service_interesse: "omra", status: "new", assigneA: "Feras", dateCreation: "2026-04-01", derniereAction: "2026-04-01", notes: "", tentativesAppel: 0 },
  { id: "L002", nom: "El Fassi", prenom: "Samira", telephone: "+212 6 98 76 54 32", email: "s.elfassi@gmail.com", source: "salon", service_interesse: "hajj", status: "new", assigneA: "Adam", dateCreation: "2026-04-02", derniereAction: "2026-04-02", notes: "", tentativesAppel: 0 },
  { id: "L003", nom: "Tazi", prenom: "Omar", telephone: "+212 6 55 44 33 22", email: "o.tazi@outlook.com", source: "referral", service_interesse: "tourisme", status: "appel", assigneA: "Feras", dateCreation: "2026-03-28", derniereAction: "2026-04-03", notes: "Intéressé voyage Marrakech groupe famille", tentativesAppel: 1 },
  { id: "L004", nom: "Chraibi", prenom: "Nadia", telephone: "+212 6 11 22 33 44", email: "n.chraibi@gmail.com", source: "foire", service_interesse: "tourisme", status: "appel", assigneA: "Adam", dateCreation: "2026-03-25", derniereAction: "2026-04-04", notes: "Demande devis séminaire 50 pax", tentativesAppel: 1 },
  { id: "L005", nom: "Ouali", prenom: "Hassan", telephone: "+212 6 77 88 99 00", email: "h.ouali@hotmail.com", source: "web", service_interesse: "omra", status: "followup1", assigneA: "Feras", dateCreation: "2026-03-20", derniereAction: "2026-04-02", notes: "Pas répondu au 1er appel", tentativesAppel: 2 },
  { id: "L006", nom: "Bennani", prenom: "Fatima", telephone: "+212 6 33 44 55 66", email: "f.bennani@gmail.com", source: "salon", service_interesse: "hajj", status: "followup1", assigneA: "Adam", dateCreation: "2026-03-18", derniereAction: "2026-04-01", notes: "Rappel le matin", tentativesAppel: 2 },
  { id: "L007", nom: "Lahlou", prenom: "Youssef", telephone: "+212 6 22 11 00 99", email: "y.lahlou@gmail.com", source: "foire", service_interesse: "tourisme", status: "followup2", assigneA: "Feras", dateCreation: "2026-03-10", derniereAction: "2026-03-30", notes: "Très difficile à joindre", tentativesAppel: 3 },
  { id: "L008", nom: "Sentissi", prenom: "Rim", telephone: "+212 6 44 55 66 77", email: "r.sentissi@gmail.com", source: "referral", service_interesse: "tourisme", status: "promis", assigneA: "Adam", dateCreation: "2026-03-05", derniereAction: "2026-04-05", notes: "Très intéressée, attend devis final", tentativesAppel: 3 },
  { id: "L009", nom: "Berrada", prenom: "Amine", telephone: "+212 6 66 77 88 99", email: "a.berrada@gmail.com", source: "web", service_interesse: "omra", status: "lost", assigneA: "Feras", dateCreation: "2026-03-01", derniereAction: "2026-03-28", notes: "Parti chez concurrent", tentativesAppel: 4 },
];

// ─── Column config ─────────────────────────────────────────────────────────────
const COLUMNS: {
  status: LeadStatus;
  label: string;
  dot: string;
  headerBg: string;
  headerText: string;
  colBg: string;
  badgeBg: string;
  badgeText: string;
  icon: React.ReactNode;
  countBg: string;
  countText: string;
}[] = [
  {
    status: "new",
    label: "Nouveau",
    dot: "#378ADD",
    headerBg: "bg-blue-50 border-blue-100",
    headerText: "text-blue-800",
    colBg: "bg-blue-50/40",
    badgeBg: "bg-blue-100",
    badgeText: "text-blue-800",
    countBg: "bg-blue-100",
    countText: "text-blue-700",
    icon: <UserPlus size={13} />,
  },
  {
    status: "appel",
    label: "En appel",
    dot: "#1D9E75",
    headerBg: "bg-emerald-50 border-emerald-100",
    headerText: "text-emerald-800",
    colBg: "bg-emerald-50/40",
    badgeBg: "bg-emerald-100",
    badgeText: "text-emerald-800",
    countBg: "bg-emerald-100",
    countText: "text-emerald-700",
    icon: <Phone size={13} />,
  },
  {
    status: "followup1",
    label: "Follow-up 1",
    dot: "#EF9F27",
    headerBg: "bg-amber-50 border-amber-100",
    headerText: "text-amber-800",
    colBg: "bg-amber-50/40",
    badgeBg: "bg-amber-100",
    badgeText: "text-amber-800",
    countBg: "bg-amber-100",
    countText: "text-amber-700",
    icon: <Clock size={13} />,
  },
  {
    status: "followup2",
    label: "Follow-up 2",
    dot: "#D85A30",
    headerBg: "bg-orange-50 border-orange-100",
    headerText: "text-orange-800",
    colBg: "bg-orange-50/40",
    badgeBg: "bg-orange-100",
    badgeText: "text-orange-800",
    countBg: "bg-orange-100",
    countText: "text-orange-700",
    icon: <AlertCircle size={13} />,
  },
  {
    status: "promis",
    label: "Promis",
    dot: "#639922",
    headerBg: "bg-green-50 border-green-100",
    headerText: "text-green-800",
    colBg: "bg-green-50/40",
    badgeBg: "bg-green-100",
    badgeText: "text-green-800",
    countBg: "bg-green-100",
    countText: "text-green-700",
    icon: <CheckCircle2 size={13} />,
  },
  {
    status: "lost",
    label: "Lost",
    dot: "#E24B4A",
    headerBg: "bg-red-50 border-red-100",
    headerText: "text-red-800",
    colBg: "bg-red-50/40",
    badgeBg: "bg-red-100",
    badgeText: "text-red-800",
    countBg: "bg-red-100",
    countText: "text-red-700",
    icon: <XCircle size={13} />,
  },
];

const SERVICE_LABELS: Record<Lead["service_interesse"], string> = {
  hajj: "Hajj",
  omra: "Omra",
  tourisme: "Tourisme",

};

const SOURCE_LABELS: Record<Lead["source"], string> = {
  foire: "Foire",
  salon: "Salon",
  referral: "Référence",
  web: "Web",
  autre: "Autre",
};

// Avatar color pairs [bg, text] cycling by index
const AVATAR_PALETTE = [
  ["bg-blue-100 text-blue-700"],
  ["bg-emerald-100 text-emerald-700"],
  ["bg-amber-100 text-amber-800"],
  ["bg-rose-100 text-rose-700"],
  ["bg-violet-100 text-violet-700"],
  ["bg-teal-100 text-teal-700"],
  ["bg-orange-100 text-orange-700"],
  ["bg-indigo-100 text-indigo-700"],
];

const avatarCache: Record<string, string> = {};
let avatarCounter = 0;
function getAvatarClass(id: string): string {
  if (!avatarCache[id]) {
    avatarCache[id] = AVATAR_PALETTE[avatarCounter % AVATAR_PALETTE.length][0];
    avatarCounter++;
  }
  return avatarCache[id];
}

function initials(prenom: string, nom: string): string {
  return ((prenom?.[0] ?? "") + (nom?.[0] ?? "")).toUpperCase();
}

function formatDate(iso: string): string {
  return iso.slice(8, 10) + "/" + iso.slice(5, 7);
}

// ─── Add Lead Modal ────────────────────────────────────────────────────────────
function AddLeadModal({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (l: Lead) => void;
}) {
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    email: "",
    source: "foire" as Lead["source"],
    service_interesse: "omra" as Lead["service_interesse"],
    assigneA: "Feras",
    notes: "",
  });
  const f = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const submit = () => {
    if (!form.nom || !form.telephone) {
      toast.error("Nom et téléphone obligatoires");
      return;
    }
    onAdd({
      ...form,
      id: `L${Date.now()}`,
      status: "new",
      dateCreation: new Date().toISOString().slice(0, 10),
      derniereAction: new Date().toISOString().slice(0, 10),
      tentativesAppel: 0,
    });
    setForm({ nom: "", prenom: "", telephone: "", email: "", source: "foire", service_interesse: "omra", assigneA: "Feras", notes: "" });
    onClose();
    toast.success("Lead ajouté avec succès");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Nouveau lead</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Nom *</Label>
            <Input value={form.nom} onChange={(e) => f("nom", e.target.value)} placeholder="Benali" className="h-9" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Prénom</Label>
            <Input value={form.prenom} onChange={(e) => f("prenom", e.target.value)} placeholder="Karim" className="h-9" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Téléphone *</Label>
            <Input value={form.telephone} onChange={(e) => f("telephone", e.target.value)} placeholder="+212 6 XX XX XX XX" className="h-9 font-mono text-sm" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Email</Label>
            <Input value={form.email} onChange={(e) => f("email", e.target.value)} placeholder="nom@gmail.com" className="h-9" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Source</Label>
            <Select value={form.source} onValueChange={(v) => f("source", v)}>
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(SOURCE_LABELS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Service</Label>
            <Select value={form.service_interesse} onValueChange={(v) => f("service_interesse", v)}>
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(SERVICE_LABELS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Assigné à</Label>
            <Select value={form.assigneA} onValueChange={(v) => f("assigneA", v)}>
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Feras">Feras</SelectItem>
                <SelectItem value="Adam">Adam</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Notes</Label>
            <Textarea value={form.notes} onChange={(e) => f("notes", e.target.value)} rows={2} placeholder="Informations supplémentaires..." className="resize-none text-sm" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="h-9">Annuler</Button>
          <Button onClick={submit} className="h-9 bg-primary hover:bg-primary/90">
            <UserPlus size={14} className="mr-1.5" />
            Ajouter le lead
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Lead Card ─────────────────────────────────────────────────────────────────
function LeadCard({
  lead,
  onMove,
  onOpen,
  onDragStart,
  onDragEnd,
}: {
  lead: Lead;
  onMove: (id: string, s: LeadStatus) => void;
  onOpen: (id: string) => void;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
}) {
  const col = COLUMNS.find((c) => c.status === lead.status)!;
  const avatarClass = getAvatarClass(lead.id);

  return (
    <div
      draggable
      onDragStart={() => onDragStart(lead.id)}
      onDragEnd={onDragEnd}
      onClick={() => onOpen(lead.id)}
      className={cn(
        "group relative bg-card border border-border/60 rounded-xl p-3.5 cursor-pointer",
        "hover:border-border hover:shadow-sm",
        "transition-all duration-150 ease-out",
        "active:scale-[0.98] active:cursor-grabbing",
        "fade-in"
      )}
    >
      {/* Drag handle — visible on hover */}
      <div className="absolute left-1.5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-30 transition-opacity">
        <GripVertical size={14} className="text-muted-foreground" />
      </div>

      {/* Top row: avatar + name + menu */}
      <div className="flex items-start gap-2.5 mb-2.5">
        {/* Avatar */}
        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold flex-shrink-0", avatarClass)}>
          {initials(lead.prenom, lead.nom)}
        </div>

        {/* Name & phone */}
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-foreground leading-tight truncate">
            {lead.prenom} {lead.nom}
          </p>
          <p className="text-[11px] text-muted-foreground font-mono mt-0.5 truncate">{lead.telephone}</p>
        </div>

        {/* Actions menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <button
              className={cn(
                "opacity-0 group-hover:opacity-100 transition-opacity",
                "p-1 rounded-md hover:bg-muted",
                "text-muted-foreground hover:text-foreground"
              )}
            >
              <MoreHorizontal size={14} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44" onClick={(e) => e.stopPropagation()}>
            <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">Déplacer vers</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {COLUMNS.filter((c) => c.status !== lead.status).map((c) => (
              <DropdownMenuItem
                key={c.status}
                className="text-sm gap-2 cursor-pointer"
                onClick={() => onMove(lead.id, c.status)}
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: c.dot }}
                />
                {c.label}
                <ChevronRight size={12} className="ml-auto text-muted-foreground" />
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Badges row */}
      <div className="flex items-center gap-1.5 flex-wrap mb-2">
        <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full tracking-wide", col.badgeBg, col.badgeText)}>
          {SERVICE_LABELS[lead.service_interesse]}
        </span>
        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
          {SOURCE_LABELS[lead.source]}
        </span>
        {lead.tentativesAppel > 0 && (
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground ml-auto">
            {lead.tentativesAppel} appel{lead.tentativesAppel > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Notes */}
      {lead.notes && (
        <p className="text-[11px] text-muted-foreground italic leading-relaxed line-clamp-2 mb-2 border-l-2 border-border pl-2">
          {lead.notes}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-border/50">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full bg-muted flex items-center justify-center text-[8px] font-bold text-muted-foreground">
            {lead.assigneA[0]}
          </div>
          <span className="text-[11px] text-muted-foreground font-medium">{lead.assigneA}</span>
        </div>
        <span className="text-[10px] text-muted-foreground font-mono">{formatDate(lead.dateCreation)}</span>
      </div>
    </div>
  );
}

// ─── Kanban Column ─────────────────────────────────────────────────────────────
function KanbanColumn({
  col,
  leads,
  onMove,
  onOpen,
  onDragStart,
  onDragEnd,
  dragOverStatus,
  setDragOverStatus,
  dragId,
}: {
  col: typeof COLUMNS[0];
  leads: Lead[];
  onMove: (id: string, s: LeadStatus) => void;
  onOpen: (id: string) => void;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  dragOverStatus: LeadStatus | null;
  setDragOverStatus: (s: LeadStatus | null) => void;
  dragId: string | null;
}) {
  const isOver = dragOverStatus === col.status;

  return (
    <div className="flex flex-col min-w-0 flex-1" style={{ minWidth: 210, maxWidth: 280 }}>
      {/* Column header */}
      <div className={cn("flex items-center gap-2 px-3 py-2 rounded-xl border mb-2", col.headerBg)}>
        <span className={cn("flex-shrink-0", col.headerText)}>{col.icon}</span>
        <span className={cn("text-[12px] font-semibold flex-1 tracking-wide", col.headerText)}>
          {col.label}
        </span>
        <span className={cn("text-[11px] font-bold px-2 py-0.5 rounded-full", col.countBg, col.countText)}>
          {leads.length}
        </span>
      </div>

      {/* Drop zone */}
      <div
        className={cn(
          "flex-1 rounded-xl p-2 space-y-2 min-h-[240px] transition-all duration-150",
          col.colBg,
          isOver && dragId && "ring-2 ring-offset-1 scale-[1.01]"
        )}
        style={isOver && dragId ? { ringColor: col.dot } : {}}
        onDragOver={(e) => { e.preventDefault(); setDragOverStatus(col.status); }}
        onDragLeave={() => setDragOverStatus(null)}
        onDrop={() => {
          setDragOverStatus(null);
          if (dragId) onMove(dragId, col.status);
        }}
      >
        {leads.length === 0 ? (
          <div className={cn(
            "flex items-center justify-center h-20 rounded-lg border-2 border-dashed transition-colors",
            isOver && dragId ? "border-current opacity-60" : "border-border/40 opacity-0 group-hover:opacity-100"
          )}>
            <p className="text-xs text-muted-foreground">Déposer ici</p>
          </div>
        ) : (
          leads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onMove={onMove}
              onOpen={onOpen}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
            />
          ))
        )}
      </div>
    </div>
  );
}

// ─── Stat Pill ─────────────────────────────────────────────────────────────────
function StatPill({ col, count }: { col: typeof COLUMNS[0]; count: number }) {
  return (
    <span
      className={cn("inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full border", col.headerBg, col.headerText, "border-transparent")}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: col.dot }} />
      {col.label}
      <span className={cn("ml-0.5 px-1.5 py-0.5 rounded-full text-[10px]", col.countBg, col.countText)}>
        {count}
      </span>
    </span>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function Leads() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [search, setSearch] = useState("");
  const [filterAssigne, setFilterAssigne] = useState("tous");
  const [filterService, setFilterService] = useState("tous");
  const [addOpen, setAddOpen] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<LeadStatus | null>(null);

  const filtered = leads.filter((l) => {
    const q = search.toLowerCase();
    const matchSearch = !q || `${l.nom} ${l.prenom} ${l.telephone} ${l.email}`.toLowerCase().includes(q);
    const matchAssigne = filterAssigne === "tous" || l.assigneA === filterAssigne;
    const matchService = filterService === "tous" || l.service_interesse === filterService;
    return matchSearch && matchAssigne && matchService;
  });

  const moveCard = (id: string, status: LeadStatus) => {
    setLeads((p) =>
      p.map((l) =>
        l.id === id ? { ...l, status, derniereAction: new Date().toISOString().slice(0, 10) } : l
      )
    );
    const col = COLUMNS.find((c) => c.status === status);
    toast.success(`Déplacé vers ${col?.label}`);
  };

  const addLead = (l: Lead) => setLeads((p) => [l, ...p]);

  // KPIs
  const totalLeads = leads.length;
  const promisCount = leads.filter((l) => l.status === "promis").length;
  const convRate = totalLeads > 0 ? Math.round((promisCount / totalLeads) * 100) : 0;
  const newToday = leads.filter((l) => l.dateCreation === new Date().toISOString().slice(0, 10)).length;

  return (
    <div className="h-full flex flex-col bg-background">
      {/* ── Page header ── */}
      <div className="flex-shrink-0 border-b border-border bg-card px-6 py-4">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <TrendingUp size={18} className="text-primary" />
              <h1 className="text-xl font-bold text-foreground tracking-tight">Pipeline Leads</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              {totalLeads} leads · {promisCount} promis · {convRate}% conversion
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs font-medium"
            >
              <Upload size={13} />
              Import Excel
            </Button>
            <Button
              size="sm"
              className="h-8 gap-1.5 text-xs font-semibold bg-primary hover:bg-primary/90"
              onClick={() => setAddOpen(true)}
            >
              <UserPlus size={13} />
              Nouveau lead
            </Button>
          </div>
        </div>

        {/* ── Filters row ── */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-40 max-w-56">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              className="pl-8 h-8 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Select value={filterAssigne} onValueChange={setFilterAssigne}>
            <SelectTrigger className="w-32 h-8 text-sm">
              <SelectValue placeholder="Agent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tous">Tous agents</SelectItem>
              <SelectItem value="Feras">Feras</SelectItem>
              <SelectItem value="Adam">Adam</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterService} onValueChange={setFilterService}>
            <SelectTrigger className="w-36 h-8 text-sm">
              <SelectValue placeholder="Service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tous">Tous services</SelectItem>
              {Object.entries(SERVICE_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Stats pills */}
          <div className="flex items-center gap-1.5 ml-auto flex-wrap">
            {COLUMNS.map((col) => (
              <StatPill
                key={col.status}
                col={col}
                count={filtered.filter((l) => l.status === col.status).length}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Kanban board ── */}
      <div className="flex-1 overflow-x-auto overflow-y-auto p-4">
        <div
          className="flex gap-3 h-full"
          style={{ minWidth: "max-content" }}
          onDragEnd={() => { setDragId(null); setDragOverStatus(null); }}
        >
          {COLUMNS.map((col) => (
            <KanbanColumn
              key={col.status}
              col={col}
              leads={filtered.filter((l) => l.status === col.status)}
              onMove={moveCard}
              onOpen={(id) => navigate(`/leads/${id}`)}
              onDragStart={(id) => setDragId(id)}
              onDragEnd={() => { setDragId(null); setDragOverStatus(null); }}
              dragOverStatus={dragOverStatus}
              setDragOverStatus={setDragOverStatus}
              dragId={dragId}
            />
          ))}
        </div>
      </div>

      <AddLeadModal open={addOpen} onClose={() => setAddOpen(false)} onAdd={addLead} />
    </div>
  );
}