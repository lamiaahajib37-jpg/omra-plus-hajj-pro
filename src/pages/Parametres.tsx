import { Building2, Bell, Shield, Globe } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function Parametres() {
  return (
    <div className="space-y-6 fade-in max-w-3xl">
      <h1 className="text-2xl font-bold">Paramètres</h1>

      {/* Agency Info */}
      <div className="bg-card rounded-xl border shadow-sm p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-lg bg-secondary"><Building2 size={20} className="text-primary" /></div>
          <h3 className="font-semibold">Informations Agence</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Nom de l'agence</Label>
            <Input defaultValue="Access Morocco" />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input defaultValue="contact@accessmorocco.ma" />
          </div>
          <div className="space-y-2">
            <Label>Téléphone</Label>
            <Input defaultValue="+212 5 22 45 67 89" />
          </div>
          <div className="space-y-2">
            <Label>Adresse</Label>
            <Input defaultValue="123 Boulevard Zerktouni, Casablanca" />
          </div>
          <div className="space-y-2">
            <Label>Site web</Label>
            <Input defaultValue="www.accessmorocco.ma" />
          </div>
          <div className="space-y-2">
            <Label>RC / IF</Label>
            <Input defaultValue="RC 123456 — IF 789012" />
          </div>
        </div>
        <Button className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90">Enregistrer</Button>
      </div>

      {/* Notifications */}
      <div className="bg-card rounded-xl border shadow-sm p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-lg bg-secondary"><Bell size={20} className="text-primary" /></div>
          <h3 className="font-semibold">Notifications</h3>
        </div>
        <div className="space-y-4">
          {[
            { label: "Alertes de retard", desc: "Notification quand un employé arrive en retard" },
            { label: "Absences non justifiées", desc: "Alerte pour les absences sans justification" },
            { label: "Mises à jour des tâches", desc: "Notifications de changement de statut des tâches" },
            { label: "Objectifs atteints", desc: "Notification quand un objectif est complété" },
            { label: "Nouvelles factures", desc: "Alerte à la génération d'une nouvelle facture" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <Switch defaultChecked={i < 3} />
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="bg-card rounded-xl border shadow-sm p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-lg bg-secondary"><Shield size={20} className="text-primary" /></div>
          <h3 className="font-semibold">Sécurité</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Authentification à deux facteurs</p>
              <p className="text-xs text-muted-foreground">Ajouter une couche de sécurité supplémentaire</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Session auto-expiration</p>
              <p className="text-xs text-muted-foreground">Déconnexion automatique après 30 min d'inactivité</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Button variant="outline">Changer le mot de passe</Button>
        </div>
      </div>
    </div>
  );
}
