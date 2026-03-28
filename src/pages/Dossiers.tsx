import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FolderOpen, Search, Filter, Plus, Eye, Edit, Plane, Users,
  CheckCircle2, Clock, AlertCircle, XCircle, DollarSign, FileText
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StatCard } from "@/components/StatCard";

type DossierStatus = "en_cours" | "confirme" | "en_attente" | "annule" | "termine";
type DossierType = "hajj" | "omra" | "tourisme";

interface Dossier {
  id: string;
  ref: string;
  client: { name: string; tel: string; city: string; email: string };
  type: DossierType;
  voyage: string;
  dateDepart: string;
  dateRetour: string;
  status: DossierStatus;
  assignee: string;
  totalCost: number;
  prixVente: number;
  marge: number;
  documents: { name: string; uploaded: boolean }[];
  paiement: { total: number; paye: number };
  createdAt: string;
  updatedAt: string;
  notes: string;
}

const dossiers: Dossier[] = [
  {
    id: "1", ref: "DOS-2026-001",
    client: { name: "Mohammed Alaoui", tel: "+212 6 11 22 33 44", city: "Casablanca", email: "m.alaoui@gmail.com" },
    type: "omra", voyage: "Omra Ramadan 2026", dateDepart: "2026-03-15", dateRetour: "2026-03-30",
    status: "confirme", assignee: "Fatima Zahra Bennani",
    totalCost: 18500, prixVente: 24000, marge: 5500,
    documents: [{ name: "Passeport", uploaded: true }, { name: "Visa", uploaded: true }, { name: "Assurance", uploaded: true }, { name: "Certificat médical", uploaded: false }],
    paiement: { total: 24000, paye: 18000 },
    createdAt: "2026-01-10", updatedAt: "2026-03-25", notes: "Client VIP, 3ème Omra"
  },
  {
    id: "2", ref: "DOS-2026-002",
    client: { name: "Khadija Bennis", tel: "+212 6 22 33 44 55", city: "Rabat", email: "k.bennis@yahoo.fr" },
    type: "hajj", voyage: "Hajj 2026", dateDepart: "2026-06-05", dateRetour: "2026-06-25",
    status: "en_attente", assignee: "Nadia Berrada",
    totalCost: 52000, prixVente: 65000, marge: 13000,
    documents: [{ name: "Passeport", uploaded: true }, { name: "Visa", uploaded: false }, { name: "Assurance", uploaded: false }, { name: "Certificat médical", uploaded: false }],
    paiement: { total: 65000, paye: 20000 },
    createdAt: "2026-02-01", updatedAt: "2026-03-20", notes: "En attente du tirage au sort"
  },
  {
    id: "3", ref: "DOS-2026-003",
    client: { name: "Ahmed Fassi", tel: "+212 6 33 44 55 66", city: "Fès", email: "a.fassi@outlook.com" },
    type: "tourisme", voyage: "Circuit Sahara 5J/4N", dateDepart: "2026-04-10", dateRetour: "2026-04-15",
    status: "en_cours", assignee: "Karim Tazi",
    totalCost: 4200, prixVente: 5800, marge: 1600,
    documents: [{ name: "Passeport", uploaded: true }, { name: "Assurance voyage", uploaded: true }],
    paiement: { total: 5800, paye: 5800 },
    createdAt: "2026-03-01", updatedAt: "2026-03-27", notes: ""
  },
  {
    id: "4", ref: "DOS-2026-004",
    client: { name: "Sara Kettani", tel: "+212 6 44 55 66 77", city: "Tanger", email: "s.kettani@gmail.com" },
    type: "omra", voyage: "Omra Ramadan 2026", dateDepart: "2026-03-15", dateRetour: "2026-03-30",
    status: "confirme", assignee: "Fatima Zahra Bennani",
    totalCost: 19000, prixVente: 24500, marge: 5500,
    documents: [{ name: "Passeport", uploaded: true }, { name: "Visa", uploaded: true }, { name: "Assurance", uploaded: true }, { name: "Certificat médical", uploaded: true }],
    paiement: { total: 24500, paye: 24500 },
    createdAt: "2026-01-15", updatedAt: "2026-03-26", notes: "Paiement complet"
  },
  {
    id: "5", ref: "DOS-2026-005",
    client: { name: "Youssef El Amrani", tel: "+212 6 55 66 77 88", city: "Marrakech", email: "y.amrani@gmail.com" },
    type: "tourisme", voyage: "Séjour Agadir All-Inclusive", dateDepart: "2026-05-01", dateRetour: "2026-05-08",
    status: "en_cours", assignee: "Karim Tazi",
    totalCost: 6800, prixVente: 9200, marge: 2400,
    documents: [{ name: "CIN", uploaded: true }],
    paiement: { total: 9200, paye: 4600 },
    createdAt: "2026-03-10", updatedAt: "2026-03-28", notes: "Famille de 4 personnes"
  },
  {
    id: "6", ref: "DOS-2026-006",
    client: { name: "Amina Chraibi", tel: "+212 6 66 77 88 99", city: "Casablanca", email: "a.chraibi@gmail.com" },
    type: "hajj", voyage: "Hajj 2026", dateDepart: "2026-06-05", dateRetour: "2026-06-25",
    status: "annule", assignee: "Nadia Berrada",
    totalCost: 52000, prixVente: 65000, marge: 13000,
    documents: [{ name: "Passeport", uploaded: true }, { name: "Visa", uploaded: false }],
    paiement: { total: 65000, paye: 10000 },
    createdAt: "2026-01-20", updatedAt: "2026-03-15", notes: "Annulé - raison personnelle, remboursement en cours"
  },
  {
    id: "7", ref: "DOS-2025-048",
    client: { name: "Hassan Idrissi", tel: "+212 6 77 88 99 00", city: "Oujda", email: "h.idrissi@gmail.com" },
    type: "omra", voyage: "Omra Décembre 2025", dateDepart: "2025-12-10", dateRetour: "2025-12-24",
    status: "termine", assignee: "Fatima Zahra Bennani",
    totalCost: 17000, prixVente: 22000, marge: 5000,
    documents: [{ name: "Passeport", uploaded: true }, { name: "Visa", uploaded: true }, { name: "Assurance", uploaded: true }, { name: "Certificat médical", uploaded: true }],
    paiement: { total: 22000, paye: 22000 },
    createdAt: "2025-10-05", updatedAt: "2025-12-26", notes: "Dossier clôturé avec succès"
  },
];

const statusConfig: Record<DossierStatus, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  en_cours: { label: "En cours", color: "bg-blue-100 text-blue-700 border-blue-200", icon: Clock },
  confirme: { label: "Confirmé", color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
  en_attente: { label: "En attente", color: "bg-amber-100 text-amber-700 border-amber-200", icon: AlertCircle },
  annule: { label: "Annulé", color: "bg-red-100 text-red-700 border-red-200", icon: XCircle },
  termine: { label: "Terminé", color: "bg-gray-100 text-gray-600 border-gray-200", icon: CheckCircle2 },
};

const typeLabels: Record<DossierType, string> = { hajj: "Hajj", omra: "Omra", tourisme: "Tourisme" };

export default function Dossiers() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [showNew, setShowNew] = useState(false);

  const filtered = dossiers.filter((d) => {
    const matchSearch = d.client.name.toLowerCase().includes(search.toLowerCase()) || d.ref.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || d.status === filterStatus;
    const matchType = filterType === "all" || d.type === filterType;
    return matchSearch && matchStatus && matchType;
  });

  const totalCA = dossiers.filter(d => d.status !== "annule").reduce((s, d) => s + d.prixVente, 0);
  const totalMarge = dossiers.filter(d => d.status !== "annule").reduce((s, d) => s + d.marge, 0);
  const dossiersActifs = dossiers.filter(d => ["en_cours", "confirme", "en_attente"].includes(d.status)).length;

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gestion des Dossiers</h1>
          <p className="text-sm text-muted-foreground">Gérez les dossiers clients, costing et suivi des voyages</p>
        </div>
        <Dialog open={showNew} onOpenChange={setShowNew}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={16} /> Nouveau Dossier
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Créer un nouveau dossier</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Nom du client</Label><Input placeholder="Nom complet" /></div>
                <div><Label>Téléphone</Label><Input placeholder="+212 6 XX XX XX XX" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Email</Label><Input placeholder="email@exemple.com" /></div>
                <div><Label>Ville</Label><Input placeholder="Casablanca" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Type de voyage</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hajj">Hajj</SelectItem>
                      <SelectItem value="omra">Omra</SelectItem>
                      <SelectItem value="tourisme">Tourisme</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Voyage</Label><Input placeholder="Nom du voyage" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Date départ</Label><Input type="date" /></div>
                <div><Label>Date retour</Label><Input type="date" /></div>
              </div>
              <div><Label>Notes</Label><Textarea placeholder="Remarques..." /></div>
              <Button className="w-full" onClick={() => setShowNew(false)}>Créer le dossier</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Dossiers" value={dossiers.length.toString()} icon={FolderOpen} />
        <StatCard title="Dossiers Actifs" value={dossiersActifs.toString()} icon={Users} />
        <StatCard title="CA Prévisionnel" value={`${(totalCA / 1000).toFixed(0)}K MAD`} icon={DollarSign} />
        <StatCard title="Marge Totale" value={`${(totalMarge / 1000).toFixed(0)}K MAD`} icon={DollarSign} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input placeholder="Rechercher par nom ou réf..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[160px]"><Filter size={14} className="mr-2" /><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="en_cours">En cours</SelectItem>
            <SelectItem value="confirme">Confirmé</SelectItem>
            <SelectItem value="en_attente">En attente</SelectItem>
            <SelectItem value="annule">Annulé</SelectItem>
            <SelectItem value="termine">Terminé</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous types</SelectItem>
            <SelectItem value="hajj">Hajj</SelectItem>
            <SelectItem value="omra">Omra</SelectItem>
            <SelectItem value="tourisme">Tourisme</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Dossier List */}
      <div className="space-y-3">
        {filtered.map((d) => {
          const sc = statusConfig[d.status];
          const StatusIcon = sc.icon;
          const docsReady = d.documents.filter(doc => doc.uploaded).length;
          const docsTotal = d.documents.length;
          const paiementPct = Math.round((d.paiement.paye / d.paiement.total) * 100);

          return (
            <div key={d.id} className="bg-card rounded-xl border shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Left: Client info */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                    {d.client.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold">{d.client.name}</h3>
                      <span className="text-xs text-muted-foreground font-mono">{d.ref}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{d.client.city} • {d.client.tel}</p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <Badge variant="outline" className="text-xs gap-1">
                        <Plane size={10} /> {typeLabels[d.type]} — {d.voyage}
                      </Badge>
                      <Badge className={`text-xs border ${sc.color} gap-1`}>
                        <StatusIcon size={10} /> {sc.label}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Center: Metrics */}
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Documents</p>
                    <p className="font-semibold">{docsReady}/{docsTotal}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Prix</p>
                    <p className="font-semibold">{d.prixVente.toLocaleString()} MAD</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Marge</p>
                    <p className="font-semibold text-primary">{d.marge.toLocaleString()} MAD</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Paiement</p>
                    <div className="flex items-center gap-1.5">
                      <div className="w-16 h-2 rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${paiementPct}%` }} />
                      </div>
                      <span className="text-xs font-medium">{paiementPct}%</span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <Link to={`/dossiers/${d.id}`}>
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <Eye size={14} /> Voir
                    </Button>
                  </Link>
                  <Link to={`/dossiers/${d.id}`}>
                    <Button variant="ghost" size="sm" className="gap-1.5">
                      <Edit size={14} /> Modifier
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <FolderOpen size={48} className="mx-auto mb-3 opacity-30" />
            <p>Aucun dossier trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
}
