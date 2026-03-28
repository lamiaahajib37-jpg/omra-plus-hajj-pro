import { useState } from "react";
import { FileText, Send, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const existingDevis = [
  {
    id: "DEV-2026-012", type: "Omra", destination: "La Mecque & Médine",
    date: "05 Mars 2026", status: "accepted", amount: "30 000 MAD",
    details: "Omra Ramadan — 14 nuits, vol + hôtel 5* + guide"
  },
  {
    id: "DEV-2026-008", type: "Hajj", destination: "La Mecque & Médine",
    date: "20 Fév 2026", status: "pending", amount: "48 000 MAD",
    details: "Hajj 2026 — forfait complet, hôtel premium"
  },
  {
    id: "DEV-2025-045", type: "Tourisme", destination: "Istanbul & Cappadoce",
    date: "15 Nov 2025", status: "declined", amount: "15 000 MAD",
    details: "Circuit 7 jours — vol + hôtel 4* + excursions"
  },
];

const statusConfig = {
  accepted: { label: "Accepté", color: "text-green-600 bg-green-50 border-green-200" },
  pending: { label: "En attente", color: "text-yellow-600 bg-yellow-50 border-yellow-200" },
  declined: { label: "Refusé", color: "text-red-600 bg-red-50 border-red-200" },
};

export default function ClientDevis() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Demande de Devis</h1>
          <p className="text-muted-foreground">Demandez un devis personnalisé pour votre prochain voyage</p>
        </div>
        <Button className="gap-2" onClick={() => setShowForm(!showForm)}>
          <FileText size={16} /> Nouveau Devis
        </Button>
      </div>

      {/* New quote form */}
      {showForm && (
        <div className="bg-card rounded-xl border p-5 space-y-4 slide-up">
          <h2 className="font-semibold">Nouvelle demande</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Type de voyage</label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="omra">Omra</SelectItem>
                  <SelectItem value="hajj">Hajj</SelectItem>
                  <SelectItem value="tourisme">Tourisme</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Destination</label>
              <Input placeholder="Ex: La Mecque, Istanbul..." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Date de départ souhaitée</label>
              <Input type="date" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Nombre de personnes</label>
              <Input type="number" defaultValue={1} min={1} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Détails & préférences</label>
            <Textarea placeholder="Décrivez vos besoins : type d'hôtel, services souhaités, budget estimé..." rows={3} />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowForm(false)}>Annuler</Button>
            <Button className="gap-2"><Send size={14} /> Envoyer la demande</Button>
          </div>
        </div>
      )}

      {/* Existing quotes */}
      <div className="space-y-4">
        <h2 className="font-semibold text-lg">Mes Devis</h2>
        {existingDevis.map((d) => {
          const sc = statusConfig[d.status as keyof typeof statusConfig];
          return (
            <div key={d.id} className="bg-card rounded-xl border p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <FileText size={20} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm">{d.id}</h3>
                  <Badge variant="secondary" className="text-xs">{d.type}</Badge>
                </div>
                <p className="text-sm mt-1">{d.details}</p>
                <p className="text-xs text-muted-foreground mt-1">{d.destination} • Demandé le {d.date}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold text-sm">{d.amount}</p>
                <Badge variant="outline" className={`mt-1 text-xs ${sc.color}`}>{sc.label}</Badge>
              </div>
              <Button variant="ghost" size="sm" className="shrink-0">
                <Eye size={16} />
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
