import { useState, useMemo } from "react";
import {
  CalendarDays, Clock, Users, Plus, X, MapPin, Target,
  CheckCircle2, XCircle, AlertCircle, ChevronDown, ChevronRight,
  Building2, Search, SlidersHorizontal, FileText, Send,
  UserPlus, Trash2, Eye, Bell, Check,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import {
  INITIAL_MEETINGS, ALL_EMPLOYEES, DEPARTMENTS,
  Meeting, MeetingParticipant, InviteStatus, getMeetingStatus,
} from "./reunions.data";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CFG = {
  today:    { label: "Aujourd'hui", color: "bg-primary text-primary-foreground" },
  upcoming: { label: "À venir",     color: "bg-blue-100 text-blue-700 border-blue-200" },
  past:     { label: "Passée",      color: "bg-muted text-muted-foreground" },
};

const INVITE_CFG: Record<InviteStatus, { label: string; icon: typeof Check; color: string; bg: string }> = {
  accepted: { label: "Accepté",    icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
  declined: { label: "Refusé",     icon: XCircle,      color: "text-red-600",     bg: "bg-red-50 border-red-200" },
  pending:  { label: "En attente", icon: AlertCircle,  color: "text-amber-600",   bg: "bg-amber-50 border-amber-200" },
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}
function fmtShort(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

// ─── Decline Modal ────────────────────────────────────────────────────────────
function DeclineModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (reason: string) => void }) {
  const [reason, setReason] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border rounded-2xl shadow-2xl w-full max-w-sm animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div className="flex items-center gap-2">
            <XCircle size={16} className="text-red-500" />
            <h2 className="font-semibold text-sm">Motif de refus</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-accent text-muted-foreground"><X size={15} /></button>
        </div>
        <div className="p-5 space-y-3">
          <p className="text-xs text-muted-foreground">Veuillez indiquer la raison de votre indisponibilité :</p>
          <textarea
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="Ex: Déplacement professionnel, congé médical..."
            className="w-full min-h-[90px] text-sm border rounded-lg px-3 py-2 bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex gap-2 px-5 pb-5">
          <button onClick={onClose} className="flex-1 py-2 text-sm rounded-lg border hover:bg-accent text-muted-foreground transition-colors">Annuler</button>
          <button
            onClick={() => { if (reason.trim()) { onSubmit(reason); onClose(); } }}
            disabled={!reason.trim()}
            className="flex-1 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 font-medium transition-colors disabled:opacity-50"
          >
            Confirmer le refus
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Create Meeting Modal ─────────────────────────────────────────────────────
function CreateMeetingModal({ onClose, onAdd }: {
  onClose: () => void;
  onAdd: (m: Omit<Meeting, "id" | "createdBy">) => void;
}) {
  const [form, setForm] = useState({
    title: "", date: "", timeStart: "", timeEnd: "",
    department: "", objective: "", location: "", notes: "",
  });
  const [inviteMode, setInviteMode] = useState<"all" | "dept" | "individual">("individual");
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const [err, setErr] = useState("");

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const toggleEmployee = (id: number) =>
    setSelectedEmployees(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const filteredEmployees = inviteMode === "dept" && selectedDept
    ? ALL_EMPLOYEES.filter(e => e.department === selectedDept)
    : ALL_EMPLOYEES;

  const submit = () => {
    if (!form.title.trim()) return setErr("Le titre est requis");
    if (!form.date) return setErr("La date est requise");
    if (!form.timeStart || !form.timeEnd) return setErr("Les horaires sont requis");
    if (!form.objective.trim()) return setErr("L'objectif est requis");

    let parts: MeetingParticipant[] = [];
    if (inviteMode === "all") {
      parts = ALL_EMPLOYEES.map(e => ({ ...e, status: "pending" as InviteStatus }));
    } else if (inviteMode === "dept" && selectedDept) {
      parts = ALL_EMPLOYEES.filter(e => e.department === selectedDept)
        .map(e => ({ ...e, status: "pending" as InviteStatus }));
    } else {
      parts = ALL_EMPLOYEES.filter(e => selectedEmployees.includes(e.id))
        .map(e => ({ ...e, status: "pending" as InviteStatus }));
    }
    if (parts.length === 0) return setErr("Sélectionnez au moins un participant");

    onAdd({ ...form, participants: parts });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10"><CalendarDays size={17} className="text-primary" /></div>
            <div>
              <h2 className="font-semibold text-base">Nouvelle réunion</h2>
              <p className="text-xs text-muted-foreground">Créer et envoyer les invitations</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground"><X size={16} /></button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
          {err && <p className="text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-lg">{err}</p>}

          {/* Basic info */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Informations</h3>
            <F label="Titre de la réunion">
              <Input placeholder="Ex: Revue mensuelle — Commercial" value={form.title}
                onChange={e => set("title", e.target.value)} className="h-9 text-sm" />
            </F>
            <div className="grid grid-cols-3 gap-3">
              <F label="Date">
                <Input type="date" value={form.date} onChange={e => set("date", e.target.value)} className="h-9 text-sm" />
              </F>
              <F label="Début">
                <Input type="time" value={form.timeStart} onChange={e => set("timeStart", e.target.value)} className="h-9 text-sm" />
              </F>
              <F label="Fin">
                <Input type="time" value={form.timeEnd} onChange={e => set("timeEnd", e.target.value)} className="h-9 text-sm" />
              </F>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <F label="Département organisateur">
                <Select value={form.department} onValueChange={v => set("department", v)}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                  <SelectContent>{DEPARTMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                </Select>
              </F>
              <F label="Lieu">
                <Input placeholder="Salle, lien visio..." value={form.location}
                  onChange={e => set("location", e.target.value)} className="h-9 text-sm" />
              </F>
            </div>
            <F label="Objectif de la réunion">
              <textarea value={form.objective} onChange={e => set("objective", e.target.value)}
                placeholder="Décrivez l'objectif principal..."
                className="w-full min-h-[72px] text-sm border rounded-lg px-3 py-2 bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring" />
            </F>
            <F label="Notes & ordre du jour (optionnel)">
              <textarea value={form.notes} onChange={e => set("notes", e.target.value)}
                placeholder="Points à aborder, documents à préparer..."
                className="w-full min-h-[60px] text-sm border rounded-lg px-3 py-2 bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring" />
            </F>
          </div>

          {/* Invitations */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Invitations</h3>

            {/* Mode selector */}
            <div className="flex gap-2">
              {([
                { key: "all", label: "Tous les employés" },
                { key: "dept", label: "Par département" },
                { key: "individual", label: "Individuel" },
              ] as const).map(m => (
                <button key={m.key} onClick={() => setInviteMode(m.key)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
                    inviteMode === m.key
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border hover:border-primary/40 text-muted-foreground hover:text-foreground"
                  }`}>
                  {m.label}
                </button>
              ))}
            </div>

            {/* Dept filter */}
            {inviteMode === "dept" && (
              <Select value={selectedDept} onValueChange={setSelectedDept}>
                <SelectTrigger className="h-9 text-sm w-[220px]"><SelectValue placeholder="Choisir un département" /></SelectTrigger>
                <SelectContent>{DEPARTMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
            )}

            {/* All mode summary */}
            {inviteMode === "all" && (
              <div className="flex items-center gap-2 px-3 py-2.5 bg-primary/5 border border-primary/20 rounded-lg text-sm text-primary">
                <Send size={14} />
                Invitation envoyée à tous les {ALL_EMPLOYEES.length} employés
              </div>
            )}

            {/* Employee grid */}
            {inviteMode !== "all" && (
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                {filteredEmployees.map(e => {
                  const selected = inviteMode === "dept"
                    ? (selectedDept ? e.department === selectedDept : false)
                    : selectedEmployees.includes(e.id);
                  return (
                    <button key={e.id}
                      onClick={() => inviteMode === "individual" && toggleEmployee(e.id)}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                        selected
                          ? "bg-primary/5 border-primary/30 text-foreground"
                          : "border-border hover:border-primary/20 text-muted-foreground hover:text-foreground"
                      } ${inviteMode === "dept" ? "cursor-default" : "cursor-pointer"}`}
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}>{e.initials}</div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium truncate">{e.name.split(" ")[0]} {e.name.split(" ")[1]}</p>
                        <p className="text-[10px] opacity-60 truncate">{e.department}</p>
                      </div>
                      {selected && <Check size={13} className="text-primary ml-auto shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Selected count */}
            {inviteMode === "individual" && selectedEmployees.length > 0 && (
              <p className="text-xs text-primary font-medium">{selectedEmployees.length} participant{selectedEmployees.length > 1 ? "s" : ""} sélectionné{selectedEmployees.length > 1 ? "s" : ""}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-muted/30 shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-lg border hover:bg-accent text-muted-foreground transition-colors">Annuler</button>
          <button onClick={submit}
            className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-colors">
            <Send size={14} />
            Créer et envoyer les invitations
          </button>
        </div>
      </div>
    </div>
  );
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}

// ─── Meeting Card ─────────────────────────────────────────────────────────────
function MeetingCard({ meeting, isAdmin, currentUserId, onAccept, onDecline, onDelete }: {
  meeting: Meeting;
  isAdmin: boolean;
  currentUserId: number;
  onAccept: (meetingId: number) => void;
  onDecline: (meetingId: number, reason: string) => void;
  onDelete: (meetingId: number) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [showDecline, setShowDecline] = useState(false);
  const status = getMeetingStatus(meeting.date);
  const stCfg = STATUS_CFG[status];

  const myParticipation = meeting.participants.find(p => p.id === currentUserId);
  const accepted = meeting.participants.filter(p => p.status === "accepted").length;
  const declined = meeting.participants.filter(p => p.status === "declined").length;
  const pending  = meeting.participants.filter(p => p.status === "pending").length;

  return (
    <>
      <div className={`bg-card rounded-2xl border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${
        status === "today" ? "border-primary/30 ring-1 ring-primary/10" : ""
      }`}>
        {/* Status stripe */}
        <div className={`h-1 w-full ${
          status === "today" ? "bg-primary" : status === "upcoming" ? "bg-blue-400" : "bg-muted"
        }`} />

        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className={`p-2.5 rounded-xl shrink-0 ${
                status === "today" ? "bg-primary/10" : "bg-muted"
              }`}>
                <CalendarDays size={18} className={status === "today" ? "text-primary" : "text-muted-foreground"} />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-foreground leading-tight">{meeting.title}</h3>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Building2 size={11} />{meeting.department}
                  </span>
                  {meeting.location && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin size={11} />{meeting.location}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${stCfg.color}`}>{stCfg.label}</span>
              {isAdmin && status !== "past" && (
                <button onClick={() => onDelete(meeting.id)}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors">
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Time & stats row */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3 flex-wrap">
            <span className="flex items-center gap-1.5 font-medium text-foreground">
              <CalendarDays size={14} className="text-primary" />
              {fmtShort(meeting.date)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {meeting.timeStart} – {meeting.timeEnd}
            </span>
            <span className="flex items-center gap-1.5">
              <Users size={14} />
              {meeting.participants.length} invité{meeting.participants.length > 1 ? "s" : ""}
            </span>
          </div>

          {/* Objective */}
          <div className="flex items-start gap-2 bg-muted/40 rounded-lg px-3 py-2 mb-3">
            <Target size={13} className="text-primary mt-0.5 shrink-0" />
            <p className="text-xs text-foreground">{meeting.objective}</p>
          </div>

          {/* Participation summary (admin) */}
          {isAdmin && (
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                <CheckCircle2 size={11} />{accepted} accepté{accepted > 1 ? "s" : ""}
              </div>
              {declined > 0 && (
                <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full">
                  <XCircle size={11} />{declined} refus
                </div>
              )}
              {pending > 0 && (
                <div className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                  <AlertCircle size={11} />{pending} en attente
                </div>
              )}
            </div>
          )}

          {/* Employee: my status + action buttons */}
          {!isAdmin && myParticipation && status !== "past" && (
            <div className="flex items-center gap-3 mb-3">
              <div className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border ${INVITE_CFG[myParticipation.status].bg} ${INVITE_CFG[myParticipation.status].color}`}>
                {myParticipation.status === "accepted" && <CheckCircle2 size={12} />}
                {myParticipation.status === "declined" && <XCircle size={12} />}
                {myParticipation.status === "pending"  && <AlertCircle size={12} />}
                {INVITE_CFG[myParticipation.status].label}
              </div>
              {myParticipation.status === "pending" && (
                <div className="flex gap-2">
                  <button onClick={() => onAccept(meeting.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-medium hover:bg-emerald-600 transition-colors">
                    <CheckCircle2 size={13} /> Accepter
                  </button>
                  <button onClick={() => setShowDecline(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 bg-red-50 text-xs font-medium hover:bg-red-100 transition-colors">
                    <XCircle size={13} /> Refuser
                  </button>
                </div>
              )}
              {myParticipation.status === "declined" && myParticipation.declineReason && (
                <span className="text-xs text-muted-foreground italic">"{myParticipation.declineReason}"</span>
              )}
            </div>
          )}

          {/* Expand toggle */}
          <button onClick={() => setExpanded(p => !p)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mt-1">
            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            {expanded ? "Masquer les détails" : "Voir les participants & détails"}
          </button>
        </div>

        {/* Expanded section */}
        {expanded && (
          <div className="border-t px-5 py-4 bg-muted/20 space-y-4">
            {/* Notes */}
            {meeting.notes && (
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                  <FileText size={12} /> Ordre du jour
                </p>
                <p className="text-xs text-foreground bg-background border rounded-lg px-3 py-2">{meeting.notes}</p>
              </div>
            )}

            {/* Participants */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                <Users size={12} /> Participants ({meeting.participants.length})
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {meeting.participants.map(p => {
                  const inv = INVITE_CFG[p.status];
                  return (
                    <div key={p.id} className={`flex items-center gap-2.5 p-2.5 rounded-xl border ${inv.bg}`}>
                      <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0">
                        {p.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{p.name}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{p.department}</p>
                        {p.declineReason && (
                          <p className="text-[10px] text-red-500 italic truncate mt-0.5">"{p.declineReason}"</p>
                        )}
                      </div>
                      <inv.icon size={14} className={`${inv.color} shrink-0`} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {showDecline && (
        <DeclineModal
          onClose={() => setShowDecline(false)}
          onSubmit={reason => onDecline(meeting.id, reason)}
        />
      )}
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Reunions() {
  const { isAdmin } = useAuth();
  // Demo: logged-in employee = id 5 (Youssef El Amrani)
  const currentUserId = 5;

  const [meetings, setMeetings] = useState<Meeting[]>(INITIAL_MEETINGS);
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDept, setFilterDept] = useState("all");

  const filtered = useMemo(() => {
    let list = meetings;
    if (!isAdmin) list = list.filter(m => m.participants.some(p => p.id === currentUserId));
    if (search) list = list.filter(m =>
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.department.toLowerCase().includes(search.toLowerCase())
    );
    if (filterStatus !== "all") list = list.filter(m => getMeetingStatus(m.date) === filterStatus);
    if (filterDept !== "all") list = list.filter(m => m.department === filterDept);
    return list.sort((a, b) => b.date.localeCompare(a.date));
  }, [meetings, search, filterStatus, filterDept, isAdmin]);

  const stats = useMemo(() => ({
    today:    meetings.filter(m => getMeetingStatus(m.date) === "today").length,
    upcoming: meetings.filter(m => getMeetingStatus(m.date) === "upcoming").length,
    past:     meetings.filter(m => getMeetingStatus(m.date) === "past").length,
    pending:  meetings.reduce((acc, m) => acc + m.participants.filter(p => p.status === "pending").length, 0),
  }), [meetings]);

  const handleAdd = (m: Omit<Meeting, "id" | "createdBy">) => {
    setMeetings(prev => [...prev, { ...m, id: Date.now(), createdBy: "Admin" }]);
  };

  const handleAccept = (meetingId: number) => {
    setMeetings(prev => prev.map(m =>
      m.id === meetingId
        ? { ...m, participants: m.participants.map(p => p.id === currentUserId ? { ...p, status: "accepted" as const } : p) }
        : m
    ));
  };

  const handleDecline = (meetingId: number, reason: string) => {
    setMeetings(prev => prev.map(m =>
      m.id === meetingId
        ? { ...m, participants: m.participants.map(p => p.id === currentUserId ? { ...p, status: "declined" as const, declineReason: reason } : p) }
        : m
    ));
  };

  const handleDelete = (meetingId: number) => {
    setMeetings(prev => prev.filter(m => m.id !== meetingId));
  };

  const depts = [...new Set(meetings.map(m => m.department))];

  return (
    <div className="space-y-5 fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {isAdmin ? "Gestion des Réunions" : "Mes Réunions"}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {filtered.length} réunion{filtered.length > 1 ? "s" : ""} affichée{filtered.length > 1 ? "s" : ""}
          </p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
            <Plus size={15} /> Nouvelle réunion
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Aujourd'hui", value: stats.today,    color: "text-primary",      bg: "bg-primary/5 border-primary/20" },
          { label: "À venir",     value: stats.upcoming, color: "text-blue-600",     bg: "bg-blue-50 border-blue-200" },
          { label: "Passées",     value: stats.past,     color: "text-muted-foreground", bg: "bg-muted border-border" },
          { label: "Invit. en attente", value: stats.pending, color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
        ].map(s => (
          <div key={s.label} className={`border rounded-xl p-3.5 flex items-center gap-3 ${s.bg}`}>
            <span className={`text-2xl font-bold ${s.color}`}>{s.value}</span>
            <p className={`text-xs font-medium ${s.color}`}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="h-9 w-[155px] text-sm">
            <SlidersHorizontal size={13} className="mr-1 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous statuts</SelectItem>
            <SelectItem value="today">Aujourd'hui</SelectItem>
            <SelectItem value="upcoming">À venir</SelectItem>
            <SelectItem value="past">Passées</SelectItem>
          </SelectContent>
        </Select>
        {isAdmin && (
          <Select value={filterDept} onValueChange={setFilterDept}>
            <SelectTrigger className="h-9 w-[165px] text-sm">
              <Building2 size={13} className="mr-1 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous dépts</SelectItem>
              {depts.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <CalendarDays size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Aucune réunion trouvée</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(m => (
            <MeetingCard
              key={m.id}
              meeting={m}
              isAdmin={isAdmin}
              currentUserId={currentUserId}
              onAccept={handleAccept}
              onDecline={handleDecline}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {showCreate && <CreateMeetingModal onClose={() => setShowCreate(false)} onAdd={handleAdd} />}
    </div>
  );
}