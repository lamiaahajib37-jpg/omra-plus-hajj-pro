import { CalendarDays, Users, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const meetings = [
  {
    id: 1, title: "Réunion hebdomadaire — Département Hajj & Omra",
    date: "28/03/2026", time: "09:00 — 10:00",
    participants: ["Fatima Zahra Bennani", "Nadia Berrada", "Sara El Idrissi"],
    dept: "Hajj & Omra", status: "Aujourd'hui"
  },
  {
    id: 2, title: "Revue objectifs Q1 — Direction",
    date: "30/03/2026", time: "14:00 — 16:00",
    participants: ["Youssef El Amrani", "Hassan Ouazzani", "Karim Tazi", "Amina Chraibi"],
    dept: "Direction", status: "À venir"
  },
  {
    id: 3, title: "Point campagne Omra Ramadan",
    date: "31/03/2026", time: "10:00 — 11:00",
    participants: ["Amina Chraibi", "Fatima Zahra Bennani"],
    dept: "Marketing", status: "À venir"
  },
  {
    id: 4, title: "Formation logiciel réservation",
    date: "25/03/2026", time: "09:00 — 12:00",
    participants: ["Nadia Berrada", "Karim Tazi", "Sara El Idrissi"],
    dept: "Tourisme", status: "Passée"
  },
];

export default function Reunions() {
  return (
    <div className="space-y-6 fade-in">
      <h1 className="text-2xl font-bold">Réunions</h1>
      <div className="space-y-4">
        {meetings.map((m) => (
          <div key={m.id} className="bg-card rounded-xl border shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-secondary">
                  <CalendarDays size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{m.title}</h3>
                  <p className="text-xs text-muted-foreground">{m.dept}</p>
                </div>
              </div>
              <Badge className={
                m.status === "Aujourd'hui" ? "bg-primary text-primary-foreground" :
                m.status === "Passée" ? "bg-muted text-muted-foreground" : "bg-info text-info-foreground"
              }>
                {m.status}
              </Badge>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><CalendarDays size={14} /> {m.date}</span>
              <span className="flex items-center gap-1"><Clock size={14} /> {m.time}</span>
              <span className="flex items-center gap-1"><Users size={14} /> {m.participants.length} participants</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-1">
              {m.participants.map((p) => (
                <Badge key={p} variant="outline" className="text-xs">{p}</Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
