import { useState } from "react";
import { Calculator, Plane, Hotel, Shield, Bus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CostLine {
  id: number;
  label: string;
  category: string;
  amount: number;
}

const defaultLines: CostLine[] = [
  { id: 1, label: "Vol aller-retour Casablanca → Jeddah", category: "Transport", amount: 8500 },
  { id: 2, label: "Hôtel Hilton Suites Makkah (14 nuits)", category: "Hébergement", amount: 12000 },
  { id: 3, label: "Visa Omra", category: "Visa", amount: 1200 },
  { id: 4, label: "Assurance voyage complète", category: "Assurance", amount: 800 },
  { id: 5, label: "Transport interne (bus climatisé)", category: "Transport", amount: 2500 },
  { id: 6, label: "Guide accompagnateur", category: "Service", amount: 3000 },
];

const categories = ["Transport", "Hébergement", "Visa", "Assurance", "Service", "Autre"];

const categoryIcons: Record<string, typeof Plane> = {
  Transport: Bus,
  Hébergement: Hotel,
  Visa: Plane,
  Assurance: Shield,
  Service: Calculator,
  Autre: Calculator,
};

export default function ClientCosting() {
  const [lines, setLines] = useState<CostLine[]>(defaultLines);
  const [tripType, setTripType] = useState("Omra");

  const total = lines.reduce((sum, l) => sum + l.amount, 0);

  const addLine = () => {
    setLines([...lines, { id: Date.now(), label: "", category: "Autre", amount: 0 }]);
  };

  const removeLine = (id: number) => {
    setLines(lines.filter((l) => l.id !== id));
  };

  const updateLine = (id: number, field: keyof CostLine, value: string | number) => {
    setLines(lines.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
  };

  const byCategory = categories.map((cat) => ({
    category: cat,
    total: lines.filter((l) => l.category === cat).reduce((s, l) => s + l.amount, 0),
  })).filter((c) => c.total > 0);

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Costing & Devis</h1>
          <p className="text-muted-foreground">Estimez le coût de votre voyage</p>
        </div>
        <Select value={tripType} onValueChange={setTripType}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Omra">Omra</SelectItem>
            <SelectItem value="Hajj">Hajj</SelectItem>
            <SelectItem value="Tourisme">Tourisme</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Cost Lines */}
      <div className="bg-card rounded-xl border p-5 space-y-3">
        <h2 className="font-semibold">Détail des coûts — {tripType}</h2>
        {lines.map((line) => {
          const Icon = categoryIcons[line.category] || Calculator;
          return (
            <div key={line.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border">
              <Icon size={18} className="text-primary shrink-0" />
              <Input
                value={line.label}
                onChange={(e) => updateLine(line.id, "label", e.target.value)}
                className="flex-1 h-9 text-sm"
                placeholder="Description..."
              />
              <Select value={line.category} onValueChange={(v) => updateLine(line.id, "category", v)}>
                <SelectTrigger className="w-32 h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="relative w-28">
                <Input
                  type="number"
                  value={line.amount}
                  onChange={(e) => updateLine(line.id, "amount", Number(e.target.value))}
                  className="h-9 text-sm pr-12"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">MAD</span>
              </div>
              <button onClick={() => removeLine(line.id)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          );
        })}
        <Button variant="outline" size="sm" className="gap-2" onClick={addLine}>
          <Plus size={14} /> Ajouter une ligne
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-card rounded-xl border p-5 space-y-3">
          <h2 className="font-semibold">Répartition par catégorie</h2>
          {byCategory.map((c) => (
            <div key={c.category} className="flex items-center justify-between text-sm">
              <span>{c.category}</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${(c.total / total) * 100}%` }} />
                </div>
                <span className="font-medium w-24 text-right">{c.total.toLocaleString()} MAD</span>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-primary rounded-xl p-5 text-primary-foreground flex flex-col justify-center items-center">
          <p className="text-sm opacity-80">Coût Total Estimé</p>
          <p className="text-4xl font-bold mt-1">{total.toLocaleString()} MAD</p>
          <p className="text-sm opacity-70 mt-2">{tripType} • {lines.length} postes</p>
          <Button variant="secondary" className="mt-4">
            Demander un devis officiel
          </Button>
        </div>
      </div>
    </div>
  );
}
