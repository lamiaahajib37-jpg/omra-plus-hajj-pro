import { FolderOpen, Plane, FileText, User, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

const dossiers = [
  {
    id: "DOS-2026-001", type: "Omra", title: "Omra Ramadan 2026",
    status: "En cours", progress: 65, departure: "25 Mars 2026", return: "10 Avril 2026",
    destination: "La Mecque & Médine", hotel: "Hilton Suites Makkah",
    group: "Groupe 4 — 35 pèlerins", agent: "Fatima Zahra Bennani",
    documents: [
      { name: "Passeport", status: "Vérifié" },
      { name: "Visa Omra", status: "En attente" },
      { name: "Assurance voyage", status: "Vérifié" },
      { name: "Certificat médical", status: "Manquant" },
    ],
    payments: [
      { label: "Acompte", amount: "8 000 MAD", paid: true },
      { label: "2ème versement", amount: "12 000 MAD", paid: true },
      { label: "Solde", amount: "10 000 MAD", paid: false },
    ],
    total: "30 000 MAD"
  },
  {
    id: "DOS-2025-018", type: "Hajj", title: "Hajj 2025",
    status: "Terminé", progress: 100, departure: "5 Juin 2025", return: "25 Juin 2025",
    destination: "La Mecque & Médine", hotel: "Dar Al Tawhid Intercontinental",
    group: "Groupe 2 — 40 pèlerins", agent: "Nadia Berrada",
    documents: [
      { name: "Passeport", status: "Vérifié" },
      { name: "Visa Hajj", status: "Vérifié" },
      { name: "Assurance voyage", status: "Vérifié" },
      { name: "Certificat médical", status: "Vérifié" },
    ],
    payments: [
      { label: "Total", amount: "45 000 MAD", paid: true },
    ],
    total: "45 000 MAD"
  },
  {
    id: "DOS-2024-042", type: "Tourisme", title: "Circuit Sahara & Marrakech",
    status: "Terminé", progress: 100, departure: "15 Oct 2024", return: "22 Oct 2024",
    destination: "Marrakech → Ouarzazate → Merzouga", hotel: "Riad & Bivouac",
    group: "Privé — 4 personnes", agent: "Karim Tazi",
    documents: [
      { name: "Passeport", status: "Vérifié" },
    ],
    payments: [
      { label: "Total", amount: "12 000 MAD", paid: true },
    ],
    total: "12 000 MAD"
  },
];

const statusColor = (s: string) => {
  if (s === "Vérifié") return "bg-green-100 text-green-700 border-green-200";
  if (s === "En attente") return "bg-yellow-100 text-yellow-700 border-yellow-200";
  return "bg-red-100 text-red-700 border-red-200";
};

export default function ClientDossiers() {
  return (
    <div className="space-y-6 fade-in">
      <h1 className="text-2xl font-bold">Mes Dossiers</h1>

      <div className="space-y-5">
        {dossiers.map((d) => (
          <div key={d.id} className="bg-card rounded-xl border shadow-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  {d.type === "Tourisme" ? <MapPin size={20} className="text-primary" /> : <Plane size={20} className="text-primary" />}
                </div>
                <div>
                  <h3 className="font-semibold">{d.title}</h3>
                  <p className="text-xs text-muted-foreground">{d.id} • {d.destination}</p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant={d.status === "Terminé" ? "secondary" : "default"}>{d.status}</Badge>
                <p className="text-xs text-muted-foreground mt-1">{d.departure} → {d.return}</p>
              </div>
            </div>

            {/* Progress */}
            <div className="px-5 pt-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Progression</span>
                <span className="font-medium">{d.progress}%</span>
              </div>
              <Progress value={d.progress} className="h-2" />
            </div>

            {/* Tabs */}
            <div className="p-5">
              <Tabs defaultValue="info">
                <TabsList className="w-full">
                  <TabsTrigger value="info" className="flex-1 text-xs">Infos</TabsTrigger>
                  <TabsTrigger value="docs" className="flex-1 text-xs">Documents</TabsTrigger>
                  <TabsTrigger value="payments" className="flex-1 text-xs">Paiements</TabsTrigger>
                </TabsList>
                <TabsContent value="info" className="mt-3 space-y-2 text-sm">
                  <p><span className="text-muted-foreground">Hôtel:</span> {d.hotel}</p>
                  <p><span className="text-muted-foreground">Groupe:</span> {d.group}</p>
                  <p className="flex items-center gap-1"><User size={14} className="text-primary" /> <span className="text-muted-foreground">Agent:</span> {d.agent}</p>
                </TabsContent>
                <TabsContent value="docs" className="mt-3">
                  <div className="grid grid-cols-2 gap-2">
                    {d.documents.map((doc) => (
                      <div key={doc.name} className={`flex items-center gap-2 p-2 rounded-lg border text-sm ${statusColor(doc.status)}`}>
                        <FileText size={14} />
                        <span className="flex-1">{doc.name}</span>
                        <span className="text-xs font-medium">{doc.status}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="payments" className="mt-3 space-y-2">
                  {d.payments.map((p, i) => (
                    <div key={i} className="flex items-center justify-between text-sm p-2 rounded-lg bg-muted/50">
                      <span>{p.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{p.amount}</span>
                        <Badge variant={p.paid ? "secondary" : "destructive"} className="text-xs">
                          {p.paid ? "Payé" : "En attente"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between font-semibold text-sm pt-2 border-t">
                    <span>Total</span>
                    <span>{d.total}</span>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
