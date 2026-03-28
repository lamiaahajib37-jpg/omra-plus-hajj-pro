import { Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip
} from "recharts";

const companyObjectives = [
  { name: "CA Annuel 6M MAD", progress: 76, status: "En cours" },
  { name: "500 pèlerins Hajj 2026", progress: 62, status: "En cours" },
  { name: "Satisfaction client 95%", progress: 91, status: "En bonne voie" },
  { name: "Lancement app mobile", progress: 30, status: "En retard" },
];

const radarData = [
  { subject: "Commercial", value: 85 },
  { subject: "Hajj & Omra", value: 92 },
  { subject: "Tourisme", value: 78 },
  { subject: "Marketing", value: 70 },
  { subject: "Finance", value: 88 },
];

const employeePerf = [
  { name: "Youssef El Amrani", dept: "Commercial", score: 88, objectives: "4/5" },
  { name: "Fatima Zahra Bennani", dept: "Hajj & Omra", score: 95, objectives: "5/5" },
  { name: "Karim Tazi", dept: "Tourisme", score: 82, objectives: "3/4" },
  { name: "Amina Chraibi", dept: "Marketing", score: 75, objectives: "2/3" },
  { name: "Hassan Ouazzani", dept: "Finance", score: 90, objectives: "4/4" },
];

export default function Objectifs() {
  return (
    <div className="space-y-6 fade-in">
      <h1 className="text-2xl font-bold">Objectifs & Performance</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border shadow-sm p-5">
          <h3 className="font-semibold mb-4">Objectifs Entreprise</h3>
          <div className="space-y-4">
            {companyObjectives.map((o) => (
              <div key={o.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{o.name}</span>
                  <span className="text-muted-foreground">{o.progress}%</span>
                </div>
                <Progress value={o.progress} className="h-2.5 [&>div]:bg-primary" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl border shadow-sm p-5">
          <h3 className="font-semibold mb-4">Performance Départements</h3>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(220,14%,90%)" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
              <Radar dataKey="value" stroke="hsl(354, 85%, 42%)" fill="hsl(354, 85%, 42%)" fillOpacity={0.2} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <div className="p-5 border-b"><h3 className="font-semibold">Performance Employés</h3></div>
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3 font-medium text-muted-foreground">Employé</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Département</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Score</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Objectifs</th>
            </tr>
          </thead>
          <tbody>
            {employeePerf.map((e) => (
              <tr key={e.name} className="border-t hover:bg-muted/50">
                <td className="p-3 font-medium">{e.name}</td>
                <td className="p-3">{e.dept}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <Progress value={e.score} className="h-2 w-20 [&>div]:bg-primary" />
                    <span className="text-xs font-medium">{e.score}%</span>
                  </div>
                </td>
                <td className="p-3"><Badge variant="secondary">{e.objectives}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
