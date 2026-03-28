import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import {
  ArrowLeft, Plane, Phone, Mail, MapPin, FileText, Upload,
  CheckCircle2, Clock, AlertCircle, XCircle, DollarSign,
  Edit, Printer, Download, History, MessageSquare, Send
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

// Mock data for the detail view
const dossierData: Record<string, any> = {
  "1": {
    id: "1", ref: "DOS-2026-001",
    client: { name: "Mohammed Alaoui", tel: "+212 6 11 22 33 44", city: "Casablanca", email: "m.alaoui@gmail.com", cin: "BK123456", dateNaissance: "1985-03-12", nationalite: "Marocaine" },
    type: "omra", voyage: "Omra Ramadan 2026", dateDepart: "2026-03-15", dateRetour: "2026-03-30",
    status: "confirme", assignee: "Fatima Zahra Bennani", dept: "Hajj & Omra",
    documents: [
      { name: "Passeport", uploaded: true, date: "2026-01-12", expiry: "2031-01-12" },
      { name: "Visa Omra", uploaded: true, date: "2026-02-20" },
      { name: "Assurance Voyage", uploaded: true, date: "2026-03-01", expiry: "2026-04-01" },
      { name: "Certificat Médical", uploaded: false },
      { name: "Photo d'identité", uploaded: true, date: "2026-01-12" },
      { name: "Acte de naissance", uploaded: false },
    ],
    costing: {
      vol: { label: "Vol Casablanca → Djeddah A/R", cout: 7500, fournisseur: "Royal Air Maroc" },
      hotel: { label: "Hôtel Makkah (10 nuits) + Médine (5 nuits)", cout: 6500, fournisseur: "Al Safwa Hotels" },
      visa: { label: "Visa Omra", cout: 800, fournisseur: "Consulat Arabie Saoudite" },
      transport: { label: "Transport aéroport + inter-villes", cout: 1200, fournisseur: "Transport Hajj Co." },
      assurance: { label: "Assurance voyage complète", cout: 500, fournisseur: "Saham Assurance" },
      guide: { label: "Guide accompagnateur", cout: 1500, fournisseur: "Interne" },
      divers: { label: "Frais divers (repas, eau zamzam, etc.)", cout: 500, fournisseur: "—" },
    },
    prixVente: 24000,
    paiements: [
      { date: "2026-01-15", montant: 10000, methode: "Virement", ref: "VIR-001" },
      { date: "2026-02-10", montant: 5000, methode: "Espèces", ref: "ESP-012" },
      { date: "2026-03-01", montant: 3000, methode: "Chèque", ref: "CHQ-045" },
    ],
    historique: [
      { date: "2026-03-25", action: "Statut changé → Confirmé", user: "Fatima Zahra" },
      { date: "2026-03-20", action: "Visa Omra reçu et scanné", user: "Fatima Zahra" },
      { date: "2026-03-01", action: "Paiement reçu: 3,000 MAD (Chèque)", user: "Admin" },
      { date: "2026-02-20", action: "Assurance voyage souscrite", user: "Fatima Zahra" },
      { date: "2026-02-10", action: "Paiement reçu: 5,000 MAD (Espèces)", user: "Admin" },
      { date: "2026-01-15", action: "Paiement reçu: 10,000 MAD (Virement)", user: "Admin" },
      { date: "2026-01-12", action: "Documents initiaux uploadés (Passeport, Photo)", user: "Fatima Zahra" },
      { date: "2026-01-10", action: "Dossier créé", user: "Fatima Zahra" },
    ],
    notes: "Client VIP — 3ème Omra avec l'agence. Préfère chambre single. Régime alimentaire: sans gluten.",
  },
};

// Fallback for other IDs
const defaultDossier = dossierData["1"];

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  en_cours: { label: "En cours", color: "bg-blue-100 text-blue-700", icon: Clock },
  confirme: { label: "Confirmé", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  en_attente: { label: "En attente", color: "bg-amber-100 text-amber-700", icon: AlertCircle },
  annule: { label: "Annulé", color: "bg-red-100 text-red-700", icon: XCircle },
  termine: { label: "Terminé", color: "bg-gray-100 text-gray-600", icon: CheckCircle2 },
};

export default function DossierDetail() {
  const { id } = useParams();
  const d = dossierData[id || "1"] || defaultDossier;
  const sc = statusConfig[d.status];
  const StatusIcon = sc.icon;

  const costingItems = Object.values(d.costing) as { label: string; cout: number; fournisseur: string }[];
  const totalCost = costingItems.reduce((s, c) => s + c.cout, 0);
  const marge = d.prixVente - totalCost;
  const margePct = Math.round((marge / d.prixVente) * 100);

  const totalPaye = d.paiements.reduce((s: number, p: any) => s + p.montant, 0);
  const reste = d.prixVente - totalPaye;
  const paiementPct = Math.round((totalPaye / d.prixVente) * 100);

  const docsReady = d.documents.filter((doc: any) => doc.uploaded).length;

  const [noteText, setNoteText] = useState("");

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Link to="/dossiers">
            <Button variant="ghost" size="icon"><ArrowLeft size={20} /></Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{d.ref}</h1>
              <Badge className={`${sc.color} gap-1`}><StatusIcon size={12} /> {sc.label}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              <Plane size={14} className="inline mr-1" />{d.voyage} • {d.dateDepart} → {d.dateRetour}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue={d.status}>
            <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="en_cours">En cours</SelectItem>
              <SelectItem value="confirme">Confirmé</SelectItem>
              <SelectItem value="en_attente">En attente</SelectItem>
              <SelectItem value="annule">Annulé</SelectItem>
              <SelectItem value="termine">Terminé</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="gap-1.5"><Printer size={14} /> Imprimer</Button>
          <Button variant="outline" size="sm" className="gap-1.5"><Download size={14} /> Exporter</Button>
        </div>
      </div>

      {/* Client card */}
      <div className="bg-card rounded-xl border p-5">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
            {d.client.name.split(" ").map((n: string) => n[0]).join("")}
          </div>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <p className="text-xs text-muted-foreground">Nom complet</p>
              <p className="font-semibold">{d.client.name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground flex items-center gap-1"><Phone size={10} /> Téléphone</p>
              <p className="font-medium">{d.client.tel}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground flex items-center gap-1"><Mail size={10} /> Email</p>
              <p className="font-medium">{d.client.email}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin size={10} /> Ville</p>
              <p className="font-medium">{d.client.city}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">CIN</p>
              <p className="font-medium">{d.client.cin}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Date de naissance</p>
              <p className="font-medium">{d.client.dateNaissance}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Nationalité</p>
              <p className="font-medium">{d.client.nationalite}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Employé assigné</p>
              <p className="font-medium">{d.assignee} <span className="text-xs text-muted-foreground">({d.dept})</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="costing" className="w-full">
        <TabsList className="w-full justify-start bg-muted/50 flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="costing" className="gap-1.5"><DollarSign size={14} /> Costing</TabsTrigger>
          <TabsTrigger value="documents" className="gap-1.5"><FileText size={14} /> Documents ({docsReady}/{d.documents.length})</TabsTrigger>
          <TabsTrigger value="paiements" className="gap-1.5"><DollarSign size={14} /> Paiements</TabsTrigger>
          <TabsTrigger value="historique" className="gap-1.5"><History size={14} /> Historique</TabsTrigger>
          <TabsTrigger value="notes" className="gap-1.5"><MessageSquare size={14} /> Notes</TabsTrigger>
        </TabsList>

        {/* COSTING TAB */}
        <TabsContent value="costing" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 bg-card rounded-xl border overflow-hidden">
              <div className="p-4 border-b bg-muted/30">
                <h3 className="font-semibold">Détail du costing</h3>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b text-xs text-muted-foreground">
                    <th className="text-left p-3">Poste</th>
                    <th className="text-left p-3">Fournisseur</th>
                    <th className="text-right p-3">Coût (MAD)</th>
                  </tr>
                </thead>
                <tbody>
                  {costingItems.map((c, i) => (
                    <tr key={i} className="border-b last:border-0 hover:bg-muted/20">
                      <td className="p-3 text-sm">{c.label}</td>
                      <td className="p-3 text-sm text-muted-foreground">{c.fournisseur}</td>
                      <td className="p-3 text-sm text-right font-medium">{c.cout.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 font-semibold">
                    <td className="p-3" colSpan={2}>Total Coût de Revient</td>
                    <td className="p-3 text-right">{totalCost.toLocaleString()} MAD</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Summary */}
            <div className="space-y-4">
              <div className="bg-card rounded-xl border p-5 space-y-4">
                <h3 className="font-semibold">Résumé financier</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Coût de revient</span>
                    <span className="font-medium">{totalCost.toLocaleString()} MAD</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Prix de vente</span>
                    <span className="font-semibold">{d.prixVente.toLocaleString()} MAD</span>
                  </div>
                  <div className="h-px bg-border" />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Marge brute</span>
                    <span className="font-bold text-primary">{marge.toLocaleString()} MAD</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Taux de marge</span>
                    <span className="font-bold text-primary">{margePct}%</span>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl border p-5 space-y-3">
                <h3 className="font-semibold">Paiement client</h3>
                <Progress value={paiementPct} className="h-3" />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Payé: {totalPaye.toLocaleString()} MAD</span>
                  <span className="font-medium">Reste: {reste.toLocaleString()} MAD</span>
                </div>
              </div>

              <Button className="w-full gap-2"><Edit size={14} /> Modifier le costing</Button>
            </div>
          </div>
        </TabsContent>

        {/* DOCUMENTS TAB */}
        <TabsContent value="documents" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {d.documents.map((doc: any, i: number) => (
              <div key={i} className={`bg-card rounded-xl border p-4 flex items-start gap-3 ${!doc.uploaded ? "border-dashed opacity-70" : ""}`}>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${doc.uploaded ? "bg-emerald-100 text-emerald-600" : "bg-muted text-muted-foreground"}`}>
                  {doc.uploaded ? <CheckCircle2 size={20} /> : <Upload size={20} />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{doc.name}</p>
                  {doc.uploaded ? (
                    <p className="text-xs text-muted-foreground">Uploadé le {doc.date}{doc.expiry ? ` • Exp: ${doc.expiry}` : ""}</p>
                  ) : (
                    <p className="text-xs text-amber-600">Non fourni</p>
                  )}
                </div>
                <Button variant={doc.uploaded ? "ghost" : "outline"} size="sm" className="text-xs">
                  {doc.uploaded ? "Voir" : "Uploader"}
                </Button>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Button variant="outline" className="gap-2"><Upload size={14} /> Ajouter un document</Button>
          </div>
        </TabsContent>

        {/* PAIEMENTS TAB */}
        <TabsContent value="paiements" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 bg-card rounded-xl border overflow-hidden">
              <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
                <h3 className="font-semibold">Historique des paiements</h3>
                <Button size="sm" className="gap-1.5"><Plus size={14} /> Ajouter</Button>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b text-xs text-muted-foreground">
                    <th className="text-left p-3">Date</th>
                    <th className="text-left p-3">Méthode</th>
                    <th className="text-left p-3">Référence</th>
                    <th className="text-right p-3">Montant (MAD)</th>
                  </tr>
                </thead>
                <tbody>
                  {d.paiements.map((p: any, i: number) => (
                    <tr key={i} className="border-b last:border-0 hover:bg-muted/20">
                      <td className="p-3 text-sm">{p.date}</td>
                      <td className="p-3 text-sm"><Badge variant="outline" className="text-xs">{p.methode}</Badge></td>
                      <td className="p-3 text-sm text-muted-foreground font-mono">{p.ref}</td>
                      <td className="p-3 text-sm text-right font-semibold">{p.montant.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 font-semibold">
                    <td className="p-3" colSpan={3}>Total payé</td>
                    <td className="p-3 text-right">{totalPaye.toLocaleString()} MAD</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="bg-card rounded-xl border p-5 space-y-4">
              <h3 className="font-semibold">Situation</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Total facturé</span><span>{d.prixVente.toLocaleString()} MAD</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Total payé</span><span className="text-emerald-600 font-medium">{totalPaye.toLocaleString()} MAD</span></div>
                <div className="h-px bg-border" />
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Reste à payer</span><span className={`font-bold ${reste > 0 ? "text-amber-600" : "text-emerald-600"}`}>{reste.toLocaleString()} MAD</span></div>
              </div>
              <Progress value={paiementPct} className="h-3" />
              <p className="text-xs text-center text-muted-foreground">{paiementPct}% payé</p>
              {reste > 0 && <Button className="w-full gap-2" variant="outline"><Send size={14} /> Envoyer rappel</Button>}
            </div>
          </div>
        </TabsContent>

        {/* HISTORIQUE TAB */}
        <TabsContent value="historique" className="mt-4">
          <div className="bg-card rounded-xl border p-5">
            <div className="relative pl-6 space-y-6">
              <div className="absolute left-[11px] top-2 bottom-2 w-px bg-border" />
              {d.historique.map((h: any, i: number) => (
                <div key={i} className="relative flex items-start gap-4">
                  <div className="absolute left-[-17px] w-3 h-3 rounded-full bg-primary border-2 border-card mt-1.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{h.action}</p>
                    <p className="text-xs text-muted-foreground">{h.date} • par {h.user}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* NOTES TAB */}
        <TabsContent value="notes" className="mt-4">
          <div className="bg-card rounded-xl border p-5 space-y-4">
            <div className="bg-muted/30 rounded-lg p-4">
              <p className="text-sm">{d.notes}</p>
            </div>
            <div className="flex gap-2">
              <Textarea
                placeholder="Ajouter une note..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="flex-1"
              />
              <Button className="shrink-0 gap-1.5" disabled={!noteText.trim()}>
                <Send size={14} /> Envoyer
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Plus({ size, className }: { size: number; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" x2="12" y1="5" y2="19" /><line x1="5" x2="19" y1="12" y2="12" /></svg>
  );
}
