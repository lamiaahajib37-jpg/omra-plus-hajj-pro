import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FolderOpen, CheckCircle2, Clock, AlertCircle, TrendingUp,
  FileText, Plus, Eye, DollarSign, Users, Plane
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { StatCard } from "@/components/StatCard";

const myDossiers = [
  { id: "D-2024-001", client: "Ahmed Benali", type: "hajj", status: "en_cours", progress: 65, totalCost: 45000, prixVente: 52000, depart: "15/06/2025" },
  { id: "D-2024-002", client: "Fatima Zahra", type: "omra", status: "confirme", progress: 90, totalCost: 18000, prixVente: 22000, depart: "20/03/2025" },
  { id: "D-2024-003", client: "Karim Idrissi", type: "tourisme", status: "en_attente", progress: 30, totalCost: 12000, prixVente: 15500, depart: "01/07/2025" },
  { id: "D-2024-004", client: "Sara Mohammedi", type: "hajj", status: "en_cours", progress: 50, totalCost: 44000, prixVente: 51000, depart: "15/06/2025" },
  { id: "D-2024-005", client: "Omar Tazi", type: "omra", status: "termine", progress: 100, totalCost: 17500, prixVente: 21000, depart: "10/01/2025" },
];

const myTasks = [
  { title: "Compléter dossier visa - Ahmed Benali", status: "en_cours", priority: "haute", due: "Aujourd'hui" },
  { title: "Vérifier passeport - Karim Idrissi", status: "todo", priority: "moyenne", due: "Demain" },
  { title: "Envoyer confirmation hôtel - Fatima Zahra", status: "en_cours", priority: "haute", due: "Aujourd'hui" },
  { title: "Préparer devis groupe Tourisme Istanbul", status: "todo", priority: "basse", due: "28/03/2025" },
];

const statusConfig: Record<string, { label: string; color: string }> = {
  en_cours: { label: "En cours", color: "bg-blue-100 text-blue-700" },
  confirme: { label: "Confirmé", color: "bg-green-100 text-green-700" },
  en_attente: { label: "En attente", color: "bg-yellow-100 text-yellow-700" },
  termine: { label: "Terminé", color: "bg-muted text-muted-foreground" },
};

const typeLabels: Record<string, string> = {
  hajj: "Hajj",
  omra: "Omra",
  tourisme: "Tourisme",
};

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const activeDossiers = myDossiers.filter((d) => d.status !== "termine").length;
  const totalMarge = myDossiers.reduce((s, d) => s + (d.prixVente - d.totalCost), 0);

  return (
    <div className="space-y-6 fade-in">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Bienvenue, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-muted-foreground">
          Département {user?.department} · Vos dossiers et tâches du jour
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Mes Dossiers" value={myDossiers.length.toString()} icon={FolderOpen} trend="+2 ce mois" />
        <StatCard title="Dossiers Actifs" value={activeDossiers.toString()} icon={Clock} trend="3 urgents" />
        <StatCard title="Tâches En Cours" value={myTasks.filter((t) => t.status === "en_cours").length.toString()} icon={CheckCircle2} trend="2 aujourd'hui" />
        <StatCard title="Marge Générée" value={`${(totalMarge / 1000).toFixed(0)}K MAD`} icon={TrendingUp} trend="+12%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dossiers list */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg">Mes Dossiers</CardTitle>
              <Link to="/dossiers">
                <Button size="sm" variant="outline" className="gap-1.5">
                  <Plus size={14} /> Nouveau
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {myDossiers.map((d) => (
                <Link
                  key={d.id}
                  to={`/dossiers/${d.id}`}
                  className="flex items-center gap-4 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Plane size={18} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground truncate">{d.client}</p>
                      <Badge variant="outline" className="text-[10px] shrink-0">{typeLabels[d.type]}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{d.id} · Départ: {d.depart}</p>
                    <Progress value={d.progress} className="h-1.5 mt-1.5" />
                  </div>
                  <div className="text-right shrink-0">
                    <Badge className={`${statusConfig[d.status]?.color} text-[10px] border-0`}>
                      {statusConfig[d.status]?.label}
                    </Badge>
                    <p className="text-xs font-medium text-foreground mt-1">
                      {d.prixVente.toLocaleString()} MAD
                    </p>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Tasks */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Mes Tâches</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {myTasks.map((t, i) => (
              <div key={i} className="p-3 rounded-lg border border-border space-y-2">
                <p className="text-sm font-medium text-foreground leading-snug">{t.title}</p>
                <div className="flex items-center justify-between">
                  <Badge variant={t.priority === "haute" ? "destructive" : "secondary"} className="text-[10px]">
                    {t.priority}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{t.due}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
