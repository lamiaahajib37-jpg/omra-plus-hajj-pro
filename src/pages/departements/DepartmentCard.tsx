import { Users, ClipboardList, Target, Lock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Department,
  getObjectiveLabel,
  getObjectiveBadgeStyle,
  getObjectiveColor,
} from "./departements.data";

interface Props {
  dept: Department;
  isAdmin: boolean;
  onViewEmployees: (dept: Department) => void;
}

export function DepartmentCard({ dept, isAdmin, onViewEmployees }: Props) {
  const objBadge = getObjectiveBadgeStyle(dept.objective);
  const barColor = getObjectiveColor(dept.objective);

  return (
    <div className="bg-card rounded-xl border shadow-sm p-5 hover:shadow-md hover:border-primary/30 transition-all duration-200 flex flex-col gap-4">
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className="p-2.5 rounded-lg shrink-0"
            style={{ background: dept.bg }}
          >
            <div className="w-5 h-5 rounded" style={{ background: dept.color, opacity: 0.8 }} />
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground leading-tight">{dept.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{dept.description}</p>
          </div>
        </div>
        <span
          className="text-xs font-medium px-2.5 py-1 rounded-full shrink-0"
          style={objBadge}
        >
          {getObjectiveLabel(dept.objective)}
        </span>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-secondary/50 rounded-lg px-3 py-2.5 flex items-center gap-2">
          <Users size={13} className="text-primary shrink-0" />
          <div>
            <p className="text-[10px] text-muted-foreground">Employés</p>
            <p className="text-sm font-semibold text-card-foreground">{dept.employees}</p>
          </div>
        </div>
        <div className="bg-secondary/50 rounded-lg px-3 py-2.5 flex items-center gap-2">
          <ClipboardList size={13} className="text-primary shrink-0" />
          <div>
            <p className="text-[10px] text-muted-foreground">Tâches</p>
            <p className="text-sm font-semibold text-card-foreground">{dept.tasks}</p>
          </div>
        </div>
      </div>

      {/* Responsable */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Responsable</span>
        <span className="font-medium text-card-foreground truncate ml-2 max-w-[160px]">{dept.head}</span>
      </div>

      {/* Objectif progress */}
      <div>
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="flex items-center gap-1 text-muted-foreground">
            <Target size={12} /> Objectif
          </span>
          <span className="font-semibold" style={{ color: barColor }}>{dept.objective}%</span>
        </div>
        <Progress
          value={dept.objective}
          className="h-1.5 bg-secondary"
          style={{ "--progress-color": barColor } as React.CSSProperties}
        />
      </div>

      {/* CTA */}
      {isAdmin ? (
        <button
          onClick={() => onViewEmployees(dept)}
          className="w-full text-xs font-medium py-2 rounded-lg border border-border hover:bg-accent transition-colors text-card-foreground flex items-center justify-center gap-1.5"
        >
          <Users size={13} />
          Voir les employés ({dept.staff.length})
        </button>
      ) : (
        <div className="w-full text-xs py-2 rounded-lg bg-secondary/50 text-muted-foreground flex items-center justify-center gap-1.5">
          <Lock size={12} />
          Accès administrateur requis
        </div>
      )}
    </div>
  );
}