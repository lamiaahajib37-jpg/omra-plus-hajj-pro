import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Phone, Mail, Calendar, Clock,
  CheckCircle2, XCircle, Edit2, Save, X, UserCheck,
  MessageSquare, PhoneCall, PhoneMissed, ChevronRight,
  Sparkles, TrendingUp, MapPin, Hash, User, Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { Lead, LeadStatus } from "./Leads";

// ─── Types & Mock Data ────────────────────────────────────────────────────────
const MOCK_LEAD: Lead = {
  id: "L003",
  nom: "Tazi",
  prenom: "Omar",
  telephone: "+212 6 55 44 33 22",
  email: "o.tazi@outlook.com",
  source: "referral",
  service_interesse: "tourisme",
  status: "appel",
  assigneA: "Feras",
  dateCreation: "2026-03-28",
  derniereAction: "2026-04-03",
  notes: "Intéressé voyage Marrakech groupe famille",
  tentativesAppel: 1,
};

interface CallLog {
  id: string;
  date: string;
  heure: string;
  type: "appel_repondu" | "appel_manque" | "message" | "email";
  duree?: string;
  note: string;
  agent: string;
}

const MOCK_CALLS: CallLog[] = [
  { id: "C1", date: "2026-04-03", heure: "10:30", type: "appel_repondu", duree: "4min 12s", note: "Client intéressé par voyage Marrakech pour famille 6 personnes. Veut devis détaillé avec hôtel 5 étoiles.", agent: "Feras" },
  { id: "C2", date: "2026-03-30", heure: "14:15", type: "appel_manque", note: "Pas répondu. Laissé message vocal.", agent: "Feras" },
  { id: "C3", date: "2026-03-28", heure: "09:00", type: "email", note: "Email de bienvenue envoyé suite au salon.", agent: "Feras" },
];

// ─── Status config aligned with Leads.tsx palette ────────────────────────────
const STATUS_CONFIG: Record<LeadStatus, {
  label: string;
  dot: string;
  headerBg: string;
  headerText: string;
  badgeBg: string;
  badgeText: string;
  selectBg: string;
  selectBorder: string;
  selectText: string;
}> = {
  new:       { label: "Nouveau",     dot: "#378ADD", headerBg: "bg-blue-50",   headerText: "text-blue-800",   badgeBg: "bg-blue-100",   badgeText: "text-blue-800",   selectBg: "#EFF6FF", selectBorder: "#BFDBFE", selectText: "#1E40AF" },
  appel:     { label: "En appel",    dot: "#1D9E75", headerBg: "bg-emerald-50",headerText: "text-emerald-800",badgeBg: "bg-emerald-100",badgeText: "text-emerald-800",selectBg: "#ECFDF5", selectBorder: "#A7F3D0", selectText: "#065F46" },
  followup1: { label: "Follow-up 1", dot: "#EF9F27", headerBg: "bg-amber-50",  headerText: "text-amber-800",  badgeBg: "bg-amber-100",  badgeText: "text-amber-800",  selectBg: "#FFFBEB", selectBorder: "#FDE68A", selectText: "#92400E" },
  followup2: { label: "Follow-up 2", dot: "#D85A30", headerBg: "bg-orange-50", headerText: "text-orange-800", badgeBg: "bg-orange-100", badgeText: "text-orange-800", selectBg: "#FFF7ED", selectBorder: "#FDBA74", selectText: "#9A3412" },
  promis:    { label: "Promis",      dot: "#639922", headerBg: "bg-green-50",   headerText: "text-green-800",  badgeBg: "bg-green-100",  badgeText: "text-green-800",  selectBg: "#F0FDF4", selectBorder: "#BBF7D0", selectText: "#166534" },
  lost:      { label: "Lost",        dot: "#E24B4A", headerBg: "bg-red-50",     headerText: "text-red-800",    badgeBg: "bg-red-100",    badgeText: "text-red-800",    selectBg: "#FEF2F2", selectBorder: "#FECACA", selectText: "#991B1B" },
};

const SOURCE_LABELS: Record<Lead["source"], string> = {
  foire: "Foire", salon: "Salon", referral: "Référence", web: "Web", autre: "Autre",
};

const SERVICE_LABELS: Record<Lead["service_interesse"], string> = {
  hajj: "Hajj", omra: "Omra", tourisme: "Tourisme", mice: "MICE", outbound: "Outbound",
};

// ─── Call type config ─────────────────────────────────────────────────────────
const CALL_TYPE_CONFIG: Record<CallLog["type"], {
  label: string;
  icon: React.ReactNode;
  iconBg: string;
  lineBg: string;
}> = {
  appel_repondu: {
    label: "Appel répondu",
    icon: <PhoneCall size={13} />,
    iconBg: "bg-emerald-100 text-emerald-700",
    lineBg: "bg-emerald-200",
  },
  appel_manque: {
    label: "Appel manqué",
    icon: <PhoneMissed size={13} />,
    iconBg: "bg-red-100 text-red-600",
    lineBg: "bg-red-200",
  },
  message: {
    label: "Message",
    icon: <MessageSquare size={13} />,
    iconBg: "bg-blue-100 text-blue-700",
    lineBg: "bg-blue-200",
  },
  email: {
    label: "Email",
    icon: <Mail size={13} />,
    iconBg: "bg-violet-100 text-violet-700",
    lineBg: "bg-violet-200",
  },
};

// ─── Add Call Modal ───────────────────────────────────────────────────────────
function AddCallModal({
  open, onClose, onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (c: CallLog) => void;
}) {
  const [form, setForm] = useState({ type: "appel_repondu" as CallLog["type"], duree: "", note: "" });
  const now = new Date();

  const submit = () => {
    if (!form.note) { toast.error("Ajoutez une note"); return; }
    onAdd({
      id: `C${Date.now()}`,
      date: now.toISOString().slice(0, 10),
      heure: now.toTimeString().slice(0, 5),
      type: form.type,
      duree: form.type === "appel_repondu" ? form.duree : undefined,
      note: form.note,
      agent: "Feras",
    });
    setForm({ type: "appel_repondu", duree: "", note: "" });
    onClose();
    toast.success("Interaction enregistrée");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">Enregistrer une interaction</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-1">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Type</Label>
            <Select value={form.type} onValueChange={(v) => setForm((p) => ({ ...p, type: v as CallLog["type"] }))}>
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="appel_repondu">Appel répondu</SelectItem>
                <SelectItem value="appel_manque">Appel manqué</SelectItem>
                <SelectItem value="message">Message WhatsApp / SMS</SelectItem>
                <SelectItem value="email">Email</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {form.type === "appel_repondu" && (
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Durée</Label>
              <Input placeholder="ex: 3min 20s" className="h-9 font-mono text-sm" value={form.duree} onChange={(e) => setForm((p) => ({ ...p, duree: e.target.value }))} />
            </div>
          )}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Note *</Label>
            <Textarea placeholder="Résumé de l'interaction..." rows={3} className="text-sm resize-none" value={form.note} onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="h-9">Annuler</Button>
          <Button onClick={submit} className="h-9 bg-primary hover:bg-primary/90">Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Convert Modal ────────────────────────────────────────────────────────────
function ConvertModal({
  open, onClose, lead,
}: {
  open: boolean;
  onClose: () => void;
  lead: Lead;
}) {
  const navigate = useNavigate();
  const [dept, setDept] = useState("mice");

  const confirm = () => {
    toast.success(`${lead.prenom} ${lead.nom} converti en client — dossier créé`);
    onClose();
    navigate("/clients");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">Convertir en client</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Créer un dossier pour{" "}
          <span className="font-semibold text-foreground">{lead.prenom} {lead.nom}</span>{" "}
          et l'assigner à un département.
        </p>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Département</Label>
          <Select value={dept} onValueChange={setDept}>
            <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="mice">MICE</SelectItem>
              <SelectItem value="leisure">Leisure</SelectItem>
              <SelectItem value="hajj_omra">Hajj &amp; Omra</SelectItem>
              <SelectItem value="outbound">Outbound</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="h-9">Annuler</Button>
          <Button onClick={confirm} className="h-9 gap-1.5 bg-primary hover:bg-primary/90">
            <UserCheck size={14} />
            Confirmer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Info Row ─────────────────────────────────────────────────────────────────
function InfoRow({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {icon && <span className="opacity-60">{icon}</span>}
        {label}
      </span>
      <span className="text-xs font-semibold text-foreground">{value}</span>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function LeadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lead, setLead] = useState<Lead>(MOCK_LEAD);
  const [calls, setCalls] = useState<CallLog[]>(MOCK_CALLS);
  const [editNotes, setEditNotes] = useState(false);
  const [notes, setNotes] = useState(lead.notes);
  const [addCallOpen, setAddCallOpen] = useState(false);
  const [convertOpen, setConvertOpen] = useState(false);

  const sc = STATUS_CONFIG[lead.status];

  const changeStatus = (s: LeadStatus) => {
    setLead((p) => ({ ...p, status: s, derniereAction: new Date().toISOString().slice(0, 10) }));
    toast.success(`Statut → ${STATUS_CONFIG[s].label}`);
  };

  const saveNotes = () => {
    setLead((p) => ({ ...p, notes }));
    setEditNotes(false);
    toast.success("Notes sauvegardées");
  };

  const initials = `${lead.prenom[0]}${lead.nom[0]}`.toUpperCase();

  return (
    <div className="h-full flex flex-col bg-background">

      {/* ── Top bar ── */}
      <div className="flex-shrink-0 border-b border-border bg-card px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Breadcrumb */}
          <button
            onClick={() => navigate("/leads")}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>Pipeline</span>
            <ChevronRight size={12} className="opacity-50" />
            <span className="text-foreground font-semibold">{lead.prenom} {lead.nom}</span>
          </button>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Status select — colored */}
            <Select value={lead.status} onValueChange={(v) => changeStatus(v as LeadStatus)}>
              <SelectTrigger
                className="h-8 w-36 text-xs font-semibold border"
                style={{
                  background: sc.selectBg,
                  borderColor: sc.selectBorder,
                  color: sc.selectText,
                }}
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: sc.dot }} />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                  <SelectItem key={k} value={k} className="text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ background: v.dot }} />
                      {v.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              size="sm"
              variant="outline"
              className="h-8 gap-1.5 text-xs"
              onClick={() => setAddCallOpen(true)}
            >
              <PhoneCall size={13} />
              Log appel
            </Button>

            {lead.status !== "lost" && (
              <Button
                size="sm"
                className="h-8 gap-1.5 text-xs font-semibold bg-primary hover:bg-primary/90"
                onClick={() => setConvertOpen(true)}
              >
                <UserCheck size={13} />
                Convertir en client
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-auto p-5">
        <div className="max-w-5xl mx-auto space-y-4">

          {/* ── Hero card ── */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {/* Colored top strip */}
            <div
              className="h-1.5 w-full"
              style={{ background: `linear-gradient(90deg, ${sc.dot}, ${sc.dot}88)` }}
            />

            <div className="p-5 flex items-start gap-5">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold"
                  style={{ background: sc.selectBg, color: sc.selectText }}
                >
                  {initials}
                </div>
                <span
                  className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card"
                  style={{ background: sc.dot }}
                />
              </div>

              {/* Name + contact */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground tracking-tight">
                      {lead.prenom} {lead.nom}
                    </h1>
                    <div className="flex items-center gap-4 mt-1.5 flex-wrap">
                      <a
                        href={`tel:${lead.telephone}`}
                        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors font-mono"
                      >
                        <Phone size={12} className="text-primary" />
                        {lead.telephone}
                      </a>
                      {lead.email && (
                        <a
                          href={`mailto:${lead.email}`}
                          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Mail size={12} className="text-primary" />
                          {lead.email}
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Meta badges */}
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <span className={cn("flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full", sc.badgeBg, sc.badgeText)}>
                    <Activity size={10} />
                    {sc.label}
                  </span>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                    {SERVICE_LABELS[lead.service_interesse]}
                  </span>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                    {SOURCE_LABELS[lead.source]}
                  </span>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                    <User size={9} className="inline mr-1" />
                    {lead.assigneA}
                  </span>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                    {calls.length} interaction{calls.length > 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              {/* Quick action buttons */}
              <div className="flex flex-col gap-2 flex-shrink-0">
                <a
                  href={`tel:${lead.telephone}`}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-semibold hover:bg-emerald-100 transition-colors"
                >
                  <Phone size={13} />
                  Appeler
                </a>
                <a
                  href={`mailto:${lead.email}`}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 text-xs font-semibold hover:bg-blue-100 transition-colors"
                >
                  <Mail size={13} />
                  Email
                </a>
              </div>
            </div>
          </div>

          {/* ── 3-col grid ── */}
          <div className="grid grid-cols-3 gap-4">

            {/* ── Historique (col-span-2) ── */}
            <div className="col-span-2 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Clock size={14} className="text-muted-foreground" />
                  Historique des interactions
                  <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {calls.length}
                  </span>
                </h2>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 gap-1 text-xs font-medium"
                  onClick={() => setAddCallOpen(true)}
                >
                  + Ajouter
                </Button>
              </div>

              {calls.length === 0 ? (
                <div className="border-2 border-dashed border-border rounded-xl p-10 text-center">
                  <p className="text-sm text-muted-foreground">Aucune interaction enregistrée</p>
                </div>
              ) : (
                <div className="relative space-y-0">
                  {/* Timeline line */}
                  <div className="absolute left-[19px] top-5 bottom-5 w-px bg-border z-0" />

                  {calls.map((call, i) => {
                    const cfg = CALL_TYPE_CONFIG[call.type];
                    return (
                      <div key={call.id} className="relative flex gap-3 pb-3 last:pb-0 fade-in">
                        {/* Timeline dot */}
                        <div className={cn("relative z-10 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mt-0.5", cfg.iconBg)}>
                          {cfg.icon}
                        </div>

                        {/* Card */}
                        <div className="flex-1 bg-card border border-border/60 rounded-xl p-3.5 hover:border-border transition-colors">
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-[13px] font-semibold text-foreground">{cfg.label}</span>
                              {call.duree && (
                                <span className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-mono">
                                  {call.duree}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-mono flex-shrink-0">
                              <span>{call.date}</span>
                              <span className="opacity-40">·</span>
                              <span>{call.heure}</span>
                              <span className="opacity-40">·</span>
                              <span className="font-sans font-medium">{call.agent}</span>
                            </div>
                          </div>
                          <p className="text-[13px] text-foreground/80 leading-relaxed">{call.note}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ── Right sidebar ── */}
            <div className="space-y-3">

              {/* Notes card */}
              <div className="bg-card border border-border/60 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-border/50">
                  <h2 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <MessageSquare size={12} className="text-muted-foreground" />
                    Notes
                  </h2>
                  {!editNotes ? (
                    <button
                      onClick={() => setEditNotes(true)}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Edit2 size={11} /> Modifier
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={saveNotes}
                        className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                      >
                        <Save size={11} /> Sauv.
                      </button>
                      <button
                        onClick={() => setEditNotes(false)}
                        className="text-xs text-muted-foreground hover:text-foreground"
                      >
                        <X size={11} />
                      </button>
                    </div>
                  )}
                </div>
                <div className="p-3.5">
                  {editNotes ? (
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={5}
                      className="text-sm border-0 p-0 focus-visible:ring-0 resize-none bg-transparent"
                      placeholder="Ajouter des notes..."
                      autoFocus
                    />
                  ) : (
                    <p className="text-[13px] text-foreground/80 leading-relaxed min-h-20">
                      {notes ? notes : (
                        <span className="text-muted-foreground italic text-xs">Aucune note — cliquer Modifier</span>
                      )}
                    </p>
                  )}
                </div>
              </div>

              {/* Infos card */}
              <div className="bg-card border border-border/60 rounded-xl overflow-hidden">
                <div className="px-3.5 py-2.5 border-b border-border/50">
                  <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Hash size={12} className="text-muted-foreground" />
                    Informations
                  </h3>
                </div>
                <div className="px-3.5 py-1">
                  <InfoRow
                    label="ID Lead"
                    value={lead.id}
                    icon={<Hash size={11} />}
                  />
                  <InfoRow
                    label="Créé le"
                    value={lead.dateCreation}
                    icon={<Calendar size={11} />}
                  />
                  <InfoRow
                    label="Dernière action"
                    value={lead.derniereAction}
                    icon={<Clock size={11} />}
                  />
                  <InfoRow
                    label="Tentatives appel"
                    value={`${lead.tentativesAppel} appel${lead.tentativesAppel > 1 ? "s" : ""}`}
                    icon={<PhoneCall size={11} />}
                  />
                  <InfoRow
                    label="Agent"
                    value={lead.assigneA}
                    icon={<User size={11} />}
                  />
                  <InfoRow
                    label="Source"
                    value={SOURCE_LABELS[lead.source]}
                    icon={<MapPin size={11} />}
                  />
                </div>
              </div>

              {/* Status pipeline tracker */}
              <div className="bg-card border border-border/60 rounded-xl overflow-hidden">
                <div className="px-3.5 py-2.5 border-b border-border/50">
                  <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <TrendingUp size={12} className="text-muted-foreground" />
                    Pipeline
                  </h3>
                </div>
                <div className="p-3.5 space-y-1.5">
                  {(["new", "appel", "followup1", "followup2", "promis"] as LeadStatus[]).map((s) => {
                    const cfg = STATUS_CONFIG[s];
                    const isActive = lead.status === s;
                    const order = ["new", "appel", "followup1", "followup2", "promis"];
                    const isPast = order.indexOf(s) < order.indexOf(lead.status) && lead.status !== "lost";
                    return (
                      <div
                        key={s}
                        className={cn(
                          "flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all cursor-pointer text-xs",
                          isActive ? cn(cfg.badgeBg, cfg.badgeText, "font-semibold") : "text-muted-foreground hover:bg-muted"
                        )}
                        onClick={() => changeStatus(s)}
                      >
                        <span
                          className={cn(
                            "w-2 h-2 rounded-full flex-shrink-0",
                            isActive ? "" : isPast ? "opacity-40" : "opacity-20"
                          )}
                          style={{ background: cfg.dot }}
                        />
                        {cfg.label}
                        {isPast && <CheckCircle2 size={11} className="ml-auto text-muted-foreground opacity-60" />}
                        {isActive && <span className="ml-auto text-[10px] font-semibold opacity-80">Actuel</span>}
                      </div>
                    );
                  })}
                  {/* Lost */}
                  <div
                    className={cn(
                      "flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all cursor-pointer text-xs mt-1 border-t border-border/40 pt-2",
                      lead.status === "lost"
                        ? cn(STATUS_CONFIG.lost.badgeBg, STATUS_CONFIG.lost.badgeText, "font-semibold")
                        : "text-muted-foreground hover:bg-muted"
                    )}
                    onClick={() => changeStatus("lost")}
                  >
                    <span
                      className={cn("w-2 h-2 rounded-full flex-shrink-0", lead.status !== "lost" && "opacity-20")}
                      style={{ background: STATUS_CONFIG.lost.dot }}
                    />
                    Lost
                    {lead.status === "lost" && <XCircle size={11} className="ml-auto" />}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <AddCallModal open={addCallOpen} onClose={() => setAddCallOpen(false)} onAdd={(c) => setCalls((p) => [c, ...p])} />
      <ConvertModal open={convertOpen} onClose={() => setConvertOpen(false)} lead={lead} />
    </div>
  );
}