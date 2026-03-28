import { CalendarDays, Video, MapPin, Users, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const reunions = [
  {
    title: "Briefing Groupe Omra Ramadan",
    date: "22 Mars 2026", time: "20:00", duration: "1h30",
    type: "En ligne", location: "Google Meet",
    participants: ["Fatima Zahra Bennani", "Groupe 4 — 35 pèlerins"],
    status: "upcoming", description: "Présentation du programme, consignes de voyage, et Q&A"
  },
  {
    title: "Réunion documents — vérification finale",
    date: "18 Mars 2026", time: "14:00", duration: "30min",
    type: "Agence", location: "Bureau Casablanca — Bd Zerktouni",
    participants: ["Nadia Berrada"],
    status: "upcoming", description: "Vérification de tous les documents avant le départ"
  },
  {
    title: "Briefing sécurité & santé",
    date: "15 Mars 2026", time: "19:00", duration: "1h",
    type: "En ligne", location: "Zoom",
    participants: ["Dr. Kamal Idrissi", "Groupe 4"],
    status: "done", description: "Conseils santé, vaccinations, et mesures de sécurité"
  },
  {
    title: "Session d'orientation Omra",
    date: "10 Mars 2026", time: "10:00", duration: "2h",
    type: "Agence", location: "Salle de conférence — Siège Access Morocco",
    participants: ["Fatima Zahra Bennani", "Imam El Yousfi"],
    status: "done", description: "Guide pratique et spirituel pour la Omra"
  },
];

export default function ClientReunions() {
  const upcoming = reunions.filter((r) => r.status === "upcoming");
  const past = reunions.filter((r) => r.status === "done");

  return (
    <div className="space-y-6 fade-in">
      <h1 className="text-2xl font-bold">Mes Réunions</h1>

      <div className="space-y-4">
        <h2 className="font-semibold text-muted-foreground">À venir ({upcoming.length})</h2>
        {upcoming.map((r, i) => (
          <div key={i} className="bg-card rounded-xl border p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <CalendarDays size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{r.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{r.description}</p>
                </div>
              </div>
              <Badge>À venir</Badge>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><CalendarDays size={14} /> {r.date} à {r.time}</span>
              <span className="flex items-center gap-1">
                {r.type === "En ligne" ? <Video size={14} /> : <MapPin size={14} />} {r.location}
              </span>
              <span className="flex items-center gap-1"><Users size={14} /> {r.participants.join(", ")}</span>
            </div>
            <div className="flex gap-2">
              {r.type === "En ligne" && (
                <Button size="sm" className="gap-1"><Video size={14} /> Rejoindre</Button>
              )}
              <Button size="sm" variant="outline">Confirmer présence</Button>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h2 className="font-semibold text-muted-foreground">Passées ({past.length})</h2>
        {past.map((r, i) => (
          <div key={i} className="bg-card rounded-xl border p-5 opacity-60">
            <div className="flex items-start gap-3">
              <CheckCircle size={20} className="text-green-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-sm">{r.title}</h3>
                <p className="text-xs text-muted-foreground">{r.date} à {r.time} • {r.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
