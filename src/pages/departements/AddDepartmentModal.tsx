import { useState } from "react";
import { X, Building2, User, Tag, Users, Target, ClipboardList, Palette } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories } from "./departements.data";

interface NewDepartment {
  name: string;
  head: string;
  category: string;
  employees: number;
  objective: number;
  tasks: number;
  color: string;
}

interface AddDepartmentModalProps {
  onClose: () => void;
  onAdd: (dept: NewDepartment) => void;
}

const COLORS = [
  { label: "Bleu", value: "#3b82f6" },
  { label: "Violet", value: "#8b5cf6" },
  { label: "Emeraude", value: "#10b981" },
  { label: "Orange", value: "#f97316" },
  { label: "Rose", value: "#ec4899" },
  { label: "Cyan", value: "#06b6d4" },
  { label: "Ambre", value: "#f59e0b" },
  { label: "Rouge", value: "#ef4444" },
];

const initialForm: NewDepartment = {
  name: "",
  head: "",
  category: "",
  employees: 0,
  objective: 0,
  tasks: 0,
  color: "#3b82f6",
};

export function AddDepartmentModal({ onClose, onAdd }: AddDepartmentModalProps) {
  const [form, setForm] = useState<NewDepartment>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof NewDepartment, string>>>({});

  const set = (key: keyof NewDepartment, value: string | number) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const validate = () => {
    const errs: typeof errors = {};
    if (!form.name.trim()) errs.name = "Le nom est requis";
    if (!form.head.trim()) errs.head = "Le responsable est requis";
    if (!form.category) errs.category = "La catégorie est requise";
    if (form.employees < 0) errs.employees = "Valeur invalide";
    if (form.objective < 0 || form.objective > 100) errs.objective = "Entre 0 et 100";
    if (form.tasks < 0) errs.tasks = "Valeur invalide";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onAdd(form);
    onClose();
  };

  // Filtered categories (exclude "all")
  const deptCategories = categories.filter((c) => c.key !== "all");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-card border rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Building2 size={18} className="text-primary" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-card-foreground">
                Ajouter un département
              </h2>
              <p className="text-xs text-muted-foreground">
                Remplissez tous les champs pour créer un département
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 max-h-[65vh] overflow-y-auto">
          {/* Nom du département */}
          <Field label="Nom du département" icon={Building2} error={errors.name}>
            <Input
              placeholder="Ex: Marketing Digital"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className={`h-9 text-sm ${errors.name ? "border-destructive" : ""}`}
            />
          </Field>

          {/* Responsable */}
          <Field label="Responsable" icon={User} error={errors.head}>
            <Input
              placeholder="Ex: Youssef El Mansouri"
              value={form.head}
              onChange={(e) => set("head", e.target.value)}
              className={`h-9 text-sm ${errors.head ? "border-destructive" : ""}`}
            />
          </Field>

          {/* Catégorie */}
          <Field label="Catégorie" icon={Tag} error={errors.category}>
            <Select value={form.category} onValueChange={(v) => set("category", v)}>
              <SelectTrigger className={`h-9 text-sm ${errors.category ? "border-destructive" : ""}`}>
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {deptCategories.map((cat) => (
                  <SelectItem key={cat.key} value={cat.key}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          {/* Row: Employés + Objectif + Tâches */}
          <div className="grid grid-cols-3 gap-3">
            <Field label="Effectif" icon={Users} error={errors.employees}>
              <Input
                type="number"
                min={0}
                placeholder="0"
                value={form.employees || ""}
                onChange={(e) => set("employees", Number(e.target.value))}
                className={`h-9 text-sm ${errors.employees ? "border-destructive" : ""}`}
              />
            </Field>
            <Field label="Objectif (%)" icon={Target} error={errors.objective}>
              <Input
                type="number"
                min={0}
                max={100}
                placeholder="0"
                value={form.objective || ""}
                onChange={(e) => set("objective", Number(e.target.value))}
                className={`h-9 text-sm ${errors.objective ? "border-destructive" : ""}`}
              />
            </Field>
            <Field label="Tâches actives" icon={ClipboardList} error={errors.tasks}>
              <Input
                type="number"
                min={0}
                placeholder="0"
                value={form.tasks || ""}
                onChange={(e) => set("tasks", Number(e.target.value))}
                className={`h-9 text-sm ${errors.tasks ? "border-destructive" : ""}`}
              />
            </Field>
          </div>

          {/* Couleur du département */}
          <Field label="Couleur du département" icon={Palette}>
            <div className="flex items-center gap-2 flex-wrap">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  title={c.label}
                  onClick={() => set("color", c.value)}
                  className="w-7 h-7 rounded-full border-2 transition-all hover:scale-110"
                  style={{
                    backgroundColor: c.value,
                    borderColor: form.color === c.value ? c.value : "transparent",
                    boxShadow: form.color === c.value ? `0 0 0 2px white, 0 0 0 4px ${c.value}` : "none",
                  }}
                />
              ))}
            </div>
          </Field>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-muted/30">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
          >
            Créer le département
          </button>
        </div>
      </div>
    </div>
  );
}

// Small helper field wrapper
function Field({
  label,
  icon: Icon,
  error,
  children,
}: {
  label: string;
  icon: React.ElementType;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Icon size={13} />
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}