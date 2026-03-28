import { FolderOpen, Plane, Clock, FileText, Target } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";

const stats = [
  { title: "Dossiers Actifs", value: "3", icon: FolderOpen, trend: "+1 ce mois" },
  { title: "Voyages Effectués", value: "5", icon: Plane, trend: "Depuis 2022" },
  { title: "Documents", value: "8", icon: FileText, trend: "2 à renouveler" },
  { title: "Prochain Voyage", value: "15j", icon: Clock, trend: "Omra Ramadan" },
];

const recentActivity = [
  { action: "Dossier Omra Ramadan 2026 — mis à jour", time: "Il y a 2h", type: "dossier" },
  { action: "Facture #INV-2026-042 — payée", time: "Il y a 1 jour", type: "finance" },
  { action: "Passeport — document vérifié", time: "Il y a 3 jours", type: "document" },
  { action: "Réunion briefing groupe — confirmée", time: "Il y a 5 jours", type: "reunion" },
  { action: "Objectif fidélité — 75% atteint", time: "Il y a 1 semaine", type: "objectif" },
];

const upcomingTasks = [
  { task: "Fournir certificat médical", deadline: "Avant le 10 Avril", status: "urgent" },
  { task: "Confirmer réservation hôtel", deadline: "Avant le 15 Avril", status: "en_cours" },
  { task: "Payer solde voyage", deadline: "Avant le 20 Avril", status: "a_faire" },
];

export default function ClientDashboard() {
  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-bold">Bienvenue, Mohammed 👋</h1>
        <p className="text-muted-foreground">Voici un résumé de votre espace client</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard key={s.title} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-card rounded-xl border p-5 space-y-4">
          <h2 className="font-semibold text-lg">Activité Récente</h2>
          <div className="space-y-3">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                <div className="flex-1">
                  <p>{a.action}</p>
                  <p className="text-xs text-muted-foreground">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-card rounded-xl border p-5 space-y-4">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <Target size={18} className="text-primary" /> À faire
          </h2>
          <div className="space-y-3">
            {upcomingTasks.map((t, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="text-sm font-medium">{t.task}</p>
                  <p className="text-xs text-muted-foreground">{t.deadline}</p>
                </div>
                <Badge variant={t.status === "urgent" ? "destructive" : "secondary"}>
                  {t.status === "urgent" ? "Urgent" : t.status === "en_cours" ? "En cours" : "À faire"}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
