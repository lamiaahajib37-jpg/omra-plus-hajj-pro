import { useState, useMemo, useRef } from "react";
import {
  Plus, Search, GripVertical,
  Flag, User, FolderOpen, Calendar, X, CheckCircle2,
  Circle, Clock, Edit2, Trash2, MessageSquare, Send,
  AlertCircle, ChevronRight, Activity, Save,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";

// ─── Types ───────────────────────────────────────────────────────────────────

type Priority = "Haute" | "Moyenne" | "Basse";
type Status = "todo" | "progress" | "done";

interface Comment {
  id: number;
  author: string;
  authorInitials: string;
  text: string;
  createdAt: string;
}

interface ActivityEntry {
  id: number;
  text: string;
  timestamp: string;
}

interface Task {
  id: number;
  title: string;
  assignee: string;
  assigneeInitials: string;
  dossier?: string;
  priority: Priority;
  status: Status;
  dueDate?: string;
  description?: string;
  comments: Comment[];
  activity: ActivityEntry[];
  createdAt: string;
}

// ─── Initial data ─────────────────────────────────────────────────────────────

const now = new Date().toISOString();

const INITIAL_TASKS: Task[] = [
  {
    id: 1, title: "Préparer dossier visa Groupe Hajj Avril",
    assignee: "Fatima Zahra", assigneeInitials: "FZ",
    dossier: "Dossier Hajj #042", priority: "Haute", status: "todo",
    dueDate: "2026-04-10",
    description: "Rassembler tous les documents requis pour le visa groupe : passeports, photos, formulaires consulaires et justificatifs de résidence.",
    comments: [
      { id: 1, author: "Karim Tazi", authorInitials: "KT", text: "J'ai déjà les passeports de 12 pèlerins, il en manque 3.", createdAt: "2026-04-01T09:30:00" },
    ],
    activity: [
      { id: 1, text: "Tâche créée", timestamp: "2026-03-28T08:00:00" },
      { id: 2, text: "Priorité changée en Haute", timestamp: "2026-03-29T10:15:00" },
    ],
    createdAt: "2026-03-28T08:00:00",
  },
  {
    id: 2, title: "Relancer fournisseur hôtel Medina",
    assignee: "Karim Tazi", assigneeInitials: "KT",
    priority: "Moyenne", status: "todo", dueDate: "2026-04-05",
    description: "Contacter l'hôtel Al Shohada pour confirmation des chambres réservées pour le groupe Hajj de mai.",
    comments: [], activity: [{ id: 1, text: "Tâche créée", timestamp: "2026-03-30T09:00:00" }],
    createdAt: "2026-03-30T09:00:00",
  },
  {
    id: 3, title: "Créer campagne Omra Ramadan",
    assignee: "Amina Chraibi", assigneeInitials: "AC",
    priority: "Haute", status: "todo", dueDate: "2026-04-08",
    comments: [], activity: [{ id: 1, text: "Tâche créée", timestamp: "2026-03-31T11:00:00" }],
    createdAt: "2026-03-31T11:00:00",
  },
  {
    id: 4, title: "Vérifier assurances pèlerins Mars",
    assignee: "Nadia Berrada", assigneeInitials: "NB",
    dossier: "Dossier Omra #038", priority: "Haute", status: "progress", dueDate: "2026-04-03",
    description: "Vérifier que toutes les polices d'assurance voyage sont valides et couvrent bien la période du séjour.",
    comments: [
      { id: 1, author: "Nadia Berrada", authorInitials: "NB", text: "10 sur 15 assurances vérifiées, les 5 restantes sont en attente.", createdAt: "2026-04-02T14:00:00" },
    ],
    activity: [
      { id: 1, text: "Tâche créée", timestamp: "2026-03-25T08:00:00" },
      { id: 2, text: "Statut changé : À faire → En cours", timestamp: "2026-04-01T09:00:00" },
    ],
    createdAt: "2026-03-25T08:00:00",
  },
  {
    id: 5, title: "Mettre à jour tarifs été 2026",
    assignee: "Youssef El Amrani", assigneeInitials: "YE",
    priority: "Moyenne", status: "progress", dueDate: "2026-04-15",
    comments: [], activity: [{ id: 1, text: "Tâche créée", timestamp: "2026-04-01T10:00:00" }],
    createdAt: "2026-04-01T10:00:00",
  },
  {
    id: 6, title: "Facturation Groupe Tourisme Fès",
    assignee: "Hassan Ouazzani", assigneeInitials: "HO",
    dossier: "Dossier #035", priority: "Basse", status: "done",
    description: "Émettre et envoyer les factures finales au groupe de tourisme de Fès.",
    comments: [], activity: [
      { id: 1, text: "Tâche créée", timestamp: "2026-03-20T08:00:00" },
      { id: 2, text: "Statut changé : En cours → Terminé", timestamp: "2026-03-27T16:00:00" },
    ],
    createdAt: "2026-03-20T08:00:00",
  },
  {
    id: 7, title: "Formation nouvelles recrues",
    assignee: "Youssef El Amrani", assigneeInitials: "YE",
    priority: "Moyenne", status: "done",
    comments: [], activity: [{ id: 1, text: "Tâche créée", timestamp: "2026-03-22T08:00:00" }, { id: 2, text: "Statut changé : En cours → Terminé", timestamp: "2026-03-30T17:00:00" }],
    createdAt: "2026-03-22T08:00:00",
  },
  {
    id: 8, title: "Négociation contrat transport aéroport",
    assignee: "Karim Tazi", assigneeInitials: "KT",
    priority: "Haute", status: "todo", dueDate: "2026-04-12",
    description: "Négocier les tarifs avec les sociétés de transport pour les transferts aéroport – hôtel de la saison été.",
    comments: [], activity: [{ id: 1, text: "Tâche créée", timestamp: "2026-04-02T08:00:00" }],
    createdAt: "2026-04-02T08:00:00",
  },
];

const EMPLOYEES = [
  "Fatima Zahra", "Karim Tazi", "Amina Chraibi",
  "Nadia Berrada", "Youssef El Amrani", "Hassan Ouazzani",
];

const COLUMNS: { title: string; status: Status }[] = [
  { title: "À faire", status: "todo" },
  { title: "En cours", status: "progress" },
  { title: "Terminé", status: "done" },
];

const PRIORITY_CONFIG: Record<Priority, { color: string; dot: string; label: string }> = {
  Haute:   { color: "bg-red-100 text-red-700 border-red-200",      dot: "bg-red-500",   label: "Haute" },
  Moyenne: { color: "bg-amber-100 text-amber-700 border-amber-200", dot: "bg-amber-500", label: "Moyenne" },
  Basse:   { color: "bg-slate-100 text-slate-600 border-slate-200", dot: "bg-slate-400", label: "Basse" },
};

const COL_CONFIG: Record<Status, { header: string; border: string; bg: string; icon: string }> = {
  todo:     { header: "bg-slate-100 border-slate-200",    border: "border-t-slate-400",   bg: "bg-slate-50/60",   icon: "text-slate-500" },
  progress: { header: "bg-blue-50 border-blue-200",       border: "border-t-blue-500",    bg: "bg-blue-50/30",    icon: "text-blue-600" },
  done:     { header: "bg-emerald-50 border-emerald-200", border: "border-t-emerald-500", bg: "bg-emerald-50/30", icon: "text-emerald-600" },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}
function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}
function initials(name: string) {
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

// ─── Add Task Modal ───────────────────────────────────────────────────────────

function AddTaskModal({ onClose, onAdd, defaultStatus }: {
  onClose: () => void;
  onAdd: (t: Omit<Task, "id" | "comments" | "activity" | "createdAt">) => void;
  defaultStatus: Status;
}) {
  const [form, setForm] = useState({
    title: "", assignee: "", dossier: "", priority: "Moyenne" as Priority,
    status: defaultStatus, dueDate: "", description: "",
  });
  const [err, setErr] = useState("");
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const submit = () => {
    if (!form.title.trim()) { setErr("Le titre est requis"); return; }
    if (!form.assignee) { setErr("L'assigné est requis"); return; }
    onAdd({ ...form, assigneeInitials: initials(form.assignee) });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="font-semibold text-base">Nouvelle tâche</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground"><X size={15} /></button>
        </div>
        <div className="px-5 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
          {err && <p className="text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-lg">{err}</p>}
          <F label="Titre"><Input placeholder="Titre de la tâche..." value={form.title} onChange={e => set("title", e.target.value)} className="h-9 text-sm" /></F>
          <F label="Assigné à">
            <Select value={form.assignee} onValueChange={v => set("assignee", v)}>
              <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Choisir un employé" /></SelectTrigger>
              <SelectContent>{EMPLOYEES.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
            </Select>
          </F>
          <div className="grid grid-cols-2 gap-3">
            <F label="Priorité">
              <Select value={form.priority} onValueChange={v => set("priority", v as Priority)}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>{(["Haute", "Moyenne", "Basse"] as Priority[]).map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
              </Select>
            </F>
            <F label="Statut">
              <Select value={form.status} onValueChange={v => set("status", v as Status)}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">À faire</SelectItem>
                  <SelectItem value="progress">En cours</SelectItem>
                  <SelectItem value="done">Terminé</SelectItem>
                </SelectContent>
              </Select>
            </F>
          </div>
          <F label="Dossier lié (optionnel)"><Input placeholder="Ex: Dossier Hajj #042" value={form.dossier} onChange={e => set("dossier", e.target.value)} className="h-9 text-sm" /></F>
          <F label="Date d'échéance (optionnel)"><Input type="date" value={form.dueDate} onChange={e => set("dueDate", e.target.value)} className="h-9 text-sm" /></F>
          <F label="Description (optionnel)">
            <textarea placeholder="Détails de la tâche..." value={form.description} onChange={e => set("description", e.target.value)}
              className="w-full min-h-[72px] text-sm border rounded-lg px-3 py-2 bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring" />
          </F>
        </div>
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t bg-muted/30">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-lg border hover:bg-accent text-muted-foreground transition-colors">Annuler</button>
          <button onClick={submit} className="px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-colors">Créer la tâche</button>
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

// ─── Task Detail / Edit Modal ─────────────────────────────────────────────────

function TaskDetailModal({ task, onClose, onUpdate, onDelete, currentUser, isAdmin }: {
  task: Task;
  onClose: () => void;
  onUpdate: (updated: Task) => void;
  onDelete: (id: number) => void;
  currentUser: string;
  isAdmin: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: task.title,
    assignee: task.assignee,
    priority: task.priority,
    status: task.status,
    dossier: task.dossier ?? "",
    dueDate: task.dueDate ?? "",
    description: task.description ?? "",
  });
  const [commentText, setCommentText] = useState("");
  const [activeTab, setActiveTab] = useState<"details" | "comments" | "activity">("details");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const setE = (k: string, v: string) => setEditForm(p => ({ ...p, [k]: v }));

  const statusLabel: Record<Status, string> = { todo: "À faire", progress: "En cours", done: "Terminé" };
  const pri = PRIORITY_CONFIG[task.priority];
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "done";

  const saveEdit = () => {
    const newActivity: ActivityEntry[] = [...task.activity];
    if (editForm.status !== task.status) {
      newActivity.push({ id: Date.now(), text: `Statut changé : ${statusLabel[task.status]} → ${statusLabel[editForm.status as Status]}`, timestamp: new Date().toISOString() });
    }
    if (editForm.priority !== task.priority) {
      newActivity.push({ id: Date.now() + 1, text: `Priorité changée : ${task.priority} → ${editForm.priority}`, timestamp: new Date().toISOString() });
    }
    onUpdate({
      ...task,
      ...editForm,
      priority: editForm.priority as Priority,
      status: editForm.status as Status,
      assigneeInitials: initials(editForm.assignee),
      activity: newActivity,
    });
    setEditing(false);
  };

  const addComment = () => {
    if (!commentText.trim()) return;
    const newComment: Comment = {
      id: Date.now(),
      author: currentUser,
      authorInitials: initials(currentUser),
      text: commentText.trim(),
      createdAt: new Date().toISOString(),
    };
    onUpdate({
      ...task,
      comments: [...task.comments, newComment],
      activity: [...task.activity, { id: Date.now() + 1, text: `Commentaire ajouté par ${currentUser}`, timestamp: new Date().toISOString() }],
    });
    setCommentText("");
  };

  const handleDelete = () => {
    onDelete(task.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">

        {/* ── Header ── */}
        <div className="flex items-start gap-3 px-6 py-4 border-b">
          <div className="flex-1 min-w-0">
            {editing ? (
              <Input value={editForm.title} onChange={e => setE("title", e.target.value)}
                className="text-base font-semibold h-9" autoFocus />
            ) : (
              <h2 className="text-base font-semibold text-card-foreground leading-snug">{task.title}</h2>
            )}
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${pri.color}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${pri.dot}`} />{task.priority}
              </span>
              <span className="text-xs text-muted-foreground">{statusLabel[task.status]}</span>
              {task.dossier && (
                <span className="flex items-center gap-1 text-xs text-primary font-medium">
                  <FolderOpen size={11} />{task.dossier}
                </span>
              )}
              {isOverdue && (
                <span className="flex items-center gap-1 text-xs text-red-600 font-medium">
                  <AlertCircle size={11} />En retard
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {isAdmin && !editing && (
              <>
                <button onClick={() => setEditing(true)} className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors" title="Modifier">
                  <Edit2 size={15} />
                </button>
                <button onClick={() => setConfirmDelete(true)} className="p-2 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors" title="Supprimer">
                  <Trash2 size={15} />
                </button>
              </>
            )}
            {editing && (
              <>
                <button onClick={saveEdit} className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-colors">
                  <Save size={13} />Sauvegarder
                </button>
                <button onClick={() => setEditing(false)} className="p-2 rounded-lg hover:bg-accent text-muted-foreground transition-colors">
                  <X size={15} />
                </button>
              </>
            )}
            {!editing && (
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-accent text-muted-foreground transition-colors">
                <X size={15} />
              </button>
            )}
          </div>
        </div>

        {/* ── Delete confirm ── */}
        {confirmDelete && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <AlertCircle size={16} className="text-red-600 shrink-0" />
            <p className="text-sm text-red-700 flex-1">Supprimer cette tâche définitivement ?</p>
            <button onClick={handleDelete} className="px-3 py-1.5 text-xs rounded-lg bg-red-600 text-white hover:bg-red-700 font-medium transition-colors">Supprimer</button>
            <button onClick={() => setConfirmDelete(false)} className="px-3 py-1.5 text-xs rounded-lg border hover:bg-accent text-muted-foreground transition-colors">Annuler</button>
          </div>
        )}

        {/* ── Tabs ── */}
        <div className="flex border-b px-6">
          {([
            { key: "details",   label: "Détails",    icon: ChevronRight },
            { key: "comments",  label: `Commentaires (${task.comments.length})`, icon: MessageSquare },
            { key: "activity",  label: "Activité",   icon: Activity },
          ] as const).map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}>
              <tab.icon size={13} />{tab.label}
            </button>
          ))}
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5">

          {/* Details tab */}
          {activeTab === "details" && (
            <div className="space-y-5">
              {editing ? (
                <div className="grid grid-cols-2 gap-4">
                  <F label="Assigné à">
                    <Select value={editForm.assignee} onValueChange={v => setE("assignee", v)}>
                      <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>{EMPLOYEES.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
                    </Select>
                  </F>
                  <F label="Priorité">
                    <Select value={editForm.priority} onValueChange={v => setE("priority", v)}>
                      <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>{(["Haute", "Moyenne", "Basse"] as Priority[]).map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                    </Select>
                  </F>
                  <F label="Statut">
                    <Select value={editForm.status} onValueChange={v => setE("status", v)}>
                      <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">À faire</SelectItem>
                        <SelectItem value="progress">En cours</SelectItem>
                        <SelectItem value="done">Terminé</SelectItem>
                      </SelectContent>
                    </Select>
                  </F>
                  <F label="Date d'échéance">
                    <Input type="date" value={editForm.dueDate} onChange={e => setE("dueDate", e.target.value)} className="h-9 text-sm" />
                  </F>
                  <F label="Dossier lié" >
                    <Input placeholder="Dossier #..." value={editForm.dossier} onChange={e => setE("dossier", e.target.value)} className="h-9 text-sm" />
                  </F>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  {[
                    { label: "Assigné à", value: task.assignee, icon: User },
                    { label: "Priorité",  value: task.priority,  icon: Flag },
                    { label: "Statut",    value: statusLabel[task.status], icon: Circle },
                    { label: "Dossier",   value: task.dossier ?? "—", icon: FolderOpen },
                    { label: "Échéance",  value: task.dueDate ? fmtDate(task.dueDate) : "—", icon: Calendar },
                    { label: "Créé le",   value: fmtDate(task.createdAt), icon: Clock },
                  ].map(item => (
                    <div key={item.label} className="flex items-start gap-2.5">
                      <item.icon size={14} className="text-muted-foreground mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">{item.label}</p>
                        <p className="text-sm font-medium text-foreground">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Description */}
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1.5">Description</p>
                {editing ? (
                  <textarea value={editForm.description} onChange={e => setE("description", e.target.value)}
                    className="w-full min-h-[100px] text-sm border rounded-lg px-3 py-2 bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Ajouter une description..." />
                ) : (
                  <p className="text-sm text-foreground leading-relaxed bg-muted/40 rounded-lg px-3 py-2.5 min-h-[60px]">
                    {task.description || <span className="text-muted-foreground italic">Aucune description.</span>}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Comments tab */}
          {activeTab === "comments" && (
            <div className="space-y-4">
              {task.comments.length === 0 && (
                <div className="flex flex-col items-center py-10 text-muted-foreground/50">
                  <MessageSquare size={28} className="mb-2 opacity-30" />
                  <p className="text-xs">Aucun commentaire</p>
                </div>
              )}
              {task.comments.map(c => (
                <div key={c.id} className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-[10px] font-bold shrink-0">
                    {c.authorInitials}
                  </div>
                  <div className="flex-1 bg-muted/40 rounded-xl px-3 py-2.5">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-foreground">{c.author}</span>
                      <span className="text-[10px] text-muted-foreground">{fmtDateTime(c.createdAt)}</span>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">{c.text}</p>
                  </div>
                </div>
              ))}

              {/* Add comment input */}
              <div className="flex gap-2 pt-2 border-t">
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-[10px] font-bold shrink-0">
                  {initials(currentUser)}
                </div>
                <div className="flex-1 flex gap-2">
                  <Input value={commentText} onChange={e => setCommentText(e.target.value)}
                    placeholder="Ajouter un commentaire..."
                    className="h-9 text-sm flex-1"
                    onKeyDown={e => e.key === "Enter" && addComment()} />
                  <button onClick={addComment} disabled={!commentText.trim()}
                    className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 transition-colors">
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Activity tab */}
          {activeTab === "activity" && (
            <div className="space-y-3">
              {task.activity.length === 0 && (
                <div className="flex flex-col items-center py-10 text-muted-foreground/50">
                  <Activity size={28} className="mb-2 opacity-30" />
                  <p className="text-xs">Aucune activité</p>
                </div>
              )}
              {[...task.activity].reverse().map(a => (
                <div key={a.id} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <div>
                    <p className="text-sm text-foreground">{a.text}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{fmtDateTime(a.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Task Card ────────────────────────────────────────────────────────────────

function TaskCard({ task, onDragStart, isAdmin, onClick }: {
  task: Task;
  onDragStart: (e: React.DragEvent, id: number) => void;
  isAdmin: boolean;
  onClick: () => void;
}) {
  const pri = PRIORITY_CONFIG[task.priority];
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "done";

  return (
    <div
      draggable
      onDragStart={e => onDragStart(e, task.id)}
      onClick={onClick}
      className="bg-card rounded-xl border shadow-sm hover:shadow-md transition-all duration-200 p-3.5 cursor-pointer active:cursor-grabbing active:opacity-60 active:scale-95 group"
    >
      <div className="flex items-start gap-2 mb-2.5">
        <GripVertical size={14} className="text-muted-foreground/40 group-hover:text-muted-foreground/70 mt-0.5 shrink-0 transition-colors" />
        <p className="text-sm font-medium text-card-foreground leading-snug flex-1">{task.title}</p>
      </div>

      {task.dossier && (
        <div className="flex items-center gap-1.5 mb-2 ml-5">
          <FolderOpen size={11} className="text-primary" />
          <span className="text-xs text-primary font-medium">{task.dossier}</span>
        </div>
      )}

      {task.description && (
        <p className="text-xs text-muted-foreground ml-5 mb-2 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center gap-2 ml-5 flex-wrap">
        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${pri.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${pri.dot}`} />{pri.label}
        </span>

        {task.dueDate && (
          <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${
            isOverdue ? "bg-red-50 text-red-600 border-red-200" : "bg-muted text-muted-foreground border-border"
          }`}>
            <Calendar size={10} />
            {fmtDate(task.dueDate)}
          </span>
        )}

        {task.comments.length > 0 && (
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <MessageSquare size={10} />{task.comments.length}
          </span>
        )}

        {isAdmin && (
          <div className="ml-auto flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-[10px] font-bold">
              {task.assigneeInitials}
            </div>
            <span className="text-xs text-muted-foreground hidden sm:block">{task.assignee.split(" ")[0]}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Kanban Column ────────────────────────────────────────────────────────────

function KanbanColumn({ status, title, tasks, onDragStart, onDrop, onDragOver, isAdmin, onAddTask, onCardClick }: {
  status: Status; title: string; tasks: Task[];
  onDragStart: (e: React.DragEvent, id: number) => void;
  onDrop: (e: React.DragEvent, status: Status) => void;
  onDragOver: (e: React.DragEvent) => void;
  isAdmin: boolean;
  onAddTask: (status: Status) => void;
  onCardClick: (task: Task) => void;
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const cfg = COL_CONFIG[status];

  const ColIcon = status === "done" ? CheckCircle2 : status === "progress" ? Clock : Circle;

  return (
    <div
      className={`flex flex-col rounded-2xl border-t-4 ${cfg.border} ${cfg.bg} border border-border min-h-[400px] transition-all duration-200 ${isDragOver ? "ring-2 ring-primary/40 scale-[1.01]" : ""}`}
      onDrop={e => { setIsDragOver(false); onDrop(e, status); }}
      onDragOver={e => { onDragOver(e); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
    >
      <div className={`flex items-center justify-between px-4 py-3 border-b ${cfg.header} rounded-t-xl`}>
        <div className="flex items-center gap-2">
          <ColIcon size={15} className={cfg.icon} />
          <span className="text-sm font-semibold text-foreground">{title}</span>
          <span className="text-xs font-medium bg-white/70 border text-muted-foreground px-2 py-0.5 rounded-full">{tasks.length}</span>
        </div>
        {isAdmin && (
          <button onClick={() => onAddTask(status)} className="p-1 rounded-lg hover:bg-white/60 text-muted-foreground hover:text-foreground transition-colors" title="Ajouter">
            <Plus size={15} />
          </button>
        )}
      </div>

      <div className="flex-1 p-3 space-y-2.5 overflow-y-auto">
        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-muted-foreground/50">
            <Circle size={28} className="mb-2 opacity-30" />
            <p className="text-xs">Aucune tâche</p>
          </div>
        )}
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} onDragStart={onDragStart} isAdmin={isAdmin} onClick={() => onCardClick(task)} />
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Taches() {
  const { isAdmin, user } = useAuth();

  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterAssignee, setFilterAssignee] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [addModalStatus, setAddModalStatus] = useState<Status>("todo");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const dragId = useRef<number | null>(null);

  const currentUserName = user?.name ?? "Utilisateur";

  const visibleTasks = useMemo(() => {
    let list = tasks;
    if (!isAdmin && user) list = list.filter(t => t.assignee === user.name);
    if (search) list = list.filter(t =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.assignee.toLowerCase().includes(search.toLowerCase()) ||
      (t.dossier?.toLowerCase().includes(search.toLowerCase()))
    );
    if (filterPriority !== "all") list = list.filter(t => t.priority === filterPriority);
    if (filterAssignee !== "all") list = list.filter(t => t.assignee === filterAssignee);
    return list;
  }, [tasks, search, filterPriority, filterAssignee, isAdmin, user]);

  const stats = useMemo(() => ({
    todo: tasks.filter(t => t.status === "todo").length,
    progress: tasks.filter(t => t.status === "progress").length,
    done: tasks.filter(t => t.status === "done").length,
    haute: tasks.filter(t => t.priority === "Haute" && t.status !== "done").length,
  }), [tasks]);

  const handleDragStart = (e: React.DragEvent, id: number) => { dragId.current = id; e.dataTransfer.effectAllowed = "move"; };
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; };
  const handleDrop = (e: React.DragEvent, status: Status) => {
    e.preventDefault();
    if (dragId.current === null) return;
    setTasks(prev => prev.map(t => t.id === dragId.current ? { ...t, status } : t));
    dragId.current = null;
  };

  const handleAdd = (task: Omit<Task, "id" | "comments" | "activity" | "createdAt">) => {
    const newTask: Task = {
      ...task,
      id: Date.now(),
      comments: [],
      activity: [{ id: Date.now(), text: "Tâche créée", timestamp: new Date().toISOString() }],
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [...prev, newTask]);
  };

  const handleUpdate = (updated: Task) => {
    setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
    setSelectedTask(updated);
  };

  const handleDelete = (id: number) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const openAdd = (status: Status) => { setAddModalStatus(status); setShowAddModal(true); };

  return (
    <div className="space-y-5 fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{isAdmin ? "Gestion des Tâches" : "Mes Tâches"}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isAdmin ? `${tasks.length} tâches au total · ${stats.haute} priorité haute` : `${visibleTasks.length} tâches assignées`}
          </p>
        </div>
        {isAdmin && (
          <button onClick={() => openAdd("todo")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
            <Plus size={15} />Nouvelle tâche
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "À faire",       value: stats.todo,     color: "text-slate-600",   bg: "bg-slate-100" },
          { label: "En cours",      value: stats.progress, color: "text-blue-600",    bg: "bg-blue-100" },
          { label: "Terminées",     value: stats.done,     color: "text-emerald-600", bg: "bg-emerald-100" },
          { label: "Priorité haute",value: stats.haute,    color: "text-red-600",     bg: "bg-red-100" },
        ].map(s => (
          <div key={s.label} className="bg-card border rounded-xl p-3.5 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center`}>
              <span className={`text-lg font-bold ${s.color}`}>{s.value}</span>
            </div>
            <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
        </div>
        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="h-9 w-[150px] text-sm">
            <Flag size={13} className="text-muted-foreground mr-1" /><SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes priorités</SelectItem>
            <SelectItem value="Haute">Haute</SelectItem>
            <SelectItem value="Moyenne">Moyenne</SelectItem>
            <SelectItem value="Basse">Basse</SelectItem>
          </SelectContent>
        </Select>
        {isAdmin && (
          <Select value={filterAssignee} onValueChange={setFilterAssignee}>
            <SelectTrigger className="h-9 w-[170px] text-sm">
              <User size={13} className="text-muted-foreground mr-1" /><SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les employés</SelectItem>
              {EMPLOYEES.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Kanban board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COLUMNS.map(col => (
          <KanbanColumn
            key={col.status}
            status={col.status}
            title={col.title}
            tasks={visibleTasks.filter(t => t.status === col.status)}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            isAdmin={isAdmin}
            onAddTask={openAdd}
            onCardClick={setSelectedTask}
          />
        ))}
      </div>

      {!isAdmin && (
        <p className="text-xs text-center text-muted-foreground">
          Glissez vos tâches entre les colonnes pour mettre à jour leur statut.
        </p>
      )}

      {/* Modals */}
      {showAddModal && (
        <AddTaskModal onClose={() => setShowAddModal(false)} onAdd={handleAdd} defaultStatus={addModalStatus} />
      )}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          currentUser={currentUserName}
          isAdmin={isAdmin}
        />
      )}
    </div>
  );
}