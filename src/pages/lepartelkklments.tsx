import { useState, useMemo } from "react";
import {
  Building2, Users, Target, LayoutGrid, List,
  Search, SlidersHorizontal, TrendingUp, ClipboardList,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import {
  departments,
  categories,
  Department,
} from "./departements.data";
import { DepartmentCard } from "./DepartmentCard";
import { DepartmentListRow } from "./DepartmentListRow";
import { EmployeesModal } from "./EmployeesModal";

type ViewMode = "grid" | "list";
type SortKey = "name" | "employees" | "objective" | "tasks";

export default function Departements() {
  const { isAdmin } = useAuth();

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);

  // Filtered & sorted list
  const filteredDepts = useMemo(() => {
    let list = departments.filter((d) => {
      const matchSearch =
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.head.toLowerCase().includes(search.toLowerCase());
      const matchFilter = activeFilter === "all" || d.category === activeFilter;
      return matchSearch && matchFilter;
    });

    list.sort((a, b) => {
      if (sortKey === "employees") return b.employees - a.employees;
      if (sortKey === "objective") return b.objective - a.objective;
      if (sortKey === "tasks") return b.tasks - a.tasks;
      return a.name.localeCompare(b.name, "fr");
    });

    return list;
  }, [search, activeFilter, sortKey]);

  // Global stats
  const stats = useMemo(() => {
    const total = departments;
    return {
      count: total.length,
      totalEmployees: total.reduce((s, d) => s + d.employees, 0),
      avgObjective: Math.round(total.reduce((s, d) => s + d.objective, 0) / total.length),
      totalTasks: total.reduce((s, d) => s + d.tasks, 0),
    };
  }, []);

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Départements</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {filteredDepts.length} département{filteredDepts.length > 1 ? "s" : ""} affiché{filteredDepts.length > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Global stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Départements", value: stats.count, icon: Building2 },
          { label: "Total employés", value: stats.totalEmployees, icon: Users },
          { label: "Objectif moyen", value: `${stats.avgObjective}%`, icon: Target },
          { label: "Tâches actives", value: stats.totalTasks, icon: ClipboardList },
        ].map((s) => (
          <div key={s.label} className="bg-card rounded-xl border p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary">
              <s.icon size={16} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-xl font-bold text-card-foreground">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters bar */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>

        {/* Sort */}
        <Select value={sortKey} onValueChange={(v) => setSortKey(v as SortKey)}>
          <SelectTrigger className="h-9 w-[170px] text-sm gap-2">
            <SlidersHorizontal size={14} className="text-muted-foreground shrink-0" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Trier par nom</SelectItem>
            <SelectItem value="employees">Trier par effectif</SelectItem>
            <SelectItem value="objective">Trier par objectif</SelectItem>
            <SelectItem value="tasks">Trier par tâches</SelectItem>
          </SelectContent>
        </Select>

        {/* View toggle */}
        <div className="flex items-center border rounded-lg overflow-hidden h-9">
          <button
            onClick={() => setViewMode("grid")}
            className={`px-3 h-full flex items-center gap-1.5 text-sm transition-colors ${
              viewMode === "grid"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent text-muted-foreground"
            }`}
          >
            <LayoutGrid size={15} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`px-3 h-full flex items-center gap-1.5 text-sm transition-colors ${
              viewMode === "list"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent text-muted-foreground"
            }`}
          >
            <List size={15} />
          </button>
        </div>
      </div>

      {/* Category filter tags */}
      <div className="flex items-center gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveFilter(cat.key)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
              activeFilter === cat.key
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border hover:border-primary/40 text-muted-foreground hover:text-foreground"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Department display */}
      {filteredDepts.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Building2 size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Aucun département trouvé</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredDepts.map((dept) => (
            <DepartmentCard
              key={dept.id}
              dept={dept}
              isAdmin={isAdmin}
              onViewEmployees={setSelectedDept}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredDepts.map((dept) => (
            <DepartmentListRow
              key={dept.id}
              dept={dept}
              isAdmin={isAdmin}
              onViewEmployees={setSelectedDept}
            />
          ))}
        </div>
      )}

      {/* Employees modal (admin only) */}
      {selectedDept && isAdmin && (
        <EmployeesModal
          deptName={selectedDept.name}
          staff={selectedDept.staff}
          onClose={() => setSelectedDept(null)}
        />
      )}
    </div>
  );
}