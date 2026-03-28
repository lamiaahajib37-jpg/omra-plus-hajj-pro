import { Plane, Users, MapPin, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const hajjTrips = [
  { id: 1, name: "Hajj 2026 — Groupe A", departure: "15/06/2026", return: "10/07/2026", pilgrims: 45, status: "Inscription ouverte", destination: "La Mecque" },
  { id: 2, name: "Omra Ramadan 2026", departure: "01/03/2026", return: "15/03/2026", pilgrims: 30, status: "Complet", destination: "La Mecque & Médine" },
  { id: 3, name: "Omra Avril 2026", departure: "10/04/2026", return: "20/04/2026", pilgrims: 22, status: "Inscription ouverte", destination: "La Mecque & Médine" },
];

const tourTrips = [
  { id: 1, name: "Circuit Villes Impériales", departure: "05/04/2026", return: "12/04/2026", travelers: 18, status: "Confirmé", destination: "Fès, Meknès, Marrakech" },
  { id: 2, name: "Sahara Adventure", departure: "20/04/2026", return: "25/04/2026", travelers: 12, status: "Inscription ouverte", destination: "Merzouga, Ouarzazate" },
  { id: 3, name: "Istanbul Découverte", departure: "01/05/2026", return: "07/05/2026", travelers: 24, status: "Confirmé", destination: "Istanbul, Turquie" },
];

export default function Voyages() {
  return (
    <div className="space-y-6 fade-in">
      <h1 className="text-2xl font-bold">Opérations Voyages</h1>

      <Tabs defaultValue="hajj">
        <TabsList>
          <TabsTrigger value="hajj">Hajj & Omra</TabsTrigger>
          <TabsTrigger value="tourisme">Tourisme</TabsTrigger>
        </TabsList>

        <TabsContent value="hajj" className="space-y-4">
          {hajjTrips.map((t) => (
            <div key={t.id} className="bg-card rounded-xl border shadow-sm p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-secondary"><Plane size={20} className="text-primary" /></div>
                  <div>
                    <h3 className="font-semibold">{t.name}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin size={12} /> {t.destination}</p>
                  </div>
                </div>
                <Badge className={t.status === "Complet" ? "bg-success text-success-foreground" : "bg-primary text-primary-foreground"}>
                  {t.status}
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div><span className="text-muted-foreground">Départ:</span> {t.departure}</div>
                <div><span className="text-muted-foreground">Retour:</span> {t.return}</div>
                <div className="flex items-center gap-1"><Users size={14} className="text-primary" /> {t.pilgrims} pèlerins</div>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="tourisme" className="space-y-4">
          {tourTrips.map((t) => (
            <div key={t.id} className="bg-card rounded-xl border shadow-sm p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-secondary"><Plane size={20} className="text-primary" /></div>
                  <div>
                    <h3 className="font-semibold">{t.name}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin size={12} /> {t.destination}</p>
                  </div>
                </div>
                <Badge className={t.status === "Confirmé" ? "bg-success text-success-foreground" : "bg-primary text-primary-foreground"}>
                  {t.status}
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div><span className="text-muted-foreground">Départ:</span> {t.departure}</div>
                <div><span className="text-muted-foreground">Retour:</span> {t.return}</div>
                <div className="flex items-center gap-1"><Users size={14} className="text-primary" /> {t.travelers} voyageurs</div>
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
