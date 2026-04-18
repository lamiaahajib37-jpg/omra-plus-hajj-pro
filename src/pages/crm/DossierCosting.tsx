import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Download, Plus, Minus, Save, Info } from "lucide-react";
import { ALL_DOSSIERS } from "@/data/allDossiers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Imported from BS structure
const BS_TEMPLATE = [
  {
    jour: "Jour 1 - 27 Avril",
    sections: [
      {
        titre: "Arrivée & Accueil",
        services: [
          { description: "English speaking guide", unite: 2, tarifUnitaire: 150, nb: 1, total: 300 },
          { description: "Hospitality desk - Access Morocco", unite: 1, tarifUnitaire: 170, nb: 1, total: 170 },
          { description: "Simple fast track", unite: 0, tarifUnitaire: 150, nb: 1, total: 0 },
          { description: "Fast track with meet & greet", unite: 0, tarifUnitaire: 200, nb: 1, total: 0 },
        ],
      },
      {
        titre: "Transfert APT → Ville",
        services: [
          { description: "46 seater deluxe bus", unite: 1, tarifUnitaire: 400, nb: 1, total: 400 },
          { description: "15 seater deluxe mini-bus", unite: 0, tarifUnitaire: 250, nb: 1, total: 0 },
          { description: "6 seater deluxe mini-van", unite: 0, tarifUnitaire: 130, nb: 1, total: 0 },
          { description: "Water in the vehicle", unite: 45, tarifUnitaire: 1, nb: 1, total: 45 },
        ],
      },
      {
        titre: "Gifting Experience",
        services: [
          { description: "Pop-up Shop Setup", unite: 1, tarifUnitaire: 1450, nb: 1, total: 1450 },
          { description: "Bracelet - Men", unite: 21, tarifUnitaire: 28, nb: 1, total: 588 },
          { description: "Shoes - Men", unite: 21, tarifUnitaire: 58, nb: 1, total: 1218 },
          { description: "Shoes - Women", unite: 22, tarifUnitaire: 65, nb: 1, total: 1430 },
          { description: "Pashminas (Scarf)", unite: 22, tarifUnitaire: 28, nb: 1, total: 616 },
        ],
      },
    ],
    subtotal: 8529,
  },
  {
    jour: "Jour 2 - 28 Avril",
    sections: [
      {
        titre: "Guides & Staff",
        services: [
          { description: "English speaking guide x4", unite: 4, tarifUnitaire: 150, nb: 1, total: 600 },
          { description: "Hospitality desk with one staff", unite: 1, tarifUnitaire: 170, nb: 1, total: 170 },
        ],
      },
      {
        titre: "AV & Son",
        services: [
          { description: "Sound & lighting system (Basic)", unite: 1, tarifUnitaire: 9400, nb: 1, total: 9400 },
          { description: "Sound system for Violonist and Belly Dancers", unite: 1, tarifUnitaire: 2400, nb: 1, total: 2400 },
        ],
      },
      {
        titre: "Entertainment",
        services: [
          { description: "DJ", unite: 1, tarifUnitaire: 2170, nb: 1, total: 2170 },
          { description: "Violonist starts from", unite: 1, tarifUnitaire: 750, nb: 1, total: 750 },
          { description: "Belly Dancer - Performance", unite: 2, tarifUnitaire: 271, nb: 1, total: 542 },
        ],
      },
    ],
    subtotal: 45703,
  },
  {
    jour: "Jour 4 - 30 Avril (Agafay Gala)",
    sections: [
      {
        titre: "Gala Dinner Setup",
        services: [
          { description: "Privatization of the dinner area", unite: 1, tarifUnitaire: 9500, nb: 1, total: 9500 },
          { description: "Basic logistic (Tables, candles, carpets...)", unite: 1, tarifUnitaire: 6500, nb: 1, total: 6500 },
          { description: "Sound & lighting system", unite: 1, tarifUnitaire: 9400, nb: 1, total: 9400 },
        ],
      },
      {
        titre: "F&B Gala",
        services: [
          { description: "3 courses menu starts from (45 pax)", unite: 45, tarifUnitaire: 95, nb: 1, total: 4275 },
          { description: "Open bar 2hrs per pax", unite: 43, tarifUnitaire: 155, nb: 1, total: 6665 },
          { description: "Welcome cocktail + canapes", unite: 43, tarifUnitaire: 45, nb: 1, total: 1935 },
        ],
      },
      {
        titre: "Entertainment Gala",
        services: [
          { description: "Mini-Jamaa El Fna activation", unite: 1, tarifUnitaire: 14500, nb: 1, total: 14500 },
          { description: "DJ", unite: 1, tarifUnitaire: 2315, nb: 1, total: 2315 },
          { description: "Fire juggler", unite: 1, tarifUnitaire: 271, nb: 1, total: 271 },
        ],
      },
    ],
    subtotal: 98958,
  },
];

type ServiceLine = { description: string; unite: number; tarifUnitaire: number; nb: number; total: number };

export default function DossierCosting() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dossier = ALL_DOSSIERS.find((d) => d.id === id);

  const [data, setData] = useState(BS_TEMPLATE);
  const [margin, setMargin] = useState(15); // %

  if (!dossier) return <div className="p-8 text-center">Dossier introuvable.</div>;

  const grandTotal = data.reduce((acc, j) =>
    acc + j.sections.reduce((a, s) => a + s.services.reduce((x, sv) => x + sv.total, 0), 0), 0
  );
  const totalAvecMarge = grandTotal * (1 + margin / 100);
  const totalParPax = dossier.nombrePax > 0 ? totalAvecMarge / dossier.nombrePax : 0;

  const updateService = (joiIdx: number, secIdx: number, srvIdx: number, field: keyof ServiceLine, value: number | string) => {
    setData(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      const svc = next[joiIdx].sections[secIdx].services[srvIdx];
      (svc as any)[field] = value;
      svc.total = svc.unite * svc.tarifUnitaire * svc.nb;
      // recalc subtotal
      next[joiIdx].subtotal = next[joiIdx].sections.reduce(
        (a: number, s: any) => a + s.services.reduce((x: number, sv: any) => x + sv.total, 0), 0
      );
      return next;
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(`/dossiers/${id}`)}>
          <ArrowLeft size={18} />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">Costing — {dossier.reference}</h1>
          <p className="text-muted-foreground">{dossier.clientNom} • {dossier.nombrePax} pax</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2"><Download size={15} /> Export Excel</Button>
          <Button className="gap-2"><Save size={15} /> Sauvegarder</Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Coût de revient</p>
            <p className="text-2xl font-bold">{grandTotal.toLocaleString()} $</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-muted-foreground">Marge (%)</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setMargin(m => Math.max(0, m - 1))}>
                <Minus size={12} />
              </Button>
              <span className="text-xl font-bold w-10 text-center">{margin}%</span>
              <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setMargin(m => m + 1)}>
                <Plus size={12} />
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="border-emerald-200 border-2">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Prix de vente</p>
            <p className="text-2xl font-bold text-emerald-600">{Math.round(totalAvecMarge).toLocaleString()} $</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Prix par pax</p>
            <p className="text-2xl font-bold">{Math.round(totalParPax).toLocaleString()} $</p>
          </CardContent>
        </Card>
      </div>

      {/* Costing table */}
      {data.map((jour, ji) => {
        const jourTotal = jour.sections.reduce((a, s) => a + s.services.reduce((x, sv) => x + sv.total, 0), 0);
        return (
          <Card key={jour.jour} className="border-border/50 overflow-hidden">
            <div className="bg-primary px-5 py-3 flex items-center justify-between">
              <h3 className="text-primary-foreground font-bold">{jour.jour}</h3>
              <span className="text-primary-foreground/90 font-bold">{jourTotal.toLocaleString()} $</span>
            </div>
            <CardContent className="p-0">
              {/* Header */}
              <div className="grid grid-cols-12 gap-0 px-4 py-2 bg-muted/50 text-xs font-semibold text-muted-foreground border-b border-border">
                <div className="col-span-5">DESCRIPTION</div>
                <div className="col-span-2 text-center">UNIT</div>
                <div className="col-span-2 text-center">RATE ($)</div>
                <div className="col-span-1 text-center">Nº</div>
                <div className="col-span-2 text-right">TOTAL ($)</div>
              </div>

              {jour.sections.map((section, si) => (
                <div key={section.titre}>
                  <div className="px-4 py-1.5 bg-muted/20 border-b border-border/50">
                    <p className="text-xs font-semibold text-primary/80 uppercase tracking-wide">{section.titre}</p>
                  </div>
                  {section.services.map((svc, svi) => (
                    <div
                      key={svi}
                      className={`grid grid-cols-12 gap-0 px-4 py-1.5 border-b border-border/30 items-center text-sm ${svc.total === 0 ? "opacity-50" : ""}`}
                    >
                      <div className="col-span-5 text-sm">{svc.description}</div>
                      <div className="col-span-2 text-center">
                        <Input
                          className="h-6 text-center text-xs border-border/50 w-16 mx-auto"
                          type="number"
                          value={svc.unite}
                          onChange={(e) => updateService(ji, si, svi, "unite", parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-span-2 text-center">
                        <Input
                          className="h-6 text-center text-xs border-border/50 w-20 mx-auto"
                          type="number"
                          value={svc.tarifUnitaire}
                          onChange={(e) => updateService(ji, si, svi, "tarifUnitaire", parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-span-1 text-center">
                        <Input
                          className="h-6 text-center text-xs border-border/50 w-12 mx-auto"
                          type="number"
                          value={svc.nb}
                          onChange={(e) => updateService(ji, si, svi, "nb", parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-span-2 text-right font-semibold text-emerald-600 pr-1">
                        {svc.total.toLocaleString()}
                      </div>
                    </div>
                  ))}
                  {/* Section subtotal */}
                  <div className="grid grid-cols-12 px-4 py-1 border-b border-border/50 bg-muted/10">
                    <div className="col-span-10 text-right text-xs text-muted-foreground">Sous-total {section.titre}</div>
                    <div className="col-span-2 text-right text-xs font-semibold text-emerald-600 pr-1">
                      {section.services.reduce((a, s) => a + s.total, 0).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}

              {/* Day total */}
              <div className="grid grid-cols-12 px-4 py-2 bg-primary/5">
                <div className="col-span-10 text-right text-sm font-bold">Total {jour.jour}</div>
                <div className="col-span-2 text-right font-bold text-emerald-600 pr-1">{jourTotal.toLocaleString()}</div>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Grand Total */}
      <Card className="border-2 border-primary">
        <CardContent className="p-5">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Coût de revient total</span>
              <span className="font-semibold">{grandTotal.toLocaleString()} $</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Marge ({margin}%)</span>
              <span className="font-semibold">{Math.round(grandTotal * margin / 100).toLocaleString()} $</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
              <span>TOTAL VENTE</span>
              <span className="text-emerald-600">{Math.round(totalAvecMarge).toLocaleString()} $</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Prix par pax ({dossier.nombrePax} pax)</span>
              <span className="font-semibold">{Math.round(totalParPax).toLocaleString()} $</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deposits */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Échéancier paiements suggéré</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "1er Acompte (16%)", value: Math.round(totalAvecMarge * 0.16) },
              { label: "2ème Acompte (33%)", value: Math.round(totalAvecMarge * 0.33) },
              { label: "Solde restant", value: Math.round(totalAvecMarge * 0.51) },
            ].map((d) => (
              <div key={d.label} className="text-center p-3 rounded-lg bg-muted/40">
                <p className="text-xs text-muted-foreground mb-1">{d.label}</p>
                <p className="text-lg font-bold text-emerald-600">{d.value.toLocaleString()} $</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}