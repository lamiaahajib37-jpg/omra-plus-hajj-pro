import { Users, FolderOpen, Clock, TrendingUp, Plane, Target, CheckCircle2, AlertCircle, Circle, ChevronRight } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from "recharts";

const barData = [
  { name: "Commercial", value: 42 },
  { name: "Hajj & Omra", value: 65 },
  { name: "Tourisme", value: 38 },
  { name: "Marketing", value: 22 },
  { name: "Finance", value: 18 },
];

const pieData = [
  { name: "Tourisme", value: 45 },
  { name: "Hajj", value: 30 },
  { name: "Omra", value: 25 },
];

const lineData = [
  { month: "Jan", ca: 120000, depenses: 80000 },
  { month: "Fév", ca: 150000, depenses: 90000 },
  { month: "Mar", ca: 180000, depenses: 95000 },
  { month: "Avr", ca: 200000, depenses: 105000 },
  { month: "Mai", ca: 240000, depenses: 110000 },
  { month: "Juin", ca: 220000, depenses: 100000 },
];

const COLORS = ["hsl(354, 85%, 42%)", "hsl(354, 85%, 55%)", "hsl(354, 85%, 68%)"];

const recentActivity = [
  { text: "Nouveau dossier Omra — Client Youssef El Amrani", time: "il y a 12 min" },
  { text: "Facture #2024-087 générée — 45 000 MAD", time: "il y a 35 min" },
  { text: "Réunion département Hajj planifiée", time: "il y a 1h" },
  { text: "Objectif Q1 Commercial atteint à 92%", time: "il y a 2h" },
  { text: "Nouveau pèlerin inscrit — Groupe Hajj Mars", time: "il y a 3h" },
];

// ── Données nouvelles sections ────────────────────────────────────────

const recentDossiers = [
  { ref: "DOS-2026-0071", client: "Karim El Fassi", destination: "Marrakech MICE", statut: "en_cours", montant: "185 000 MAD", pct: 32 },
  { ref: "DOS-2026-0063", client: "Sara Mohammedi", destination: "Omra Ramadan", statut: "en_cours", montant: "18 500 MAD", pct: 27 },
  { ref: "DOS-2026-0058", client: "Omar Tazi", destination: "Dubai, Émirats", statut: "en_cours", montant: "42 000 MAD", pct: 36 },
  { ref: "DOS-2026-0051", client: "Fatima Zahra Idrissi", destination: "Istanbul", statut: "confirme", montant: "9 500 MAD", pct: 100 },
  { ref: "DOS-2026-0042", client: "Ahmed Benali", destination: "Médine & La Mecque", statut: "en_cours", montant: "28 000 MAD", pct: 29 },
];

const leadsStats = [
  { label: "Nouveau", count: 2, color: "bg-blue-500" },
  { label: "En appel", count: 2, color: "bg-emerald-500" },
  { label: "Follow-up 1", count: 2, color: "bg-amber-500" },
  { label: "Follow-up 2", count: 1, color: "bg-orange-500" },
  { label: "Promis", count: 1, color: "bg-green-500" },
  { label: "Lost", count: 1, color: "bg-red-500" },
];

const pendingTasks = [
  { title: "Préparer dossier visa Groupe Hajj Avril", assignee: "Fatima Zahra", priority: "Haute", due: "10 Avr", status: "todo" },
  { title: "Vérifier assurances pèlerins Mars", assignee: "Nadia Berrada", priority: "Haute", due: "03 Avr", status: "progress" },
  { title: "Relancer fournisseur hôtel Medina", assignee: "Karim Tazi", priority: "Moyenne", due: "05 Avr", status: "todo" },
  { title: "Négociation contrat transport aéroport", assignee: "Karim Tazi", priority: "Haute", due: "12 Avr", status: "todo" },
];

const STATUT_CFG: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  en_cours: { label: "En cours", bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  confirme: { label: "Confirmé", bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  annule:   { label: "Annulé",   bg: "bg-red-50",     text: "text-red-700",     dot: "bg-red-500" },
  termine:  { label: "Terminé",  bg: "bg-gray-100",   text: "text-gray-600",    dot: "bg-gray-400" },
};

const PRIORITY_CFG: Record<string, { bg: string; text: string }> = {
  Haute:   { bg: "bg-red-100",   text: "text-red-700"   },
  Moyenne: { bg: "bg-amber-100", text: "text-amber-700" },
  Basse:   { bg: "bg-slate-100", text: "text-slate-600" },
};

export default function Dashboard() {
  const totalLeads = leadsStats.reduce((a, s) => a + s.count, 0);
  const promisLeads = leadsStats.find(s => s.label === "Promis")?.count ?? 0;
  const convRate = Math.round((promisLeads / totalLeads) * 100);

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Tableau de bord</h1>
        <p className="text-muted-foreground text-sm">Vue d'ensemble — Access Morocco ERP</p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Employés" value={48} change="+3 ce mois" changeType="up" icon={Users} />
        <StatCard title="Dossiers actifs" value={127} change="+12 cette semaine" changeType="up" icon={FolderOpen} />
        <StatCard title="Présences aujourd'hui" value="94%" change="+2% vs hier" changeType="up" icon={Clock} />
        <StatCard title="CA Mensuel" value="520K MAD" change="+18% vs mois dernier" changeType="up" icon={TrendingUp} />
        <StatCard title="Voyages en cours" value={8} change="3 Hajj, 5 Tourisme" changeType="neutral" icon={Plane} />
        <StatCard title="Objectifs atteints" value="76%" change="+5% ce trimestre" changeType="up" icon={Target} />
      </div>

      {/* ── Charts Row 1 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-card rounded-xl p-5 border shadow-sm lg:col-span-2">
          <h3 className="font-semibold text-card-foreground mb-4">Performance par Département</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,14%,90%)" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill="hsl(354, 85%, 42%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card rounded-xl p-5 border shadow-sm">
          <h3 className="font-semibold text-card-foreground mb-4">Répartition Dossiers</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Charts Row 2 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-card rounded-xl p-5 border shadow-sm lg:col-span-2">
          <h3 className="font-semibold text-card-foreground mb-4">Évolution CA & Dépenses (MAD)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,14%,90%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="ca" stroke="hsl(354, 85%, 42%)" strokeWidth={2} name="Chiffre d'affaires" />
              <Line type="monotone" dataKey="depenses" stroke="hsl(220,10%,46%)" strokeWidth={2} name="Dépenses" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card rounded-xl p-5 border shadow-sm">
          <h3 className="font-semibold text-card-foreground mb-4">Activité récente</h3>
          <div className="space-y-4">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                <div>
                  <p className="text-sm text-card-foreground">{a.text}</p>
                  <p className="text-xs text-muted-foreground">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── NEW: Derniers Dossiers + Pipeline Leads ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Derniers Dossiers */}
        <div className="bg-card rounded-xl border shadow-sm lg:col-span-2 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <div className="flex items-center gap-2">
              <FolderOpen size={15} className="text-primary" />
              <h3 className="font-semibold text-card-foreground">Derniers Dossiers</h3>
            </div>
            <a href="/dossiers" className="flex items-center gap-1 text-xs text-primary hover:underline font-medium">
              Voir tout <ChevronRight size={12} />
            </a>
          </div>
          <div className="divide-y">
            {recentDossiers.map((d) => {
              const sc = STATUT_CFG[d.statut];
              return (
                <div key={d.ref} className="flex items-center gap-3 px-5 py-3 hover:bg-muted/30 transition-colors">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${sc.dot}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-semibold text-muted-foreground">{d.ref}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sc.bg} ${sc.text}`}>
                        {sc.label}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-foreground truncate mt-0.5">{d.client} · {d.destination}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-emerald-600">{d.montant}</p>
                    <div className="flex items-center gap-1.5 mt-1 justify-end">
                      <div className="w-14 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${d.pct}%` }} />
                      </div>
                      <span className="text-[10px] text-muted-foreground">{d.pct}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pipeline Leads */}
        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <div className="flex items-center gap-2">
              <TrendingUp size={15} className="text-primary" />
              <h3 className="font-semibold text-card-foreground">Pipeline Leads</h3>
            </div>
            <a href="/leads" className="flex items-center gap-1 text-xs text-primary hover:underline font-medium">
              Voir tout <ChevronRight size={12} />
            </a>
          </div>
          <div className="px-5 py-4 space-y-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">{totalLeads} leads total</span>
              <span className="text-xs font-semibold text-emerald-600">{convRate}% conversion</span>
            </div>
            {/* Barre stacked */}
            <div className="flex h-2.5 rounded-full overflow-hidden gap-px">
              {leadsStats.map((s) => (
                <div
                  key={s.label}
                  className={`${s.color} transition-all`}
                  style={{ width: `${(s.count / totalLeads) * 100}%` }}
                />
              ))}
            </div>
            <div className="space-y-2.5 pt-1">
              {leadsStats.map((s) => (
                <div key={s.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${s.color}`} />
                    <span className="text-xs text-muted-foreground">{s.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${s.color}`} style={{ width: `${(s.count / totalLeads) * 100}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-foreground w-4 text-right">{s.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── NEW: Tâches en attente ── */}
      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={15} className="text-primary" />
            <h3 className="font-semibold text-card-foreground">Tâches prioritaires en attente</h3>
          </div>
          <a href="/taches" className="flex items-center gap-1 text-xs text-primary hover:underline font-medium">
            Voir tout <ChevronRight size={12} />
          </a>
        </div>
        <div className="divide-y">
          {pendingTasks.map((t, i) => {
            const pc = PRIORITY_CFG[t.priority];
            const StatusIcon = t.status === "progress" ? Clock : t.status === "done" ? CheckCircle2 : Circle;
            return (
              <div key={i} className="flex items-center gap-4 px-5 py-3 hover:bg-muted/30 transition-colors">
                <StatusIcon size={15} className={t.status === "progress" ? "text-blue-500" : "text-muted-foreground/40"} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{t.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Assigné à {t.assignee}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${pc.bg} ${pc.text}`}>
                  {t.priority}
                </span>
                <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                  <AlertCircle size={11} className={new Date() > new Date(`2026-${t.due.split(" ")[1] === "Avr" ? "04" : "05"}-${t.due.split(" ")[0]}`) ? "text-red-500" : "text-muted-foreground"} />
                  {t.due}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}