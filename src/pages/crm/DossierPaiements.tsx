import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Plus, CheckCircle2, Clock, DollarSign, AlertCircle } from "lucide-react";
import { ALL_DOSSIERS } from "@/data/allDossiers";
import { type PaiementMode } from "@/data/crmData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const modeIcons: Record<PaiementMode, string> = {
  virement: "🏦",
  cheque: "📄",
  especes: "💵",
  carte: "💳",
};

export default function DossierPaiements() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dossier = ALL_DOSSIERS.find((d) => d.id === id);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    montant: "",
    mode: "virement" as PaiementMode,
    reference: "",
    note: "",
    date: new Date().toISOString().split("T")[0],
  });

  if (!dossier) return <div className="p-8 text-center">Dossier introuvable.</div>;

  const solde = dossier.totalContrat - dossier.totalPaye;
  const pct = Math.round((dossier.totalPaye / dossier.totalContrat) * 100);

  // Suggested tranches
  const tranches = [
    { label: "1er Acompte (16%)", montant: Math.round(dossier.totalContrat * 0.16), statut: "paye" },
    { label: "2ème Acompte (33%)", montant: Math.round(dossier.totalContrat * 0.33), statut: "paye" },
    { label: "Solde restant (51%)", montant: Math.round(dossier.totalContrat * 0.51), statut: "en_attente" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(`/dossiers/${id}`)}>
          <ArrowLeft size={18} />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">Paiements — {dossier.reference}</h1>
          <p className="text-muted-foreground">{dossier.clientNom}</p>
        </div>
        <Button className="gap-2" onClick={() => setShowForm(!showForm)}>
          <Plus size={16} /> Nouveau paiement
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total contrat</p>
            <p className="text-2xl font-bold">{dossier.totalContrat.toLocaleString()} $</p>
          </CardContent>
        </Card>
        <Card className="border-2 border-emerald-300">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Encaissé</p>
            <p className="text-2xl font-bold text-emerald-600">{dossier.totalPaye.toLocaleString()} $</p>
          </CardContent>
        </Card>
        <Card className={`border-2 ${solde > 0 ? "border-amber-300" : "border-emerald-300"}`}>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Solde restant</p>
            <p className={`text-2xl font-bold ${solde > 0 ? "text-amber-600" : "text-emerald-600"}`}>
              {solde.toLocaleString()} $
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progress bar */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium">Progression des paiements</span>
            <span className="font-bold text-emerald-600">{pct}%</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>0 $</span>
            <span>{dossier.totalContrat.toLocaleString()} $</span>
          </div>
        </CardContent>
      </Card>

      {/* New payment form */}
      {showForm && (
        <Card className="border-primary border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Enregistrer un paiement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Montant ($)</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={form.montant}
                  onChange={(e) => setForm({ ...form, montant: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Mode de paiement</Label>
                <Select value={form.mode} onValueChange={(v) => setForm({ ...form, mode: v as PaiementMode })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="virement">🏦 Virement bancaire</SelectItem>
                    <SelectItem value="cheque">📄 Chèque</SelectItem>
                    <SelectItem value="especes">💵 Espèces</SelectItem>
                    <SelectItem value="carte">💳 Carte bancaire</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Référence</Label>
                <Input
                  placeholder="Nº virement / chèque..."
                  value={form.reference}
                  onChange={(e) => setForm({ ...form, reference: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Note (optionnel)</Label>
                <Input
                  placeholder="Ex: 2ème acompte..."
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button disabled={!form.montant} className="gap-2">
                <CheckCircle2 size={14} /> Enregistrer
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Annuler</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tranches suggérées */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Échéancier</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tranches.map((t, i) => (
              <div
                key={i}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  t.statut === "paye" ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  {t.statut === "paye" ? (
                    <CheckCircle2 size={18} className="text-emerald-600" />
                  ) : (
                    <Clock size={18} className="text-amber-500" />
                  )}
                  <span className="text-sm font-medium">{t.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-sm">{t.montant.toLocaleString()} $</span>
                  <Badge variant={t.statut === "paye" ? "default" : "secondary"} className={t.statut === "paye" ? "bg-emerald-600 text-xs" : "text-xs"}>
                    {t.statut === "paye" ? "✓ Payé" : "En attente"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment history */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Historique des paiements ({dossier.paiements.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {dossier.paiements.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun paiement enregistré.</p>
          ) : (
            <div className="space-y-3">
              {dossier.paiements.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-4 border border-border/50 rounded-xl hover:border-primary/20 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${p.valide ? "bg-emerald-50" : "bg-amber-50"}`}>
                      {modeIcons[p.mode]}
                    </div>
                    <div>
                      <p className="font-semibold">{p.montant.toLocaleString()} $</p>
                      <p className="text-xs text-muted-foreground">{p.note}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm capitalize font-medium">{p.mode}</p>
                    {p.reference && <p className="text-xs text-muted-foreground">{p.reference}</p>}
                    <p className="text-xs text-muted-foreground">{new Date(p.date).toLocaleDateString("fr-FR")}</p>
                  </div>
                  <Badge variant={p.valide ? "default" : "secondary"} className={p.valide ? "bg-emerald-600" : ""}>
                    {p.valide ? "✓ Validé" : "En attente"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}