import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, MapPin, Clock, Users, DollarSign, Plane, Star } from "lucide-react";
import { mockVoyages } from "@/data/crmData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const typeConfig: Record<string, { label: string; color: string; emoji: string }> = {
  mice: { label: "MICE", color: "bg-purple-100 text-purple-700", emoji: "🎯" },
  leisure: { label: "Leisure", color: "bg-blue-100 text-blue-700", emoji: "🏖" },
  hajj: { label: "Hajj", color: "bg-green-100 text-green-700", emoji: "🕌" },
  omra: { label: "Omra", color: "bg-emerald-100 text-emerald-700", emoji: "🕌" },
  individuel: { label: "Individuel", color: "bg-orange-100 text-orange-700", emoji: "👤" },
};

export default function Voyages() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filtreType, setFiltreType] = useState("tous");

  const filtered = mockVoyages.filter((v) => {
    const matchSearch = !search || `${v.titre} ${v.destination}`.toLowerCase().includes(search.toLowerCase());
    const matchType = filtreType === "tous" || v.type === filtreType;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Programmes & Voyages</h1>
          <p className="text-sm text-muted-foreground">Templates BS et programmes standards</p>
        </div>
        <Button className="gap-2">
          <Plus size={16} /> Nouveau programme
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 items-center">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={15} />
          <Input placeholder="Rechercher..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {["tous", "mice", "leisure", "hajj", "omra", "individuel"].map((t) => (
            <button
              key={t}
              onClick={() => setFiltreType(t)}
              className={`px-3 py-1.5 rounded-lg text-sm capitalize transition-colors ${
                filtreType === t ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              {t === "tous" ? "Tous" : typeConfig[t]?.label || t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((v) => {
          const tc = typeConfig[v.type] || { label: v.type, color: "bg-gray-100 text-gray-600", emoji: "✈️" };
          return (
            <Card key={v.id} className="border-border/50 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer overflow-hidden">
              {/* Header gradient */}
              <div className="h-24 bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center text-5xl">
                {tc.emoji}
              </div>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-foreground text-sm leading-tight">{v.titre}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ml-2 ${tc.color}`}>
                    {tc.label}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{v.description}</p>
                <div className="space-y-1.5 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin size={12} className="text-primary" />
                    {v.destination}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={12} className="text-primary" />
                    {v.duree} jours
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign size={12} className="text-primary" />
                    À partir de {v.tarifBase.toLocaleString()} {v.devise} / pax
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-border flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 text-xs">Voir programme</Button>
                  <Button size="sm" className="flex-1 text-xs gap-1">
                    <Plus size={11} /> Créer dossier
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}