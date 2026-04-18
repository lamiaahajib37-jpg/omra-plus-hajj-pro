// ════════════════════════════════════════════════════════════════════════
// ClientDetail.tsx  —  Fiche Client 360°
// ════════════════════════════════════════════════════════════════════════
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Phone, Mail, MapPin, Calendar, FolderOpen,
  DollarSign, ChevronRight, Plus, Clock, CheckCircle2, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import type { Client } from "./Clients";

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_CLIENT: Client = {
  id: "CL001", nom: "Sentissi", prenom: "Rim", telephone: "+212 6 44 55 66 77",
  email: "r.sentissi@gmail.com", ville: "Casablanca", dateCreation: "2025-09-10",
  statut: "actif", departement: "outbound", nbDossiers: 3, totalCA: 45200, dernierDossier: "DOS012"
};

interface Dossier {
  id: string;
  reference: string;
  titre: string;
  departement: string;
  statut: "en_cours" | "confirmé" | "fermé" | "annulé";
  dateCreation: string;
  montantTotal: number;
  montantPaye: number;
  assigneA: string;
}

const MOCK_DOSSIERS: Dossier[] = [
  { id: "D1", reference: "DOS012", titre: "Dubai Corporate Group — 45 pax", departement: "Outbound", statut: "en_cours", dateCreation: "2026-03-15", montantTotal: 22500, montantPaye: 7500, assigneA: "Youssef El Amrani" },
  { id: "D2", reference: "DOS008", titre: "Barcelona MICE — 30 pax", departement: "MICE", statut: "fermé", dateCreation: "2025-11-20", montantTotal: 14200, montantPaye: 14200, assigneA: "Salma Benkirane" },
  { id: "D3", reference: "DOS005", titre: "Paris Leisure — 4 pax", departement: "Leisure", statut: "fermé", dateCreation: "2025-09-10", montantTotal: 8500, montantPaye: 8500, assigneA: "Youssef El Amrani" },
];

interface Paiement {
  id: string;
  date: string;
  montant: number;
  type: "virement" | "cheque" | "cash" | "carte";
  reference: string;
  dossier: string;
}

const MOCK_PAIEMENTS: Paiement[] = [
  { id: "P1", date: "2026-04-01", montant: 7500, type: "virement", reference: "VIR-2026-0401", dossier: "DOS012" },
  { id: "P2", date: "2025-12-10", montant: 7100, type: "cheque", reference: "CHQ-9834", dossier: "DOS008" },
  { id: "P3", date: "2025-11-20", montant: 7100, type: "virement", reference: "VIR-2025-1120", dossier: "DOS008" },
  { id: "P4", date: "2025-09-15", montant: 8500, type: "carte", reference: "CRD-0915", dossier: "DOS005" },
];

const STATUT_DOSSIER = {
  en_cours: { label: "En cours",  color: "#633806", bg: "#FAEEDA" },
  confirmé: { label: "Confirmé",  color: "#185FA5", bg: "#E6F1FB" },
  fermé:    { label: "Fermé",     color: "#27500A", bg: "#EAF3DE" },
  annulé:   { label: "Annulé",    color: "#791F1F", bg: "#FCEBEB" },
};

const TYPE_PAIEMENT = { virement: "Virement", cheque: "Chèque", cash: "Cash", carte: "Carte" };

// ─── New Dossier Modal ────────────────────────────────────────────────────────
function NewDossierModal({ open, onClose, client }: { open: boolean; onClose: () => void; client: Client }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ titre: "", departement: "outbound", assigneA: "Youssef El Amrani", notes: "" });
  const f = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const submit = () => {
    if (!form.titre) { toast.error("Titre obligatoire"); return; }
    toast.success("Dossier créé — assigné à " + form.assigneA);
    onClose();
    navigate("/dossiers");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Créer un dossier pour {client.prenom} {client.nom}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1"><Label>Titre du dossier *</Label><Input placeholder="ex: Voyage Dubai 45 pax" value={form.titre} onChange={e => f("titre", e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Département</Label>
              <Select value={form.departement} onValueChange={v => f("departement", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="mice">MICE</SelectItem>
                  <SelectItem value="leisure">Leisure</SelectItem>
                  <SelectItem value="hajj_omra">Hajj & Omra</SelectItem>
                  <SelectItem value="outbound">Outbound</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Assigné à</Label>
              <Select value={form.assigneA} onValueChange={v => f("assigneA", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Youssef El Amrani">Youssef El Amrani</SelectItem>
                  <SelectItem value="Salma Benkirane">Salma Benkirane</SelectItem>
                  <SelectItem value="Karim Hamdoune">Karim Hamdoune</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1"><Label>Notes</Label><Textarea rows={2} value={form.notes} onChange={e => f("notes", e.target.value)} /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={submit}>Créer le dossier</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"dossiers" | "paiements">("dossiers");
  const [newDossierOpen, setNewDossierOpen] = useState(false);

  const client = MOCK_CLIENT;
  const soldeRestant = MOCK_DOSSIERS.reduce((a, d) => a + d.montantTotal - d.montantPaye, 0);

  return (
    <div className="p-6 space-y-5 max-w-5xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <button onClick={() => navigate("/clients")} className="flex items-center gap-1 hover:text-foreground transition-colors">
          <ArrowLeft size={14} /> Clients
        </button>
        <ChevronRight size={12} />
        <span className="text-foreground font-medium">{client.prenom} {client.nom}</span>
      </div>

      {/* Profile header */}
      <div className="bg-background border border-border/50 rounded-xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
              {client.prenom[0]}{client.nom[0]}
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">{client.prenom} {client.nom}</h1>
              <div className="flex items-center gap-4 mt-1.5 flex-wrap">
                <a href={`tel:${client.telephone}`} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <Phone size={13} /> {client.telephone}
                </a>
                <a href={`mailto:${client.email}`} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <Mail size={13} /> {client.email}
                </a>
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin size={13} /> {client.ville}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: "#EAF3DE", color: "#27500A" }}>Actif</span>
                <span className="text-xs text-muted-foreground">Client depuis {client.dateCreation}</span>
                <span className="text-xs text-muted-foreground">·</span>
                <span className="text-xs text-muted-foreground">{client.departement.toUpperCase()}</span>
              </div>
            </div>
          </div>

          <Button size="sm" className="gap-1.5" onClick={() => setNewDossierOpen(true)}>
            <Plus size={14} /> Nouveau dossier
          </Button>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-4 gap-4 mt-6 pt-5 border-t border-border/40">
          {[
            { label: "CA total", value: `$${client.totalCA.toLocaleString()}`, icon: <DollarSign size={15} className="text-green-600" /> },
            { label: "Dossiers", value: client.nbDossiers.toString(), icon: <FolderOpen size={15} className="text-primary" /> },
            { label: "Solde restant", value: soldeRestant > 0 ? `$${soldeRestant.toLocaleString()}` : "—", icon: <AlertCircle size={15} className={soldeRestant > 0 ? "text-amber-500" : "text-muted-foreground"} /> },
            { label: "Paiements", value: MOCK_PAIEMENTS.length.toString(), icon: <CheckCircle2 size={15} className="text-teal-600" /> },
          ].map(kpi => (
            <div key={kpi.label} className="bg-secondary/30 rounded-lg p-3">
              <div className="flex items-center gap-1.5 mb-1">{kpi.icon}<span className="text-xs text-muted-foreground">{kpi.label}</span></div>
              <p className="text-lg font-semibold text-foreground">{kpi.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border/50">
        {(["dossiers", "paiements"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px capitalize ${tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            {t === "dossiers" ? `Dossiers (${MOCK_DOSSIERS.length})` : `Paiements (${MOCK_PAIEMENTS.length})`}
          </button>
        ))}
      </div>

      {/* Tab: Dossiers */}
      {tab === "dossiers" && (
        <div className="space-y-3">
          {MOCK_DOSSIERS.map(d => {
            const cfg = STATUT_DOSSIER[d.statut];
            const pct = Math.round((d.montantPaye / d.montantTotal) * 100);
            return (
              <div
                key={d.id}
                className="bg-background border border-border/50 rounded-xl p-4 hover:border-border cursor-pointer transition-all"
                onClick={() => navigate(`/dossiers/${d.id}`)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-muted-foreground">{d.reference}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                      <span className="text-xs text-muted-foreground">{d.departement}</span>
                    </div>
                    <p className="text-sm font-medium text-foreground">{d.titre}</p>
                    <p className="text-xs text-muted-foreground mt-1">{d.dateCreation} · {d.assigneA}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-foreground">${d.montantTotal.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{pct}% payé</p>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="mt-3 h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab: Paiements */}
      {tab === "paiements" && (
        <div className="bg-background border border-border/50 rounded-xl overflow-hidden">
          <table className="w-full" style={{ tableLayout: "fixed" }}>
            <thead>
              <tr className="border-b border-border/50 bg-secondary/30">
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Date</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Montant</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Type</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Référence</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Dossier</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_PAIEMENTS.map(p => (
                <tr key={p.id} className="border-b border-border/30 hover:bg-secondary/20 transition-colors">
                  <td className="py-3 px-4 text-sm text-foreground">{p.date}</td>
                  <td className="py-3 px-4 text-sm font-semibold text-foreground">${p.montant.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-foreground font-medium">{TYPE_PAIEMENT[p.type]}</span>
                  </td>
                  <td className="py-3 px-4 text-xs font-mono text-muted-foreground">{p.reference}</td>
                  <td className="py-3 px-4 text-xs text-primary font-medium">{p.dossier}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Total */}
          <div className="flex justify-between items-center px-4 py-3 border-t border-border/50 bg-secondary/20">
            <span className="text-sm text-muted-foreground">Total encaissé</span>
            <span className="text-sm font-semibold text-foreground">
              ${MOCK_PAIEMENTS.reduce((a, p) => a + p.montant, 0).toLocaleString()}
            </span>
          </div>
        </div>
      )}

      <NewDossierModal open={newDossierOpen} onClose={() => setNewDossierOpen(false)} client={client} />
    </div>
  );
}