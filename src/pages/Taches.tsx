import { Badge } from "@/components/ui/badge";

interface Task {
  id: number;
  title: string;
  assignee: string;
  dossier?: string;
  priority: "Haute" | "Moyenne" | "Basse";
}

const columns: { title: string; status: string; tasks: Task[] }[] = [
  {
    title: "À faire", status: "todo", tasks: [
      { id: 1, title: "Préparer dossier visa Groupe Hajj Avril", assignee: "Fatima Zahra", dossier: "Dossier Hajj #042", priority: "Haute" },
      { id: 2, title: "Relancer fournisseur hôtel Medina", assignee: "Karim Tazi", priority: "Moyenne" },
      { id: 3, title: "Créer campagne Omra Ramadan", assignee: "Amina Chraibi", priority: "Haute" },
    ]
  },
  {
    title: "En cours", status: "progress", tasks: [
      { id: 4, title: "Vérifier assurances pèlerins Mars", assignee: "Nadia Berrada", dossier: "Dossier Omra #038", priority: "Haute" },
      { id: 5, title: "Mettre à jour tarifs été 2026", assignee: "Youssef El Amrani", priority: "Moyenne" },
    ]
  },
  {
    title: "Terminé", status: "done", tasks: [
      { id: 6, title: "Facturation Groupe Tourisme Fès", assignee: "Hassan Ouazzani", dossier: "Dossier #035", priority: "Basse" },
      { id: 7, title: "Formation nouvelles recrues", assignee: "Youssef El Amrani", priority: "Moyenne" },
    ]
  },
];

const priorityColors: Record<string, string> = {
  "Haute": "bg-destructive text-destructive-foreground",
  "Moyenne": "bg-warning text-warning-foreground",
  "Basse": "bg-muted text-muted-foreground",
};

export default function Taches() {
  return (
    <div className="space-y-6 fade-in">
      <h1 className="text-2xl font-bold">Gestion des Tâches</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {columns.map((col) => (
          <div key={col.status} className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">{col.title}</h3>
              <Badge variant="secondary">{col.tasks.length}</Badge>
            </div>
            <div className="space-y-3">
              {col.tasks.map((task) => (
                <div key={task.id} className="bg-card rounded-xl border p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-medium text-card-foreground">{task.title}</h4>
                    <Badge className={priorityColors[task.priority]} variant="secondary">{task.priority}</Badge>
                  </div>
                  {task.dossier && <p className="text-xs text-primary font-medium mb-2">{task.dossier}</p>}
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                      {task.assignee.charAt(0)}
                    </div>
                    <span className="text-xs text-muted-foreground">{task.assignee}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
