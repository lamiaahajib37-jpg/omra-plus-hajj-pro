import { UserCircle, FileText, Plane } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const clients = [
  {
    id: 1, name: "Mohammed Alaoui", email: "m.alaoui@gmail.com", tel: "+212 6 11 22 33 44",
    city: "Casablanca", dossiers: 3, documents: ["Passeport", "Visa", "Assurance"],
    history: [{ trip: "Omra Mars 2025", type: "Omra" }, { trip: "Tourisme Marrakech 2024", type: "Tourisme" }],
    assignee: "Fatima Zahra Bennani", dept: "Hajj & Omra"
  },
  {
    id: 2, name: "Khadija Bennis", email: "k.bennis@yahoo.fr", tel: "+212 6 22 33 44 55",
    city: "Rabat", dossiers: 2, documents: ["Passeport", "Visa"],
    history: [{ trip: "Hajj 2025", type: "Hajj" }],
    assignee: "Nadia Berrada", dept: "Hajj & Omra"
  },
  {
    id: 3, name: "Ahmed Fassi", email: "a.fassi@outlook.com", tel: "+212 6 33 44 55 66",
    city: "Fès", dossiers: 1, documents: ["Passeport"],
    history: [{ trip: "Circuit Sahara 2025", type: "Tourisme" }],
    assignee: "Karim Tazi", dept: "Tourisme"
  },
  {
    id: 4, name: "Sara Kettani", email: "s.kettani@gmail.com", tel: "+212 6 44 55 66 77",
    city: "Tanger", dossiers: 4, documents: ["Passeport", "Visa", "Assurance", "Certificat médical"],
    history: [{ trip: "Omra Ramadan 2026", type: "Omra" }, { trip: "Hajj 2024", type: "Hajj" }],
    assignee: "Fatima Zahra Bennani", dept: "Hajj & Omra"
  },
];

export default function Clients() {
  return (
    <div className="space-y-6 fade-in">
      <h1 className="text-2xl font-bold">Clients & Dossiers</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {clients.map((c) => (
          <div key={c.id} className="bg-card rounded-xl border shadow-sm p-5">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                {c.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{c.name}</h3>
                <p className="text-xs text-muted-foreground">{c.city} • {c.tel}</p>
              </div>
              <Badge variant="secondary">{c.dossiers} dossiers</Badge>
            </div>

            <Tabs defaultValue="docs" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="docs" className="flex-1 text-xs">Documents</TabsTrigger>
                <TabsTrigger value="history" className="flex-1 text-xs">Historique</TabsTrigger>
                <TabsTrigger value="info" className="flex-1 text-xs">Affectation</TabsTrigger>
              </TabsList>
              <TabsContent value="docs" className="mt-3">
                <div className="flex flex-wrap gap-2">
                  {c.documents.map((d) => (
                    <Badge key={d} variant="outline" className="gap-1">
                      <FileText size={12} /> {d}
                    </Badge>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="history" className="mt-3 space-y-2">
                {c.history.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <Plane size={14} className="text-primary" />
                    <span>{h.trip}</span>
                    <Badge variant="secondary" className="text-xs">{h.type}</Badge>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="info" className="mt-3">
                <p className="text-sm"><span className="text-muted-foreground">Employé:</span> {c.assignee}</p>
                <p className="text-sm"><span className="text-muted-foreground">Département:</span> {c.dept}</p>
              </TabsContent>
            </Tabs>
          </div>
        ))}
      </div>
    </div>
  );
}
