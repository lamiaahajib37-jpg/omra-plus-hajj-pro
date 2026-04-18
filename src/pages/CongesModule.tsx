// ════════════════════════════════════════════════════════════════════════
// CongesModule.tsx — Gestion des Congés (Soldes + Demandes + Validation)
// ════════════════════════════════════════════════════════════════════════
import { useState } from "react";
import { Plus, CheckCircle, XCircle, Clock, CalendarOff, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import {
  CongeDemandeModal,
  CongeAdminModal,
} from "./CongeModals";
import type { Employee, CongeRequest } from "./conges.types";


// ─── Vue Employé ──────────────────────────────────────────────────────────────
function EmployeeCongesView({
  employees,
  demandes,
  setDemandes,
}: {
  employees: Employee[];
  demandes: CongeRequest[];
  setDemandes: React.Dispatch<React.SetStateAction<CongeRequest[]>>;
}) {
  const { user } = useAuth();
  const [showDemande, setShowDemande] = useState(false);
  const [activeTab, setActiveTab] = useState<"attente" | "historique">("attente");

  // Retrouver l'employé connecté (matching par nom ou id selon votre AuthContext)
  const currentEmp = employees.find(
    (e) => e.name === user?.name || e.id === user?.empId
  );

  if (!currentEmp) {
    return (
      <div className="text-center py-12 text-muted-foreground text-sm">
        Profil employé non trouvé.
      </div>
    );
  }

  const solde = getSolde(currentEmp.id, employees, demandes);
  const pct = Math.max(0, Math.round((solde.restant / CONGE_ANNUEL_TOTAL) * 100));
  const barColor =
    solde.restant < 5
      ? "hsl(0,84%,60%)"
      : solde.restant < 10
      ? "hsl(38,92%,50%)"
      : "hsl(354,85%,42%)";

  // Demandes de cet employé seulement
  const mesDemandes = demandes.filter((d) => d.empId === currentEmp.id);
  const enAttente = mesDemandes.filter((d) => d.statut === "en_attente");
  const historique = mesDemandes.filter((d) => d.statut !== "en_attente");

  const handleSubmit = (data: Omit<CongeRequest, "id" | "statut" | "motifRefus">) => {
    const newId = Math.max(...demandes.map((d) => d.id)) + 1;
    setDemandes((prev) => [
      ...prev,
      { ...data, id: newId, statut: "en_attente", motifRefus: "" },
    ]);
    setShowDemande(false);
  };

  return (
    <div className="space-y-6 fade-in">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mes Congés</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Solde, demandes et historique
          </p>
        </div>
        <button
          onClick={() => setShowDemande(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all shadow-md hover:opacity-90 active:scale-95"
          style={{ background: "hsl(354, 85%, 42%)" }}
        >
          <Plus size={16} />
          Nouvelle demande
        </button>
      </div>

      {/* Card Solde */}
      <div className="bg-card rounded-xl border shadow-sm p-5 space-y-4">
        <div className="flex items-center gap-3">
          <Avatar initials={currentEmp.initials} />
          <div>
            <p className="font-semibold">{currentEmp.name}</p>
            <p className="text-xs text-muted-foreground">{currentEmp.dept}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total / an", value: solde.total, color: "text-foreground" },
            { label: "Restant", value: solde.restant, color: solde.restant < 5 ? "text-red-600" : solde.restant < 10 ? "text-amber-600" : "text-green-600" },
            { label: "Pris", value: solde.pris, color: "text-muted-foreground" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-muted/50 rounded-lg p-3 text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Barre de progression */}
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>{pct}% restant</span>
            <span>{solde.restant} jours disponibles</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${pct}%`, background: barColor }}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit">
        {(["attente", "historique"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              activeTab === t
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "attente"
              ? `En attente${enAttente.length > 0 ? ` (${enAttente.length})` : ""}`
              : "Historique"}
          </button>
        ))}
      </div>

      {/* Liste */}
      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3 font-medium text-muted-foreground">Type</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Période</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Jours</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Statut</th>
              {activeTab === "historique" && (
                <th className="text-left p-3 font-medium text-muted-foreground">Motif refus</th>
              )}
            </tr>
          </thead>
          <tbody>
            {(activeTab === "attente" ? enAttente : historique).length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted-foreground text-sm">
                  {activeTab === "attente"
                    ? "Aucune demande en attente"
                    : "Aucun historique"}
                </td>
              </tr>
            ) : (
              (activeTab === "attente" ? enAttente : historique).map((d) => (
                <tr key={d.id} className="border-t hover:bg-muted/50 transition-colors">
                  <td className="p-3">
                    <p className="font-medium">{d.type}</p>
                    {d.motifEmp && (
                      <p className="text-xs text-muted-foreground mt-0.5 italic">{d.motifEmp}</p>
                    )}
                  </td>
                  <td className="p-3 text-xs text-muted-foreground">
                    {fmtDate(d.debut)} → {fmtDate(d.fin)}
                  </td>
                  <td className="p-3 font-medium">{d.jours}j</td>
                  <td className="p-3">
                    <StatusBadge statut={d.statut} />
                  </td>
                  {activeTab === "historique" && (
                    <td className="p-3 text-xs text-muted-foreground max-w-[180px] truncate" title={d.motifRefus}>
                      {d.motifRefus || "—"}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showDemande && (
        <CongeDemandeModal
          employees={employees}
          demandes={demandes}
          preselectedEmpId={currentEmp.id}
          onSubmit={handleSubmit}
          onClose={() => setShowDemande(false)}
        />
      )}
    </div>
  );
}
// ─── Données initiales ───────────────────────────────────────────────────────
const CONGE_ANNUEL_TOTAL = 26;

const initialEmployees: Employee[] = [
  { id: 1, name: "Youssef El Amrani",    dept: "Commercial",          initials: "YE", prisAnnuel: 5  },
  { id: 2, name: "Fatima Zahra Bennani", dept: "Hajj & Omra",         initials: "FZ", prisAnnuel: 2  },
  { id: 3, name: "Karim Tazi",           dept: "Tourisme",             initials: "KT", prisAnnuel: 8  },
  { id: 4, name: "Amina Chraibi",        dept: "Marketing",            initials: "AC", prisAnnuel: 3  },
  { id: 5, name: "Hassan Ouazzani",      dept: "Finance",              initials: "HO", prisAnnuel: 12 },
  { id: 6, name: "Nadia Berrada",        dept: "Hajj & Omra",         initials: "NB", prisAnnuel: 0  },
];

const initialDemandes: CongeRequest[] = [
  {
    id: 101, empId: 5, type: "Congé annuel",
    debut: "2026-03-25", fin: "2026-04-02", jours: 7,
    statut: "en_attente", motifEmp: "Voyage familial", motifRefus: "",
  },
  {
    id: 102, empId: 4, type: "Congé maladie",
    debut: "2026-03-20", fin: "2026-03-22", jours: 3,
    statut: "approuve", motifEmp: "", motifRefus: "",
  },
  {
    id: 103, empId: 3, type: "Congé personnel",
    debut: "2026-04-15", fin: "2026-04-16", jours: 2,
    statut: "en_attente", motifEmp: "Démarches administratives", motifRefus: "",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
export function calcWorkDays(d1: string, d2: string): number {
  let n = 0;
  const cur = new Date(d1);
  const end = new Date(d2);
  while (cur <= end) {
    const dw = cur.getDay();
    if (dw !== 0 && dw !== 6) n++;
    cur.setDate(cur.getDate() + 1);
  }
  return n;
}

export function fmtDate(d: string): string {
  const [y, m, j] = d.split("-");
  return `${j}/${m}/${y}`;
}

export function getSolde(empId: number, employees: Employee[], demandes: CongeRequest[]) {
  const emp = employees.find((e) => e.id === empId)!;
  const used = demandes
    .filter((d) => d.empId === empId && d.statut === "approuve")
    .reduce((s, d) => s + d.jours, 0);
  return {
    total: CONGE_ANNUEL_TOTAL,
    pris: emp.prisAnnuel + used,
    restant: CONGE_ANNUEL_TOTAL - emp.prisAnnuel - used,
  };
}

// ─── Composant principal ──────────────────────────────────────────────────────
type Tab = "soldes" | "demandes" | "historique";

export default function CongesModule() {
 const { isAdmin, isManager } = useAuth();
  const canValidate = isAdmin || isManager;
  const isEmployee = !isAdmin && !isManager; // ← nouveau

  const [employees] = useState<Employee[]>(initialEmployees);
  const [demandes, setDemandes] = useState<CongeRequest[]>(initialDemandes);
  const [activeTab, setActiveTab] = useState<Tab>("soldes");

  // Modals
  const [showDemande, setShowDemande] = useState(false);
  const [preselectedEmpId, setPreselectedEmpId] = useState<number | null>(null);
  const [adminModal, setAdminModal] = useState<{
    demandeId: number;
    action: "approuver" | "refuser";
  } | null>(null);

  const pendingCount = demandes.filter((d) => d.statut === "en_attente").length;
  const approvedCount = demandes.filter((d) => d.statut === "approuve").length;
  const refusedCount = demandes.filter((d) => d.statut === "refuse").length;

  const handleSubmitDemande = (data: Omit<CongeRequest, "id" | "statut" | "motifRefus">) => {
    const newId = Math.max(...demandes.map((d) => d.id)) + 1;
    setDemandes((prev) => [
      ...prev,
      { ...data, id: newId, statut: "en_attente", motifRefus: "" },
    ]);
    setShowDemande(false);
    setPreselectedEmpId(null);
  };

  const handleDecision = (demandeId: number, action: "approuver" | "refuser", motif?: string) => {
    setDemandes((prev) =>
      prev.map((d) =>
        d.id === demandeId
          ? {
              ...d,
              statut: action === "approuver" ? "approuve" : "refuse",
              motifRefus: motif || "",
            }
          : d
      )
    );
    setAdminModal(null);
  };

   if (isEmployee) {
    return (
      <EmployeeCongesView
        employees={employees}
        demandes={demandes}
        setDemandes={setDemandes}
      />
    );
  }

  return (
    <div className="space-y-6 fade-in">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gestion des Congés</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Soldes, demandes et validations
          </p>
        </div>
        <button
          onClick={() => { setPreselectedEmpId(null); setShowDemande(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all shadow-md hover:opacity-90 active:scale-95"
          style={{ background: "hsl(354, 85%, 42%)" }}
        >
          <Plus size={16} />
          Nouvelle demande
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={<CalendarOff size={20} />} label="Employés" value={employees.length} color="default" />
        <StatCard icon={<Clock size={20} />} label="En attente" value={pendingCount} color="warning" />
        <StatCard icon={<CheckCircle size={20} />} label="Approuvées" value={approvedCount} color="success" />
        <StatCard icon={<XCircle size={20} />} label="Refusées" value={refusedCount} color="danger" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit">
        {(["soldes", "demandes", "historique"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all capitalize ${
              activeTab === t
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "demandes" ? `Demandes${pendingCount > 0 ? ` (${pendingCount})` : ""}` : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Onglet Soldes */}
      {activeTab === "soldes" && (
        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3 font-medium text-muted-foreground">Employé</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Département</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Solde restant</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Pris</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Total / an</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => {
                const s = getSolde(emp.id, employees, demandes);
                const pct = Math.max(0, Math.round((s.restant / CONGE_ANNUEL_TOTAL) * 100));
                const colorClass =
                  s.restant < 5
                    ? "text-red-600"
                    : s.restant < 10
                    ? "text-amber-600"
                    : "text-green-600";
                const barColor =
                  s.restant < 5
                    ? "hsl(0,84%,60%)"
                    : s.restant < 10
                    ? "hsl(38,92%,50%)"
                    : "hsl(354,85%,42%)";

                return (
                  <tr key={emp.id} className="border-t hover:bg-muted/50 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Avatar initials={emp.initials} />
                        <span className="font-medium">{emp.name}</span>
                      </div>
                    </td>
                    <td className="p-3 text-xs text-muted-foreground">{emp.dept}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold text-base ${colorClass}`}>{s.restant}</span>
                        <span className="text-xs text-muted-foreground">jours</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted mt-1 w-24 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${pct}%`, background: barColor }}
                        />
                      </div>
                    </td>
                    <td className="p-3 text-muted-foreground">{s.pris} j</td>
                    <td className="p-3 text-muted-foreground">{CONGE_ANNUEL_TOTAL} j</td>
                    <td className="p-3">
                      <button
                        onClick={() => { setPreselectedEmpId(emp.id); setShowDemande(true); }}
                        className="px-3 py-1.5 rounded-lg border text-xs font-medium hover:bg-muted transition-colors"
                      >
                        Demande
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Onglet Demandes en attente */}
      {activeTab === "demandes" && (
        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3 font-medium text-muted-foreground">Employé</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Type</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Période</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Jours</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Statut</th>
                {canValidate && (
                  <th className="text-left p-3 font-medium text-muted-foreground">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {demandes.filter((d) => d.statut === "en_attente").length === 0 ? (
                <tr>
                  <td colSpan={canValidate ? 6 : 5} className="p-8 text-center text-muted-foreground text-sm">
                    Aucune demande en attente
                  </td>
                </tr>
              ) : (
                demandes
                  .filter((d) => d.statut === "en_attente")
                  .map((d) => {
                    const emp = employees.find((e) => e.id === d.empId)!;
                    return (
                      <tr key={d.id} className="border-t hover:bg-muted/50 transition-colors">
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <Avatar initials={emp.initials} />
                            <span className="font-medium">{emp.name}</span>
                          </div>
                        </td>
                        <td className="p-3 text-xs">{d.type}</td>
                        <td className="p-3 text-xs text-muted-foreground">
                          {fmtDate(d.debut)} → {fmtDate(d.fin)}
                        </td>
                        <td className="p-3 font-medium">{d.jours}j</td>
                        <td className="p-3">
                          <StatusBadge statut={d.statut} />
                        </td>
                        {canValidate && (
                          <td className="p-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => setAdminModal({ demandeId: d.id, action: "approuver" })}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-50 text-green-700 border border-green-200 hover:opacity-80 transition-opacity"
                              >
                                Approuver
                              </button>
                              <button
                                onClick={() => setAdminModal({ demandeId: d.id, action: "refuser" })}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-700 border border-red-200 hover:opacity-80 transition-opacity"
                              >
                                Refuser
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Onglet Historique */}
      {activeTab === "historique" && (
        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3 font-medium text-muted-foreground">Employé</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Type</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Période</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Jours</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Statut</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Motif refus</th>
              </tr>
            </thead>
            <tbody>
              {demandes.filter((d) => d.statut !== "en_attente").length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground text-sm">
                    Aucun historique
                  </td>
                </tr>
              ) : (
                demandes
                  .filter((d) => d.statut !== "en_attente")
                  .map((d) => {
                    const emp = employees.find((e) => e.id === d.empId)!;
                    return (
                      <tr key={d.id} className="border-t hover:bg-muted/50 transition-colors">
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <Avatar initials={emp.initials} />
                            <span className="font-medium">{emp.name}</span>
                          </div>
                        </td>
                        <td className="p-3 text-xs">{d.type}</td>
                        <td className="p-3 text-xs text-muted-foreground">
                          {fmtDate(d.debut)} → {fmtDate(d.fin)}
                        </td>
                        <td className="p-3 font-medium">{d.jours}j</td>
                        <td className="p-3">
                          <StatusBadge statut={d.statut} />
                        </td>
                        <td className="p-3 text-xs text-muted-foreground max-w-[200px] truncate" title={d.motifRefus}>
                          {d.motifRefus || "—"}
                        </td>
                      </tr>
                    );
                  })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Nouvelle Demande */}
      {showDemande && (
        <CongeDemandeModal
          employees={employees}
          demandes={demandes}
          preselectedEmpId={preselectedEmpId}
          onSubmit={handleSubmitDemande}
          onClose={() => { setShowDemande(false); setPreselectedEmpId(null); }}
        />
      )}

      {/* Modal Admin (Approuver / Refuser) */}
      {adminModal && (
        <CongeAdminModal
          demandeId={adminModal.demandeId}
          action={adminModal.action}
          employees={employees}
          demandes={demandes}
          onConfirm={handleDecision}
          onClose={() => setAdminModal(null)}
        />
      )}
    </div>
  );
}

// ─── Sous-composants locaux ───────────────────────────────────────────────────
function Avatar({ initials }: { initials: string }) {
  return (
    <div
      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
      style={{ background: "hsl(354,85%,92%)", color: "hsl(354,85%,42%)" }}
    >
      {initials}
    </div>
  );
}

function StatusBadge({ statut }: { statut: CongeRequest["statut"] }) {
  if (statut === "approuve")
    return <Badge className="bg-success text-success-foreground text-xs">Approuvé</Badge>;
  if (statut === "refuse")
    return <Badge variant="destructive" className="text-xs">Refusé</Badge>;
  return <Badge className="bg-warning text-warning-foreground text-xs">En attente</Badge>;
}

function StatCard({
  icon, label, value, color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: "default" | "warning" | "success" | "danger";
}) {
  const colorMap = {
    default: "text-foreground",
    warning: "text-amber-600",
    success: "text-green-600",
    danger: "text-red-600",
  };
  return (
    <div className="bg-card rounded-xl border shadow-sm p-4 flex items-center gap-3">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: "hsl(354,85%,95%)", color: "hsl(354,85%,42%)" }}
      >
        {icon}
      </div>
      <div>
        <p className={`text-xl font-bold ${colorMap[color]}`}>{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}