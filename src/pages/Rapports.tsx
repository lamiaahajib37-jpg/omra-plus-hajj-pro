import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line, PieChart, Pie, Cell,
} from "recharts";

const deptData = [
  { dept: "Commercial", dossiers: 42, revenue: 180 },
  { dept: "Hajj & Omra", dossiers: 65, revenue: 320 },
  { dept: "Tourisme", dossiers: 38, revenue: 150 },
  { dept: "Marketing", dossiers: 12, revenue: 50 },
];

const pilgrimTrend = [
  { year: "2021", hajj: 120, omra: 200 },
  { year: "2022", hajj: 180, omra: 280 },
  { year: "2023", hajj: 250, omra: 350 },
  { year: "2024", hajj: 320, omra: 420 },
  { year: "2025", hajj: 380, omra: 480 },
  { year: "2026", hajj: 420, omra: 520 },
];

const revenueBreakdown = [
  { name: "Hajj", value: 40 },
  { name: "Omra", value: 30 },
  { name: "Tourisme", value: 20 },
  { name: "Autres", value: 10 },
];
const COLORS = ["hsl(354,85%,42%)", "hsl(354,85%,55%)", "hsl(354,85%,68%)", "hsl(220,14%,80%)"];

const reports = [
  { name: "Rapport CA Mensuel — Mars 2026", type: "Finance", date: "28/03/2026" },
  { name: "Bilan Hajj 2025", type: "Opérations", date: "15/01/2026" },
  { name: "Rapport RH Q1 2026", type: "RH", date: "01/04/2026" },
  { name: "Analyse Marketing Digital", type: "Marketing", date: "20/03/2026" },
];

export default function Rapports() {
  return (
    <div className="space-y-6 fade-in">
      <h1 className="text-2xl font-bold">Rapports & Statistiques</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border shadow-sm p-5">
          <h3 className="font-semibold mb-4">Dossiers par Département</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={deptData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,14%,90%)" />
              <XAxis dataKey="dept" tick={{ fontSize: 11 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="dossiers" fill="hsl(354,85%,42%)" name="Dossiers" radius={[4,4,0,0]} />
              <Bar dataKey="revenue" fill="hsl(354,85%,65%)" name="Revenue (K MAD)" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl border shadow-sm p-5">
          <h3 className="font-semibold mb-4">Tendance Pèlerins (2021-2026)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={pilgrimTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,14%,90%)" />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="hajj" stroke="hsl(354,85%,42%)" strokeWidth={2} name="Hajj" />
              <Line type="monotone" dataKey="omra" stroke="hsl(354,85%,60%)" strokeWidth={2} name="Omra" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-card rounded-xl border shadow-sm p-5">
          <h3 className="font-semibold mb-4">Répartition Revenus</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={revenueBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" label>
                {revenueBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl border shadow-sm p-5 lg:col-span-2">
          <h3 className="font-semibold mb-4">Rapports Disponibles</h3>
          <div className="space-y-3">
            {reports.map((r, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <div>
                  <p className="text-sm font-medium">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{r.type}</Badge>
                  <Button size="sm" variant="outline" className="gap-1"><Download size={14} /> PDF</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
