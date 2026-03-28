import { ClipboardList, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const tasks = [
  { title: "Fournir certificat médical", dossier: "Omra Ramadan 2026", deadline: "10 Avril 2026", status: "urgent", description: "Certificat médical requis pour le dossier Omra" },
  { title: "Confirmer réservation hôtel", dossier: "Omra Ramadan 2026", deadline: "15 Avril 2026", status: "en_cours", description: "Valider le choix de l'hôtel Hilton Suites" },
  { title: "Payer le solde du voyage", dossier: "Omra Ramadan 2026", deadline: "20 Avril 2026", status: "a_faire", description: "Solde restant: 10 000 MAD" },
  { title: "Renouveler passeport", dossier: "Hajj 2026", deadline: "01 Mai 2026", status: "a_faire", description: "Passeport expire en Juin 2026" },
  { title: "Préparer valise pèlerinage", dossier: "Omra Ramadan 2026", deadline: "22 Mars 2026", status: "done", description: "Liste fournie par l'agence" },
  { title: "Participer au briefing groupe", dossier: "Omra Ramadan 2026", deadline: "18 Mars 2026", status: "done", description: "Réunion en ligne à 20h" },
];

const statusConfig = {
  urgent: { label: "Urgent", icon: AlertCircle, color: "text-red-600", bg: "bg-red-50 border-red-200" },
  en_cours: { label: "En cours", icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50 border-yellow-200" },
  a_faire: { label: "À faire", icon: ClipboardList, color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
  done: { label: "Terminé", icon: CheckCircle, color: "text-green-600", bg: "bg-green-50 border-green-200" },
};

export default function ClientTaches() {
  const pending = tasks.filter((t) => t.status !== "done");
  const completed = tasks.filter((t) => t.status === "done");

  return (
    <div className="space-y-6 fade-in">
      <h1 className="text-2xl font-bold">Mes Tâches</h1>

      <div className="space-y-4">
        <h2 className="font-semibold text-muted-foreground">En attente ({pending.length})</h2>
        {pending.map((t, i) => {
          const sc = statusConfig[t.status as keyof typeof statusConfig];
          const Icon = sc.icon;
          return (
            <div key={i} className={`bg-card rounded-xl border p-4 flex items-start gap-3 ${sc.bg}`}>
              <Icon size={20} className={`${sc.color} mt-0.5 shrink-0`} />
              <div className="flex-1">
                <h3 className="font-medium text-sm">{t.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{t.description}</p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">{t.dossier}</Badge>
                  <span className="text-xs text-muted-foreground">Échéance: {t.deadline}</span>
                </div>
              </div>
              <Badge variant="outline" className={`${sc.color} text-xs shrink-0`}>{sc.label}</Badge>
            </div>
          );
        })}
      </div>

      <div className="space-y-4">
        <h2 className="font-semibold text-muted-foreground">Terminées ({completed.length})</h2>
        {completed.map((t, i) => (
          <div key={i} className="bg-card rounded-xl border p-4 flex items-start gap-3 opacity-60">
            <CheckCircle size={20} className="text-green-600 mt-0.5 shrink-0" />
            <div className="flex-1">
              <h3 className="font-medium text-sm line-through">{t.title}</h3>
              <p className="text-xs text-muted-foreground">{t.dossier} • {t.deadline}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
