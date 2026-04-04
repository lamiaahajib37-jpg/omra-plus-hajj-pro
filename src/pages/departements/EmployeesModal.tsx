import { X, UserCheck, UserMinus, UserX } from "lucide-react";
import { Employee, getStatusStyle } from "./departements.data";

interface Props {
  deptName: string;
  staff: Employee[];
  onClose: () => void;
}

export function EmployeesModal({ deptName, staff, onClose }: Props) {
  const actifs = staff.filter((e) => e.status === "Actif").length;
  const conges = staff.filter((e) => e.status === "Congé").length;
  const absents = staff.filter((e) => e.status === "Absent").length;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-card rounded-xl border shadow-xl w-full max-w-md max-h-[80vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div>
            <h2 className="font-semibold text-card-foreground">{deptName}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{staff.length} employé{staff.length > 1 ? "s" : ""}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-accent transition-colors text-muted-foreground"
          >
            <X size={16} />
          </button>
        </div>

        {/* Mini stats */}
        <div className="grid grid-cols-3 gap-2 px-5 py-3 border-b bg-muted/30">
          <div className="flex items-center gap-2">
            <UserCheck size={14} className="text-[#3B6D11]" />
            <span className="text-xs text-muted-foreground">Actifs</span>
            <span className="text-xs font-semibold text-card-foreground ml-auto">{actifs}</span>
          </div>
          <div className="flex items-center gap-2">
            <UserMinus size={14} className="text-[#854F0B]" />
            <span className="text-xs text-muted-foreground">Congés</span>
            <span className="text-xs font-semibold text-card-foreground ml-auto">{conges}</span>
          </div>
          <div className="flex items-center gap-2">
            <UserX size={14} className="text-[#A32D2D]" />
            <span className="text-xs text-muted-foreground">Absents</span>
            <span className="text-xs font-semibold text-card-foreground ml-auto">{absents}</span>
          </div>
        </div>

        {/* Employee list */}
        <div className="overflow-y-auto flex-1 divide-y divide-border/50">
          {staff.map((emp, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-accent/40 transition-colors">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
                style={{ background: emp.bg, color: emp.color }}
              >
                {emp.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-card-foreground truncate">{emp.name}</p>
                <p className="text-xs text-muted-foreground truncate">{emp.role}</p>
              </div>
              <span
                className="text-xs font-medium px-2.5 py-1 rounded-full shrink-0"
                style={getStatusStyle(emp.status)}
              >
                {emp.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}