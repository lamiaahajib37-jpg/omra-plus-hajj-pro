import { Users, Lock } from "lucide-react";
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

export function DepartmentListRow({ dept, isAdmin, onViewEmployees }: Props) {
  const objBadge = getObjectiveBadgeStyle(dept.objective);
  const barColor = getObjectiveColor(dept.objective);

  return (
    <div className="bg-card rounded-xl border px-5 py-4 hover:border-primary/30 hover:shadow-sm transition-all duration-150 grid grid-cols-[auto_1fr_auto_auto_auto_auto] items-center gap-4">
      {/* Icon */}
      <div className="p-2 rounded-lg shrink-0" style={{ background: dept.bg }}>
        <div className="w-4 h-4 rounded" style={{ background: dept.color, opacity: 0.8 }} />
      </div>

      {/* Name & desc */}
      <div className="min-w-0">
        <p className="font-semibold text-sm text-card-foreground">{dept.name}</p>
        <p className="text-xs text-muted-foreground truncate">{dept.head}</p>
      </div>

      {/* Employees */}
      <div className="text-center min-w-[60px]">
        <p className="text-xs text-muted-foreground mb-0.5">Effectif</p>
        <p className="text-sm font-semibold text-card-foreground">{dept.employees}</p>
      </div>

      {/* Tasks */}
      <div className="text-center min-w-[60px]">
        <p className="text-xs text-muted-foreground mb-0.5">Tâches</p>
        <p className="text-sm font-semibold text-card-foreground">{dept.tasks}</p>
      </div>

      {/* Objective */}
      <div className="min-w-[120px]">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-muted-foreground">Objectif</span>
          <span className="font-semibold" style={{ color: barColor }}>{dept.objective}%</span>
        </div>
        <Progress value={dept.objective} className="h-1.5 bg-secondary" />
        <span
          className="text-[10px] font-medium px-1.5 py-0.5 rounded-full mt-1 inline-block"
          style={objBadge}
        >
          {getObjectiveLabel(dept.objective)}
        </span>
      </div>

      {/* Action */}
      {isAdmin ? (
        <button
          onClick={() => onViewEmployees(dept)}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border border-border hover:bg-accent transition-colors text-card-foreground shrink-0"
        >
          <Users size={13} />
          Employés
        </button>
      ) : (
        <div className="flex items-center gap-1 text-xs text-muted-foreground px-3 py-2 shrink-0">
          <Lock size={12} />
          Admin
        </div>
      )}
    </div>
  );
}