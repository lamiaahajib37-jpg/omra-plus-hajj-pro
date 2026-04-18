import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Plus, Trash2, CheckCircle2, Save, Download, Send, ChevronDown, ChevronUp } from "lucide-react";
import { ALL_DOSSIERS } from "@/data/allDossiers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

// Service categories from BS
const CATEGORIES = ["Transport", "Guide", "Staff", "Hébergement", "F&B", "Activité", "Entertainment", "AV", "Événement", "Divers"];

interface ServiceRow {
  id: string;
  jour: string;
  description: string;
  unite: number;
  tarifUnitaire: number;
  nb: number;
  total: number;
  categorie: string;
  optionnel: boolean;
  inclus: boolean;
}

export default function DossierPresentation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dossier = ALL_DOSSIERS.find((d) => d.id === id);

  const lastV = dossier?.presentations[dossier.presentations.length - 1];
  const version = (lastV?.version || 0) + 1;

  const [services, setServices] = useState<ServiceRow[]>(
    lastV?.services?.map(s => ({ ...s })) || []
  );
  const [notes, setNotes] = useState("");
  const [collapsedDays, setCollapsedDays] = useState<Set<string>>(new Set());

  if (!dossier) return <div className="p-8 text-center text-muted-foreground">Dossier introuvable.</div>;

  const totalHT = services.filter(s => s.inclus).reduce((acc, s) => acc + s.total, 0);
  const totalParPax = dossier.nombrePax > 0 ? totalHT / dossier.nombrePax : 0;

  // Group by jour
  const jours = Array.from(new Set(services.map(s => s.jour)));

  const addService = (jour?: string) => {
    const newService: ServiceRow = {
      id: `s${Date.now()}`,
      jour: jour || (jours[0] || "Jour 1"),
      description: "",
      unite: 1,
      tarifUnitaire: 0,
      nb: 1,
      total: 0,
      categorie: "Divers",
      optionnel: false,
      inclus: true,
    };
    setServices([...services, newService]);
  };

  const updateService = (sid: string, field: keyof ServiceRow, value: any) => {
    setServices(services.map(s => {
      if (s.id !== sid) return s;
      const updated = { ...s, [field]: value };
      if (["unite", "tarifUnitaire", "nb"].includes(field)) {
        updated.total = updated.unite * updated.tarifUnitaire * updated.nb;
      }
      return updated;
    }));
  };

  const removeService = (sid: string) => {
    setServices(services.filter(s => s.id !== sid));
  };

  const toggleDay = (jour: string) => {
    const next = new Set(collapsedDays);
    next.has(jour) ? next.delete(jour) : next.add(jour);
    setCollapsedDays(next);
  };

  const dayTotal = (jour: string) =>
    services.filter(s => s.jour === jour && s.inclus).reduce((a, s) => a + s.total, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(`/dossiers/${id}`)}>
          <ArrowLeft size={18} />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">
            Présentation V{version}
          </h1>
          <p className="text-muted-foreground">{dossier.reference} — {dossier.clientNom}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2"><Download size={15} /> Exporter</Button>
          <Button variant="outline" className="gap-2"><Send size={15} /> Envoyer client</Button>
          <Button className="gap-2"><Save size={15} /> Sauvegarder V{version}</Button>
        </div>
      </div>

      {/* Totals banner */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border-border/50 col-span-2">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total HT (services inclus)</p>
            <p className="text-3xl font-bold text-emerald-600">{totalHT.toLocaleString()} $</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Par pax ({dossier.nombrePax} pax)</p>
            <p className="text-2xl font-bold">{totalParPax.toFixed(0)} $</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Lignes de service</p>
            <p className="text-2xl font-bold">{services.filter(s => s.inclus).length} / {services.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Services table */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Services du programme</CardTitle>
            <Button size="sm" className="gap-2" onClick={() => addService()}>
              <Plus size={14} /> Ajouter ligne
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Column headers */}
          <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-muted/50 text-xs font-semibold text-muted-foreground border-b border-border">
            <div className="col-span-1">Inclus</div>
            <div className="col-span-3">Description</div>
            <div className="col-span-2">Catégorie</div>
            <div className="col-span-1 text-center">Unité</div>
            <div className="col-span-1 text-center">Tarif $</div>
            <div className="col-span-1 text-center">Nº</div>
            <div className="col-span-2 text-right">Total $</div>
            <div className="col-span-1"></div>
          </div>

          {jours.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">
              Aucun service. Cliquez sur "Ajouter ligne" pour commencer.
            </div>
          )}

          {jours.map((jour) => (
            <div key={jour}>
              {/* Day header */}
              <div
                className="flex items-center justify-between px-4 py-2 bg-primary/5 border-b border-border cursor-pointer hover:bg-primary/10 transition-colors"
                onClick={() => toggleDay(jour)}
              >
                <div className="flex items-center gap-2">
                  {collapsedDays.has(jour) ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                  <span className="text-sm font-semibold text-primary">{jour}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-emerald-600">{dayTotal(jour).toLocaleString()} $</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 text-xs gap-1"
                    onClick={(e) => { e.stopPropagation(); addService(jour); }}
                  >
                    <Plus size={11} /> Ajouter
                  </Button>
                </div>
              </div>

              {!collapsedDays.has(jour) && services.filter(s => s.jour === jour).map((s) => (
                <div
                  key={s.id}
                  className={`grid grid-cols-12 gap-2 px-4 py-2 border-b border-border/50 items-center text-sm ${!s.inclus ? "opacity-40" : ""}`}
                >
                  <div className="col-span-1 flex items-center">
                    <Checkbox
                      checked={s.inclus}
                      onCheckedChange={(v) => updateService(s.id, "inclus", !!v)}
                    />
                  </div>
                  <div className="col-span-3">
                    <Input
                      className="h-7 text-xs border-0 bg-transparent hover:bg-muted/40 focus:bg-background"
                      value={s.description}
                      onChange={(e) => updateService(s.id, "description", e.target.value)}
                      placeholder="Description du service..."
                    />
                  </div>
                  <div className="col-span-2">
                    <select
                      className="w-full h-7 text-xs rounded bg-transparent border-0 hover:bg-muted/40 text-muted-foreground"
                      value={s.categorie}
                      onChange={(e) => updateService(s.id, "categorie", e.target.value)}
                    >
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="col-span-1">
                    <Input
                      className="h-7 text-xs text-center border-0 bg-transparent hover:bg-muted/40"
                      type="number"
                      value={s.unite}
                      onChange={(e) => updateService(s.id, "unite", parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="col-span-1">
                    <Input
                      className="h-7 text-xs text-center border-0 bg-transparent hover:bg-muted/40"
                      type="number"
                      value={s.tarifUnitaire}
                      onChange={(e) => updateService(s.id, "tarifUnitaire", parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="col-span-1">
                    <Input
                      className="h-7 text-xs text-center border-0 bg-transparent hover:bg-muted/40"
                      type="number"
                      value={s.nb}
                      onChange={(e) => updateService(s.id, "nb", parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="col-span-2 text-right">
                    <span className="font-semibold text-emerald-600">{s.total.toLocaleString()} $</span>
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-destructive"
                      onClick={() => removeService(s.id)}
                    >
                      <Trash2 size={12} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ))}

          {/* Grand Total row */}
          {services.length > 0 && (
            <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-muted/30 items-center">
              <div className="col-span-10 text-right text-sm font-bold">TOTAL HT</div>
              <div className="col-span-2 text-right text-lg font-bold text-emerald-600">
                {totalHT.toLocaleString()} $
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notes */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Notes internes (V{version})</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Notes sur cette version de la présentation..."
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Previous versions */}
      {dossier.presentations.length > 0 && (
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Versions précédentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[...dossier.presentations].reverse().map((p) => (
              <div key={p.version} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <div className="flex items-center gap-3">
                  <Badge variant="outline">V{p.version}</Badge>
                  <span className="text-sm text-muted-foreground">{new Date(p.dateCreation).toLocaleDateString("fr-FR")}</span>
                  {p.valideParClient && (
                    <span className="text-xs text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 size={11} /> Validée
                    </span>
                  )}
                </div>
                <span className="font-semibold text-emerald-600">{p.totalHT.toLocaleString()} $</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}