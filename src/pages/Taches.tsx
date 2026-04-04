import { useState, useMemo, useRef } from "react";
import {
  Plus, Search, SlidersHorizontal, GripVertical,
  Flag, User, FolderOpen, Calendar, X, CheckCircle2,
  Circle, Clock, ChevronDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";

// ─── Types ───────────────────────────────────────────────────────────────────

type Priority = "Haute" | "Moyenne" | "Basse";
type Status = "todo" | "progress" | "done";

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
}

// ─── Initial data ─────────────────────────────────────────────────────────────

const INITIAL_TASKS: Task[] = [
  { id: 1, title: "Préparer dossier visa Groupe Hajj Avril", assignee: "Fatima Zahra", assigneeInitials: "FZ", dossier: "Dossier Hajj #042", priority: "Haute", status: "todo", dueDate: "2026-04-10", description: "Rassembler tous les documents requis pour le visa groupe." },
  { id: 2, title: "Relancer fournisseur hôtel Medina", assignee: "Karim Tazi", assigneeInitials: "KT", priority: "Moyenne", status: "todo", dueDate: "2026-04-05" },
  { id: 3, title: "Créer campagne Omra Ramadan", assignee: "Amina Chraibi", assigneeInitials: "AC", priority: "Haute", status: "todo", dueDate: "2026-04-08" },
  { id: 4, title: "Vérifier assurances pèlerins Mars", assignee: "Nadia Berrada", assigneeInitials: "NB", dossier: "Dossier Omra #038", priority: "Haute", status: "progress", dueDate: "2026-04-03" },
  { id: 5, title: "Mettre à jour tarifs été 2026", assignee: "Youssef El Amrani", assigneeInitials: "YE", priority: "Moyenne", status: "progress", dueDate: "2026-04-15" },
  { id: 6, title: "Facturation Groupe Tourisme Fès", assignee: "Hassan Ouazzani", assigneeInitials: "HO", dossier: "Dossier #035", priority: "Basse", status: "done" },
  { id: 7, title: "Formation nouvelles recrues", assignee: "Youssef El Amrani", assigneeInitials: "YE", priority: "Moyenne", status: "done" },
  { id: 8, title: "Négociation contrat transport aéroport", assignee: "Karim Tazi", assigneeInitials: "KT", priority: "Haute", status: "todo", dueDate: "2026-04-12" },
];

const EMPLOYEES = [
  "Fatima Zahra", "Karim Tazi", "Amina Chraibi",
  "Nadia Berrada", "Youssef El Amrani", "Hassan Ouazzani",
];

const COLUMNS: { title: string; status: Status; icon: typeof Circle }[] = [
  { title: "À faire", status: "todo", icon: Circle },
  { title: "En cours", status: "progress", icon: Clock },
  { title: "Terminé", status: "done", icon: CheckCircle2 },
];

const PRIORITY_CONFIG: Record<Priority, { color: string; dot: string; label: string }> = {
  Haute:   { color: "bg-red-100 text-red-700 border-red-200",     dot: "bg-red-500",    label: "Haute" },
  Moyenne: { color: "bg-amber-100 text-amber-700 border-amber-200", dot: "bg-amber-500",  label: "Moyenne" },
  Basse:   { color: "bg-slate-100 text-slate-600 border-slate-200", dot: "bg-slate-400",  label: "Basse" },
};

const COL_CONFIG: Record<Status, { header: string; border: string; bg: string }> = {
  todo:     { header: "bg-slate-100 border-slate-200",    border: "border-t-slate-400",    bg: "bg-slate-50/60" },
  progress: { header: "bg-blue-50 border-blue-200",       border: "border-t-blue-500",     bg: "bg-blue-50/30" },
  done:     { header: "bg-emerald-50 border-emerald-200", border: "border-t-emerald-500",  bg: "bg-emerald-50/30" },
};

// ─── Add Task Modal ───────────────────────────────────────────────────────────

function AddTaskModal({ onClose, onAdd, defaultStatus }: {
  onClose: () => void;
  onAdd: (t: Omit<Task, "id">) => void;
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
    const initials = form.assignee.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
    onAdd({ ...form, assigneeInitials: initials });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="font-semibold text-base text-card-foreground">Nouvelle tâche</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground">
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
          {err && <p className="text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-lg">{err}</p>}

          <F label="Titre">
            <Input placeholder="Titre de la tâche..." value={form.title}
              onChange={e => set("title", e.target.value)} className="h-9 text-sm" />
          </F>

          <F label="Assigné à">
            <Select value={form.assignee} onValueChange={v => set("assignee", v)}>
              <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Choisir un employé" /></SelectTrigger>
              <SelectContent>
                {EMPLOYEES.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
              </SelectContent>
            </Select>
          </F>

          <div className="grid grid-cols-2 gap-3">
            <F label="Priorité">
              <Select value={form.priority} onValueChange={v => set("priority", v as Priority)}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(["Haute", "Moyenne", "Basse"] as Priority[]).map(p => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
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

          <F label="Dossier lié (optionnel)">
            <Input placeholder="Ex: Dossier Hajj #042" value={form.dossier}
              onChange={e => set("dossier", e.target.value)} className="h-9 text-sm" />
          </F>

          <F label="Date d'échéance (optionnel)">
            <Input type="date" value={form.dueDate}
              onChange={e => set("dueDate", e.target.value)} className="h-9 text-sm" />
          </F>

          <F label="Description (optionnel)">
            <textarea
              placeholder="Détails de la tâche..."
              value={form.description}
              onChange={e => set("description", e.target.value)}
              className="w-full min-h-[72px] text-sm border rounded-lg px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </F>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t bg-muted/30">
          <button onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border hover:bg-accent text-muted-foreground transition-colors">
            Annuler
          </button>
          <button onClick={submit}
            className="px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-colors">
            Créer la tâche
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

// ─── Task Card ────────────────────────────────────────────────────────────────

function TaskCard({ task, onDragStart, isAdmin }: {
  task: Task;
  onDragStart: (e: React.DragEvent, id: number) => void;
  isAdmin: boolean;
}) {
  const pri = PRIORITY_CONFIG[task.priority];
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "done";

  return (
    <div
      draggable
      onDragStart={e => onDragStart(e, task.id)}
      className="bg-card rounded-xl border shadow-sm hover:shadow-md transition-all duration-200 p-3.5 cursor-grab active:cursor-grabbing active:opacity-60 active:scale-95 group"
    >
      {/* Top row */}
      <div className="flex items-start gap-2 mb-2.5">
        <GripVertical size={14} className="text-muted-foreground/40 group-hover:text-muted-foreground/70 mt-0.5 shrink-0 transition-colors" />
        <p className="text-sm font-medium text-card-foreground leading-snug flex-1">{task.title}</p>
      </div>

      {/* Dossier */}
      {task.dossier && (
        <div className="flex items-center gap-1.5 mb-2 ml-5">
          <FolderOpen size={11} className="text-primary" />
          <span className="text-xs text-primary font-medium">{task.dossier}</span>
        </div>
      )}

      {/* Description */}
      {task.description && (
        <p className="text-xs text-muted-foreground ml-5 mb-2 line-clamp-2">{task.description}</p>
      )}

      {/* Bottom row */}
      <div className="flex items-center gap-2 ml-5 flex-wrap">
        {/* Priority badge */}
        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${pri.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${pri.dot}`} />
          {pri.label}
        </span>

        {/* Due date */}
        {task.dueDate && (
          <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${
            isOverdue ? "bg-red-50 text-red-600 border-red-200" : "bg-muted text-muted-foreground border-border"
          }`}>
            <Calendar size={10} />
            {new Date(task.dueDate).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
          </span>
        )}

        {/* Assignee — show only if admin */}
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

function KanbanColumn({ status, title, tasks, onDragStart, onDrop, onDragOver, isAdmin, onAddTask }: {
  status: Status;
  title: string;
  tasks: Task[];
  onDragStart: (e: React.DragEvent, id: number) => void;
  onDrop: (e: React.DragEvent, status: Status) => void;
  onDragOver: (e: React.DragEvent) => void;
  isAdmin: boolean;
  onAddTask: (status: Status) => void;
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const cfg = COL_CONFIG[status];
  const Icon = COLUMNS.find(c => c.status === status)!.icon;

  return (
    <div
      className={`flex flex-col rounded-2xl border-t-4 ${cfg.border} ${cfg.bg} border border-border min-h-[400px] transition-all duration-200 ${isDragOver ? "ring-2 ring-primary/40 scale-[1.01]" : ""}`}
      onDrop={e => { setIsDragOver(false); onDrop(e, status); }}
      onDragOver={e => { onDragOver(e); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
    >
      {/* Column header */}
      <div className={`flex items-center justify-between px-4 py-3 border-b ${cfg.header} rounded-t-xl`}>
        <div className="flex items-center gap-2">
          <Icon size={15} className={status === "done" ? "text-emerald-600" : status === "progress" ? "text-blue-600" : "text-slate-500"} />
          <span className="text-sm font-semibold text-foreground">{title}</span>
          <span className="text-xs font-medium bg-white/70 border text-muted-foreground px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
        {isAdmin && (
          <button
            onClick={() => onAddTask(status)}
            className="p-1 rounded-lg hover:bg-white/60 text-muted-foreground hover:text-foreground transition-colors"
            title="Ajouter une tâche"
          >
            <Plus size={15} />
          </button>
        )}
      </div>

      {/* Tasks */}
      <div className="flex-1 p-3 space-y-2.5 overflow-y-auto">
        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-muted-foreground/50">
            <Circle size={28} className="mb-2 opacity-30" />
            <p className="text-xs">Aucune tâche</p>
          </div>
        )}
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} onDragStart={onDragStart} isAdmin={isAdmin} />
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
  const dragId = useRef<number | null>(null);

  // For employees: filter to their own tasks only
  const visibleTasks = useMemo(() => {
    let list = tasks;
    if (!isAdmin && user) {
      list = list.filter(t => t.assignee === user.name);
    }
    if (search) {
      list = list.filter(t =>
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.assignee.toLowerCase().includes(search.toLowerCase()) ||
        (t.dossier?.toLowerCase().includes(search.toLowerCase()))
      );
    }
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

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, id: number) => {
    dragId.current = id;
    e.dataTransfer.effectAllowed = "move";
  };
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; };
  const handleDrop = (e: React.DragEvent, status: Status) => {
    e.preventDefault();
    if (dragId.current === null) return;
    setTasks(prev => prev.map(t => t.id === dragId.current ? { ...t, status } : t));
    dragId.current = null;
  };

  const handleAdd = (task: Omit<Task, "id">) => {
    setTasks(prev => [...prev, { ...task, id: Date.now() }]);
  };

  const openAdd = (status: Status) => { setAddModalStatus(status); setShowAddModal(true); };

  return (
    <div className="space-y-5 fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {isAdmin ? "Gestion des Tâches" : "Mes Tâches"}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isAdmin
              ? `${tasks.length} tâches au total · ${stats.haute} priorité haute`
              : `${visibleTasks.length} tâches assignées`}
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => openAdd("todo")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Plus size={15} />
            Nouvelle tâche
          </button>
        )}
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "À faire",    value: stats.todo,     color: "text-slate-600",   bg: "bg-slate-100" },
          { label: "En cours",   value: stats.progress, color: "text-blue-600",    bg: "bg-blue-100" },
          { label: "Terminées",  value: stats.done,     color: "text-emerald-600", bg: "bg-emerald-100" },
          { label: "Priorité haute", value: stats.haute, color: "text-red-600",   bg: "bg-red-100" },
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
          <Input placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm" />
        </div>
        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="h-9 w-[150px] text-sm">
            <Flag size={13} className="text-muted-foreground mr-1" />
            <SelectValue />
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
              <User size={13} className="text-muted-foreground mr-1" />
              <SelectValue />
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
          />
        ))}
      </div>

      {/* Note for employees */}
      {!isAdmin && (
        <p className="text-xs text-center text-muted-foreground">
          Glissez vos tâches entre les colonnes pour mettre à jour leur statut.
        </p>
      )}

      {/* Add modal */}
      {showAddModal && (
        <AddTaskModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAdd}
          defaultStatus={addModalStatus}
        />
      )}
    </div>
  );
}