import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FolderOpen, Search, Calendar, Users, FileText, DollarSign, MessageSquare } from "lucide-react";
import { mockDossiers, DEPARTEMENTS_LABELS } from "@/data/crmData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

// For employee, show only assigned dossiers
const myDossiers = mockDossiers.filter(d => d.employeId === "EMP001");

const statutColors: Record<string, string> = {
  en_cours: "bg-blue-100 text-blue-700",
  confirme: "bg-emerald-100 text-emerald-700",
  annule: "bg-red-100 text-red-500",
  termine: "bg-gray-100 text-gray-500",
};
const statutLabels: Record<string, string> = {
  en_cours: "En cours",
  confirme: "Confirmé",
  annule: "Annulé",
  termine: "Terminé",
};

export default function MesDossiers() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = myDossiers.filter(d =>
    !search || `${d.reference} ${d.clientNom} ${d.destination}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mes Dossiers</h1>
          <p className="text-sm text-muted-foreground">{myDossiers.length} dossier{myDossiers.length !== 1 ? "s" : ""} assigné{myDossiers.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Dossiers actifs", value: myDossiers.filter(d => ["en_cours", "confirme"].includes(d.statut)).length },
          { label: "Présentations à faire", value: myDossiers.filter(d => !d.presentations.some(p => p.valideParClient)).length },
          { label: "Pax total", value: myDossiers.reduce((a, d) => a + d.nombrePax, 0) },
        ].map((s) => (
          <Card key={s.label} className="border-border/50">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-2xl font-bold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={15} />
        <Input placeholder="Rechercher..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Dossiers */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <FolderOpen size={40} className="mx-auto mb-3 opacity-30" />
            <p>Aucun dossier assigné pour le moment.</p>
          </div>
        )}
        {filtered.map((d) => {
          const lastV = d.presentations[d.presentations.length - 1];
          return (
            <Card
              key={d.id}
              className="border-border/50 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer"
              onClick={() => navigate(`/dossiers/${d.id}`)}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-foreground">{d.reference}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statutColors[d.statut]}`}>
                        {statutLabels[d.statut]}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{d.clientNom}</p>
                  </div>
                  <Badge variant="outline">{DEPARTEMENTS_LABELS[d.departement]}</Badge>
                </div>

                <div className="flex items-center gap-6 text-xs text-muted-foreground mb-3">
                  <span>📍 {d.destination}</span>
                  <span className="flex items-center gap-1"><Users size={11} /> {d.nombrePax} pax</span>
                  {d.dateVoyage && (
                    <span className="flex items-center gap-1">
                      <Calendar size={11} /> {new Date(d.dateVoyage).toLocaleDateString("fr-FR")}
                    </span>
                  )}
                </div>

                {/* Quick actions */}
                <div className="flex gap-2 pt-3 border-t border-border/50">
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1 text-xs flex-1"
                    onClick={(e) => { e.stopPropagation(); navigate(`/dossiers/${d.id}/presentation`); }}
                  >
                    <FileText size={12} />
                    {lastV ? `V${lastV.version} présentation` : "Créer présentation"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1 text-xs flex-1"
                    onClick={(e) => { e.stopPropagation(); navigate(`/dossiers/${d.id}/costing`); }}
                  >
                    <DollarSign size={12} /> Costing
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1 text-xs"
                    onClick={(e) => { e.stopPropagation(); navigate(`/dossiers/${d.id}`); }}
                  >
                    <MessageSquare size={12} />
                  </Button>
                </div>

                {/* Presentation status */}
                {lastV && (
                  <div className={`mt-3 text-xs p-2 rounded-lg ${lastV.valideParClient ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                    {lastV.valideParClient
                      ? "✓ Présentation V" + lastV.version + " validée par le client"
                      : "⏳ En attente de validation client — V" + lastV.version}
                    {lastV.commentaireClient && (
                      <p className="mt-1 opacity-80">"{ lastV.commentaireClient}"</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}