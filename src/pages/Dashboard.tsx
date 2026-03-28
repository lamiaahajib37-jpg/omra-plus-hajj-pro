import { Users, FolderOpen, Clock, TrendingUp, Plane, Target } from "lucide-react";
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

export default function Dashboard() {
  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Tableau de bord</h1>
        <p className="text-muted-foreground text-sm">Vue d'ensemble — Access Morocco ERP</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Employés" value={48} change="+3 ce mois" changeType="up" icon={Users} />
        <StatCard title="Dossiers actifs" value={127} change="+12 cette semaine" changeType="up" icon={FolderOpen} />
        <StatCard title="Présences aujourd'hui" value="94%" change="+2% vs hier" changeType="up" icon={Clock} />
        <StatCard title="CA Mensuel" value="520K MAD" change="+18% vs mois dernier" changeType="up" icon={TrendingUp} />
        <StatCard title="Voyages en cours" value={8} change="3 Hajj, 5 Tourisme" changeType="neutral" icon={Plane} />
        <StatCard title="Objectifs atteints" value="76%" change="+5% ce trimestre" changeType="up" icon={Target} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
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

        {/* Pie Chart */}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
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

        {/* Activity Feed */}
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
    </div>
  );
}
