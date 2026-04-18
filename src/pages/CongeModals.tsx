// ════════════════════════════════════════════════════════════════════════
// CongeModals.tsx — Modal Demande + Modal Validation Admin
// ════════════════════════════════════════════════════════════════════════
import { useState, useEffect } from "react";
import { X, CheckCircle } from "lucide-react";
import type { Employee, CongeRequest } from "./conges.types";
import { calcWorkDays, fmtDate, getSolde } from "./CongesModule";

const TYPES_CONGE = [
  "Congé annuel",
  "Congé maladie",
  "Congé personnel",
  "Congé maternité/paternité",
  "Congé sans solde",
];

// ─── Helpers UI ──────────────────────────────────────────────────────────────
function inputCls(error?: string) {
  return `w-full px-3 py-2 rounded-lg border text-sm bg-background transition-colors outline-none focus:ring-2 ${
    error
      ? "border-red-400 focus:ring-red-200"
      : "border-border focus:ring-[hsl(354,85%,85%)] focus:border-[hsl(354,85%,42%)]"
  }`;
}

function selectCls(error?: string) {
  return `w-full px-3 py-2 rounded-lg border text-sm bg-background transition-colors outline-none focus:ring-2 appearance-none ${
    error
      ? "border-red-400 focus:ring-red-200"
      : "border-border focus:ring-[hsl(354,85%,85%)] focus:border-[hsl(354,85%,42%)]"
  }`;
}

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <label className="block text-xs font-medium mb-1.5">
      {label}
      {required && <span style={{ color: "hsl(354,85%,42%)" }}> *</span>}
    </label>
  );
}

function FieldError({ msg }: { msg?: string }) {
  return msg ? (
    <p className="text-xs mt-1" style={{ color: "hsl(354,85%,42%)" }}>
      {msg}
    </p>
  ) : null;
}

// ════════════════════════════════════════════════════════════════════════
// Modal : Nouvelle demande de congé (employé / admin)
// ════════════════════════════════════════════════════════════════════════
interface DemandeModalProps {
  employees: Employee[];
  demandes: CongeRequest[];
  preselectedEmpId: number | null;
  onSubmit: (data: Omit<CongeRequest, "id" | "statut" | "motifRefus">) => void;
  onClose: () => void;
}

export function CongeDemandeModal({
  employees,
  demandes,
  preselectedEmpId,
  onSubmit,
  onClose,
}: DemandeModalProps) {
  const [empId, setEmpId] = useState<string>(preselectedEmpId ? String(preselectedEmpId) : "");
  const [type, setType] = useState(TYPES_CONGE[0]);
  const [debut, setDebut] = useState("");
  const [fin, setFin] = useState("");
  const [motif, setMotif] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const selectedEmpId = parseInt(empId) || 0;
  const solde = selectedEmpId ? getSolde(selectedEmpId, employees, demandes) : null;

  const jours =
    debut && fin && fin >= debut ? calcWorkDays(debut, fin) : null;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!empId) e.empId = "Sélectionnez un employé";
    if (!debut) e.debut = "Date requise";
    if (!fin) e.fin = "Date requise";
    if (debut && fin && fin < debut) e.fin = "Doit être après la date de début";
    if (type === "Congé annuel" && jours !== null && solde && jours > solde.restant) {
      e.fin = `Solde insuffisant : ${solde.restant}j disponibles, ${jours}j demandés`;
    }
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setSuccess(true);
    setTimeout(() => {
      onSubmit({
        empId: parseInt(empId),
        type,
        debut,
        fin,
        jours: jours!,
        motifEmp: motif,
      });
    }, 1400);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.45)" }}
    >
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto border">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-card z-10">
          <div>
            <h2 className="text-base font-bold">Nouvelle demande de congé</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              L'admin sera notifié pour validation
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {success ? (
          <div className="flex flex-col items-center justify-center py-14 gap-3">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ background: "hsl(354,85%,95%)" }}
            >
              <CheckCircle size={28} style={{ color: "hsl(354,85%,42%)" }} />
            </div>
            <p className="font-semibold text-base">Demande soumise avec succès !</p>
            <p className="text-sm text-muted-foreground">En attente de validation</p>
          </div>
        ) : (
          <div className="px-6 py-5 space-y-4">
            {/* Employé */}
            <div>
              <FieldLabel label="Employé" required />
              <select
                value={empId}
                onChange={(e) => { setEmpId(e.target.value); setErrors((p) => ({ ...p, empId: "" })); }}
                className={selectCls(errors.empId)}
              >
                <option value="">Sélectionner…</option>
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name} — {e.dept}
                  </option>
                ))}
              </select>
              <FieldError msg={errors.empId} />
            </div>

            {/* Solde info */}
            {solde && (
              <div
                className="flex items-center justify-between px-3 py-2 rounded-lg text-xs"
                style={{ background: "hsl(354,85%,97%)" }}
              >
                <span className="text-muted-foreground">Solde disponible</span>
                <span className="font-semibold" style={{ color: "hsl(354,85%,42%)" }}>
                  {solde.restant} jours
                </span>
              </div>
            )}

            {/* Type de congé */}
            <div>
              <FieldLabel label="Type de congé" required />
              <div className="grid grid-cols-2 gap-2">
                {TYPES_CONGE.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`text-left px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                      type === t
                        ? "border-transparent text-white"
                        : "border-border text-muted-foreground hover:border-muted-foreground"
                    }`}
                    style={type === t ? { background: "hsl(354,85%,42%)" } : {}}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel label="Date de début" required />
                <input
                  type="date"
                  value={debut}
                  onChange={(e) => { setDebut(e.target.value); setErrors((p) => ({ ...p, debut: "" })); }}
                  className={inputCls(errors.debut)}
                />
                <FieldError msg={errors.debut} />
              </div>
              <div>
                <FieldLabel label="Date de fin" required />
                <input
                  type="date"
                  value={fin}
                  onChange={(e) => { setFin(e.target.value); setErrors((p) => ({ ...p, fin: "" })); }}
                  className={inputCls(errors.fin)}
                />
                <FieldError msg={errors.fin} />
              </div>
            </div>

            {/* Calcul jours */}
            {jours !== null && (
              <div
                className="flex items-center justify-between px-3 py-2 rounded-lg text-xs"
                style={{ background: "hsl(220,14%,96%)" }}
              >
                <span className="text-muted-foreground">Durée calculée (jours ouvrables)</span>
                <span className="font-semibold">{jours} jour{jours > 1 ? "s" : ""}</span>
              </div>
            )}

            {/* Motif */}
            <div>
              <FieldLabel label="Motif / Commentaire (optionnel)" />
              <textarea
                rows={3}
                placeholder="Précisez si nécessaire…"
                value={motif}
                onChange={(e) => setMotif(e.target.value)}
                className={inputCls()}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2 border-t">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg border text-sm font-medium hover:bg-muted transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                className="px-5 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95 shadow"
                style={{ background: "hsl(354,85%,42%)" }}
              >
                Soumettre la demande
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Modal : Validation admin (Approuver / Refuser avec motif obligatoire)
// ════════════════════════════════════════════════════════════════════════
interface AdminModalProps {
  demandeId: number;
  action: "approuver" | "refuser";
  employees: Employee[];
  demandes: CongeRequest[];
  onConfirm: (demandeId: number, action: "approuver" | "refuser", motif?: string) => void;
  onClose: () => void;
}

export function CongeAdminModal({
  demandeId,
  action,
  employees,
  demandes,
  onConfirm,
  onClose,
}: AdminModalProps) {
  const [motifRefus, setMotifRefus] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const demande = demandes.find((d) => d.id === demandeId)!;
  const emp = employees.find((e) => e.id === demande.empId)!;
  const solde = getSolde(emp.id, employees, demandes);
  const apresApprobation = solde.restant - demande.jours;

  const handleConfirm = () => {
    if (action === "refuser" && !motifRefus.trim()) {
      setError("Le motif du refus est obligatoire.");
      return;
    }
    setSuccess(true);
    setTimeout(() => {
      onConfirm(demandeId, action, motifRefus.trim() || undefined);
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.45)" }}
    >
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md border">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-base font-bold">
              {action === "approuver" ? "✅ Approuver la demande" : "❌ Refuser la demande"}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {emp.name} · {demande.type}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <X size={16} />
          </button>
        </div>

        {success ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{
                background: action === "approuver" ? "hsl(142,71%,90%)" : "hsl(0,84%,92%)",
              }}
            >
              {action === "approuver" ? (
                <CheckCircle size={28} className="text-green-600" />
              ) : (
                <X size={28} className="text-red-600" />
              )}
            </div>
            <p className="font-semibold text-base">
              {action === "approuver" ? "Demande approuvée !" : "Demande refusée"}
            </p>
          </div>
        ) : (
          <div className="px-6 py-5 space-y-4">
            {/* Résumé de la demande */}
            <div className="rounded-xl p-4 space-y-3" style={{ background: "hsl(220,14%,97%)" }}>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Période</p>
                  <p className="font-medium">
                    {fmtDate(demande.debut)} → {fmtDate(demande.fin)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Durée</p>
                  <p className="font-medium">{demande.jours} jours ouvrables</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Solde actuel</p>
                  <p className="font-medium">{solde.restant} jours</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Après approbation</p>
                  <p
                    className={`font-semibold ${
                      apresApprobation < 0
                        ? "text-red-600"
                        : apresApprobation < 5
                        ? "text-amber-600"
                        : "text-green-600"
                    }`}
                  >
                    {apresApprobation} jours
                  </p>
                </div>
              </div>
              {demande.motifEmp && (
                <div className="border-t pt-3">
                  <p className="text-xs text-muted-foreground mb-1">Motif de l'employé</p>
                  <p className="text-sm">{demande.motifEmp}</p>
                </div>
              )}
            </div>

            {/* Motif refus (obligatoire si refus) */}
            {action === "refuser" && (
              <div>
                <label className="block text-xs font-medium mb-1.5">
                  Motif du refus <span style={{ color: "hsl(354,85%,42%)" }}>*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Expliquez la raison du refus à l'employé…"
                  value={motifRefus}
                  onChange={(e) => { setMotifRefus(e.target.value); setError(""); }}
                  className={inputCls(error)}
                />
                {error && (
                  <p className="text-xs mt-1 text-red-600">{error}</p>
                )}
              </div>
            )}

            {/* Avertissement solde négatif */}
            {action === "approuver" && apresApprobation < 0 && (
              <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-700">
                <span className="mt-0.5">⚠️</span>
                <span>
                  Ce congé dépasserait le solde disponible de {Math.abs(apresApprobation)} jour(s).
                  Voulez-vous quand même approuver ?
                </span>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2 border-t">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg border text-sm font-medium hover:bg-muted transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirm}
                className={`px-5 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95 shadow ${
                  action === "approuver" ? "bg-green-600" : "bg-red-600"
                }`}
              >
                {action === "approuver" ? "Confirmer l'approbation" : "Confirmer le refus"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}