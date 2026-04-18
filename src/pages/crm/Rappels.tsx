import { useState } from "react";
import { Bell, Plus, Trash2, Clock, CheckCircle2, Mail, Calendar, Save } from "lucide-react";
import { mockLeads } from "@/data/crmData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

interface RappelConfig {
  id: string;
  nom: string;
  declencheur: "avant_voyage" | "anniversaire" | "inactivite";
  delaiMois: number;
  canal: "email" | "notification" | "les_deux";
  actif: boolean;
  messageTemplate: string;
}

const defaultRappels: RappelConfig[] = [
  {
    id: "R1",
    nom: "Rappel 6 mois avant voyage",
    declencheur: "avant_voyage",
    delaiMois: 6,
    canal: "email",
    actif: true,
    messageTemplate: "Bonjour {prenom}, votre voyage à {destination} est dans 6 mois. Souhaitez-vous confirmer votre réservation ?",
  },
  {
    id: "R2",
    nom: "Rappel 12 mois avant voyage",
    declencheur: "avant_voyage",
    delaiMois: 12,
    canal: "les_deux",
    actif: true,
    messageTemplate: "Bonjour {prenom}, pensez à préparer votre voyage à {destination} prévu dans 12 mois.",
  },
  {
    id: "R3",
    nom: "Relance client inactif 3 mois",
    declencheur: "inactivite",
    delaiMois: 3,
    canal: "email",
    actif: false,
    messageTemplate: "Bonjour {prenom}, cela fait 3 mois que nous n'avons pas eu de nouvelles. Avez-vous des projets de voyage ?",
  },
];

// Upcoming auto-reminders
const upcomingRappels = mockLeads
  .filter(l => l.rappels.some(r => !r.fait))
  .flatMap(l =>
    l.rappels
      .filter(r => !r.fait)
      .map(r => ({ lead: l, rappel: r }))
  );

export default function Rappels() {
  const [configs, setConfigs] = useState<RappelConfig[]>(defaultRappels);
  const [editId, setEditId] = useState<string | null>(null);

  const toggleActif = (id: string) => {
    setConfigs(configs.map(r => r.id === id ? { ...r, actif: !r.actif } : r));
  };

  const delaiLabel = (mois: number) => mois === 1 ? "1 mois" : `${mois} mois`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Rappels Automatiques</h1>
          <p className="text-sm text-muted-foreground">Configuration des relances automatiques clients</p>
        </div>
        <Button className="gap-2">
          <Plus size={16} /> Nouveau rappel
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-border/50"><CardContent className="p-4">
          <p className="text-xs text-muted-foreground">Rappels configurés</p>
          <p className="text-2xl font-bold">{configs.length}</p>
        </CardContent></Card>
        <Card className="border-border/50"><CardContent className="p-4">
          <p className="text-xs text-muted-foreground">Actifs</p>
          <p className="text-2xl font-bold text-emerald-600">{configs.filter(r => r.actif).length}</p>
        </CardContent></Card>
        <Card className="border-border/50"><CardContent className="p-4">
          <p className="text-xs text-muted-foreground">En attente d'envoi</p>
          <p className="text-2xl font-bold text-amber-600">{upcomingRappels.length}</p>
        </CardContent></Card>
      </div>

      {/* Configured reminders */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Configuration des rappels</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {configs.map((r) => (
            <div
              key={r.id}
              className={`border rounded-xl p-4 transition-colors ${r.actif ? "border-border/50 bg-background" : "border-border/30 bg-muted/20"}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${r.actif ? "bg-primary/10" : "bg-muted"}`}>
                    <Bell size={16} className={r.actif ? "text-primary" : "text-muted-foreground"} />
                  </div>
                  <div>
                    <p className={`font-semibold text-sm ${!r.actif && "text-muted-foreground"}`}>{r.nom}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="outline" className="text-xs">
                        {r.declencheur === "avant_voyage" ? "🗓 Avant voyage" :
                         r.declencheur === "inactivite" ? "😴 Inactivité" : "🎂 Anniversaire"}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">{delaiLabel(r.delaiMois)}</Badge>
                      <Badge variant="outline" className="text-xs">
                        {r.canal === "email" ? "📧 Email" : r.canal === "notification" ? "🔔 Notification" : "📧+🔔 Les deux"}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{r.actif ? "Actif" : "Inactif"}</span>
                    <Switch checked={r.actif} onCheckedChange={() => toggleActif(r.id)} />
                  </div>
                </div>
              </div>
              <div className="bg-muted/40 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Template message:</p>
                <p className="text-xs text-foreground">{r.messageTemplate}</p>
              </div>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline" className="text-xs gap-1" onClick={() => setEditId(r.id)}>
                  Modifier
                </Button>
                <Button size="sm" variant="ghost" className="text-xs gap-1 text-destructive hover:text-destructive">
                  <Trash2 size={11} /> Supprimer
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Upcoming reminders */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock size={16} className="text-amber-500" />
            Rappels à venir ({upcomingRappels.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingRappels.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle2 size={32} className="mx-auto mb-2 text-emerald-500" />
              <p className="text-sm">Aucun rappel en attente 🎉</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingRappels.map(({ lead, rappel }, i) => (
                <div key={i} className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock size={16} className="text-amber-500" />
                    <div>
                      <p className="text-sm font-medium">{lead.prenom} {lead.nom}</p>
                      <p className="text-xs text-muted-foreground">{rappel.note}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar size={12} />
                      {new Date(rappel.date).toLocaleDateString("fr-FR")}
                    </div>
                    <Button size="sm" variant="outline" className="text-xs gap-1">
                      <Mail size={11} /> Envoyer
                    </Button>
                    <Button size="sm" variant="ghost" className="text-xs gap-1 text-emerald-600">
                      <CheckCircle2 size={11} /> Marquer fait
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}