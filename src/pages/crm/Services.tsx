import { useState } from "react";
import { mockServices } from "@/data/crmMockData";
import { Service, ServiceCategory } from "@/types/crm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Search, Plus, Package, Filter, Edit, Trash2 } from "lucide-react";

const CATEGORIES: ServiceCategory[] = ["Hotel", "Transport", "Vol", "Activité", "Guide", "Visa", "Assurance", "Restaurant", "Excursion", "Autre"];

const CATEGORY_COLORS: Record<ServiceCategory, string> = {
  Hotel: "bg-blue-100 text-blue-800",
  Transport: "bg-purple-100 text-purple-800",
  Vol: "bg-sky-100 text-sky-800",
  "Activité": "bg-green-100 text-green-800",
  Guide: "bg-yellow-100 text-yellow-800",
  Visa: "bg-orange-100 text-orange-800",
  Assurance: "bg-pink-100 text-pink-800",
  Restaurant: "bg-red-100 text-red-800",
  Excursion: "bg-teal-100 text-teal-800",
  Autre: "bg-gray-100 text-gray-800",
};

export default function CRMServices() {
  const [services, setServices] = useState<Service[]>(mockServices);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState<string>("all");
  const [showNew, setShowNew] = useState(false);
  const [editService, setEditService] = useState<Service | null>(null);

  const filtered = services.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.supplier?.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "all" || s.category === catFilter;
    return matchSearch && matchCat;
  });

  const handleSave = (service: Service) => {
    if (editService) {
      setServices(prev => prev.map(s => s.id === service.id ? service : s));
    } else {
      setServices(prev => [...prev, service]);
    }
    setShowNew(false);
    setEditService(null);
  };

  const handleDelete = (id: string) => setServices(prev => prev.filter(s => s.id !== id));
  const handleToggle = (id: string) => setServices(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));

  const totalServices = services.length;
  const activeServices = services.filter(s => s.active).length;
  const avgMargin = services.length ? Math.round(services.reduce((s, sv) => s + ((sv.sellingPrice - sv.basePrice) / sv.basePrice * 100), 0) / services.length) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Services & Tarification</h1>
          <p className="text-muted-foreground">Base de données centralisée des services et prix</p>
        </div>
        <Dialog open={showNew || !!editService} onOpenChange={v => { if (!v) { setShowNew(false); setEditService(null); } }}>
          <DialogTrigger asChild>
            <Button onClick={() => setShowNew(true)}><Plus size={16} className="mr-2" /> Nouveau Service</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editService ? "Modifier Service" : "Nouveau Service"}</DialogTitle></DialogHeader>
            <ServiceForm initial={editService} onSave={handleSave} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Total Services</p>
          <p className="text-2xl font-bold text-card-foreground">{totalServices}</p>
        </div>
        <div className="bg-card border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Services Actifs</p>
          <p className="text-2xl font-bold text-primary">{activeServices}</p>
        </div>
        <div className="bg-card border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Marge Moyenne</p>
          <p className="text-2xl font-bold text-card-foreground">{avgMargin}%</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Rechercher un service..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={catFilter} onValueChange={setCatFilter}>
          <SelectTrigger className="w-[160px]"><Filter size={14} className="mr-2" /><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes catégories</SelectItem>
            {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Fournisseur</TableHead>
              <TableHead className="text-right">Prix Coût</TableHead>
              <TableHead className="text-right">Prix Vente</TableHead>
              <TableHead className="text-right">Marge</TableHead>
              <TableHead className="text-center">Actif</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(s => {
              const margin = Math.round((s.sellingPrice - s.basePrice) / s.basePrice * 100);
              return (
                <TableRow key={s.id} className={!s.active ? "opacity-50" : ""}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-card-foreground">{s.name}</p>
                      {s.description && <p className="text-xs text-muted-foreground">{s.description}</p>}
                    </div>
                  </TableCell>
                  <TableCell><Badge className={`${CATEGORY_COLORS[s.category]} border-0 text-xs`}>{s.category}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{s.supplier || "—"}</TableCell>
                  <TableCell className="text-right font-medium">{s.basePrice.toLocaleString()} MAD</TableCell>
                  <TableCell className="text-right font-medium">{s.sellingPrice.toLocaleString()} MAD</TableCell>
                  <TableCell className="text-right"><span className="text-primary font-medium">{margin}%</span></TableCell>
                  <TableCell className="text-center"><Switch checked={s.active} onCheckedChange={() => handleToggle(s.id)} /></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => setEditService(s)}><Edit size={14} /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(s.id)}><Trash2 size={14} className="text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function ServiceForm({ initial, onSave }: { initial?: Service | null; onSave: (s: Service) => void }) {
  const [form, setForm] = useState<Omit<Service, "id">>({
    name: initial?.name || "", category: initial?.category || "Hotel",
    basePrice: initial?.basePrice || 0, sellingPrice: initial?.sellingPrice || 0,
    description: initial?.description || "", supplier: initial?.supplier || "", active: initial?.active ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ id: initial?.id || `s${Date.now()}`, ...form });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><Label>Nom *</Label><Input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Catégorie</Label>
          <Select value={form.category} onValueChange={v => setForm(p => ({ ...p, category: v as ServiceCategory }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div><Label>Fournisseur</Label><Input value={form.supplier} onChange={e => setForm(p => ({ ...p, supplier: e.target.value }))} /></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Prix Coût (MAD) *</Label><Input type="number" required min={0} value={form.basePrice} onChange={e => setForm(p => ({ ...p, basePrice: +e.target.value }))} /></div>
        <div><Label>Prix Vente (MAD) *</Label><Input type="number" required min={0} value={form.sellingPrice} onChange={e => setForm(p => ({ ...p, sellingPrice: +e.target.value }))} /></div>
      </div>
      <div><Label>Description</Label><Input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} /></div>
      <Button type="submit" className="w-full">{initial ? "Enregistrer" : "Créer le Service"}</Button>
    </form>
  );
}
