import { Bell, Clock, Target, ClipboardList, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const notifications = [
  { id: 1, type: "attendance", icon: Clock, title: "Retard détecté", message: "Nadia Berrada est arrivée à 09:25 (retard de 25 min)", time: "il y a 35 min", read: false },
  { id: 2, type: "task", icon: ClipboardList, title: "Tâche terminée", message: "Karim Tazi a complété: Mise à jour tarifs été 2026", time: "il y a 1h", read: false },
  { id: 3, type: "objective", icon: Target, title: "Objectif atteint!", message: "Département Hajj & Omra a atteint 92% de l'objectif Q1", time: "il y a 2h", read: false },
  { id: 4, type: "alert", icon: AlertTriangle, title: "Absence non justifiée", message: "Omar Benjelloun — absent aujourd'hui sans justification", time: "il y a 3h", read: true },
  { id: 5, type: "task", icon: ClipboardList, title: "Nouvelle tâche assignée", message: "Fatima Zahra: Préparer dossier visa Groupe Hajj Avril", time: "il y a 4h", read: true },
  { id: 6, type: "objective", icon: Target, title: "Objectif en retard", message: "Lancement app mobile — seulement 30% complété", time: "il y a 5h", read: true },
  { id: 7, type: "attendance", icon: Clock, title: "Pointage manquant", message: "Amina Chraibi n'a pas pointé la sortie hier", time: "hier", read: true },
];

const typeColors: Record<string, string> = {
  attendance: "bg-warning text-warning-foreground",
  task: "bg-info text-info-foreground",
  objective: "bg-success text-success-foreground",
  alert: "bg-destructive text-destructive-foreground",
};

export default function Notifications() {
  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <Badge variant="secondary">{notifications.filter(n => !n.read).length} non lues</Badge>
      </div>
      <div className="space-y-3">
        {notifications.map((n) => (
          <div key={n.id} className={`bg-card rounded-xl border shadow-sm p-4 flex items-start gap-4 transition-all ${!n.read ? "border-l-4 border-l-primary" : "opacity-70"}`}>
            <div className={`p-2 rounded-lg ${typeColors[n.type]}`}>
              <n.icon size={18} />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold">{n.title}</h4>
              <p className="text-sm text-muted-foreground">{n.message}</p>
              <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
            </div>
            {!n.read && <div className="w-2 h-2 rounded-full bg-primary mt-2" />}
          </div>
        ))}
      </div>
    </div>
  );
}
