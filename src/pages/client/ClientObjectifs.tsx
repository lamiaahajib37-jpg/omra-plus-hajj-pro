import { Target, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const objectives = [
  { title: "Compléter tous les documents voyage", category: "Dossier", progress: 72, target: "Avant le 20 Mars 2026", status: "en_cours" },
  { title: "Paiement intégral Omra Ramadan", category: "Finance", progress: 67, target: "30 000 MAD — reste 10 000 MAD", status: "en_cours" },
  { title: "Participer à 3 briefings groupe", category: "Préparation", progress: 100, target: "3/3 réunions complétées", status: "atteint" },
  { title: "Programme de fidélité — Niveau Or", category: "Fidélité", progress: 75, target: "5 voyages (4/5 complétés)", status: "en_cours" },
  { title: "Évaluation satisfaction voyage Hajj 2025", category: "Feedback", progress: 100, target: "Formulaire rempli", status: "atteint" },
];

export default function ClientObjectifs() {
  const achieved = objectives.filter((o) => o.status === "atteint").length;

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Mes Objectifs</h1>
        <Badge variant="secondary" className="gap-1 text-sm">
          <TrendingUp size={14} /> {achieved}/{objectives.length} atteints
        </Badge>
      </div>

      <div className="space-y-4">
        {objectives.map((obj, i) => (
          <div key={i} className="bg-card rounded-xl border p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  obj.status === "atteint" ? "bg-green-50" : "bg-primary/10"
                }`}>
                  <Target size={20} className={obj.status === "atteint" ? "text-green-600" : "text-primary"} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{obj.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{obj.target}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">{obj.category}</Badge>
                <Badge variant={obj.status === "atteint" ? "secondary" : "default"} className="text-xs">
                  {obj.status === "atteint" ? "Atteint ✓" : "En cours"}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Progress value={obj.progress} className="h-2 flex-1" />
              <span className="text-sm font-bold w-12 text-right">{obj.progress}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
