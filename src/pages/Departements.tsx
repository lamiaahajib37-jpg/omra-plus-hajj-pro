import { Building2, Users, Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const departments = [
  {
    name: "Commercial",
    head: "Youssef El Amrani",
    employees: 12,
    objective: 85,
    tasks: 24,
    description: "Gestion commerciale, prospection et fidélisation clients"
  },
  {
    name: "Hajj & Omra",
    head: "Fatima Zahra Bennani",
    employees: 15,
    objective: 92,
    tasks: 38,
    description: "Organisation et suivi des pèlerinages Hajj et Omra"
  },
  {
    name: "Tourisme",
    head: "Karim Tazi",
    employees: 10,
    objective: 78,
    tasks: 18,
    description: "Création et gestion des produits touristiques Maroc et international"
  },
  {
    name: "Marketing",
    head: "Amina Chraibi",
    employees: 6,
    objective: 70,
    tasks: 14,
    description: "Communication digitale, branding et campagnes publicitaires"
  },
  {
    name: "Finance & Comptabilité",
    head: "Hassan Ouazzani",
    employees: 5,
    objective: 88,
    tasks: 12,
    description: "Comptabilité, facturation et gestion financière"
  },
];

export default function Departements() {
  return (
    <div className="space-y-6 fade-in">
      <h1 className="text-2xl font-bold">Départements</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {departments.map((d) => (
          <div key={d.name} className="bg-card rounded-xl border shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2.5 rounded-lg bg-secondary">
                <Building2 size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground">{d.name}</h3>
                <p className="text-xs text-muted-foreground">{d.description}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1"><Users size={14} /> Employés</span>
                <span className="font-medium">{d.employees}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Responsable</span>
                <span className="font-medium">{d.head}</span>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground flex items-center gap-1"><Target size={14} /> Objectif</span>
                  <span className="font-medium">{d.objective}%</span>
                </div>
                <Progress value={d.objective} className="h-2 [&>div]:bg-primary" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
