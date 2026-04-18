// ════════════════════════════════════════════════════════════════════════
// ManagerDashboard.tsx  —  /  (quand role === "manager")
// Vue dossiers entrants + workload employés + assignment intelligent
// ════════════════════════════════════════════════════════════════════════
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FolderOpen, Users, AlertTriangle, CheckCircle2,
  Clock, ChevronRight, UserCheck, BarChart3,
  ArrowRight, Info, TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Employe {
  id: string;
  nom: string;
  prenom: string;
  initiales: string;
  dossiers_actifs: number;
  dossiers_en_cours: number;
  seuil_max: number; // Au-delà de ce chiffre = surcharge
  disponible: boolean;
  specialite: string;
}

interface DossierAAssigner {
  id: string;
  reference: string;
  client: string;
  service: string;
  dateArrivee: string; // Date dépôt/création
  priorite: "haute" | "normale" | "basse";
  statut: "non_assigne" | "en_attente_assignment";
  notes?: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_EMPLOYES: Employe[] = [
  {
    id: "E01", nom: "El Amrani", prenom: "Youssef", initiales: "YE",
    dossiers_actifs: 2, dossiers_en_cours: 2, seuil_max: 5,
    disponible: true, specialite: "Outbound, Leisure"
  },
  {
    id: "E02", nom: "Benkirane", prenom: "Salma", initiales: "SB",
    dossiers_actifs: 4, dossiers_en_cours: 3, seuil_max: 5,
    disponible: true, specialite: "MICE, Événementiel"
  },
  {
    id: "E03", nom: "Hamdoune", prenom: "Amine", initiales: "AH",
    dossiers_actifs: 5, dossiers_en_cours: 4, seuil_max: 5,
    disponible: false, specialite: "Hajj & Omra"
  },
  {
    id: "E04", nom: "Chraibi", prenom: "Leila", initiales: "LC",
    dossiers_actifs: 1, dossiers_en_cours: 1, seuil_max: 5,
    disponible: true, specialite: "Leisure, Tourisme"
  },
  {
    id: "E05", nom: "Ouali", prenom: "Mehdi", initiales: "MO",
    dossiers_actifs: 3, dossiers_en_cours: 2, seuil_max: 5,
    disponible: true, specialite: "Outbound, MICE"
  },
];

const MOCK_DOSSIERS_A_ASSIGNER: DossierAAssigner[] = [
  {
    id: "DA01", reference: "DOS025", client: "Brightspot Group",
    service: "Outbound — Marrakech 43 pax", dateArrivee: "2026-04-08",
    priorite: "haute", statut: "non_assigne",
    notes: "Client confirmé, départ 27 Avril. Urgent."
  },
  {
    id: "DA02", reference: "DOS026", client: "Atlas Pharma",
    service: "MICE — Séminaire 80 pax Agadir", dateArrivee: "2026-04-07",
    priorite: "normale", statut: "non_assigne",
    notes: "Devis en cours de validation."
  },
  {
    id: "DA03", reference: "DOS027", client: "Rachida Alami",
    service: "Hajj 2026 — 2 pax", dateArrivee: "2026-04-06",
    priorite: "haute", statut: "non_assigne",
  },
  {
    id: "DA04", reference: "DOS028", client: "TechConf SA",
    service: "MICE — Conférence 120 pax Casablanca", dateArrivee: "2026-04-05",
    priorite: "normale", statut: "en_attente_assignment",
  },
];

// Dossiers déjà assignés (pour la vue de suivi)
const MOCK_DOSSIERS_ASSIGNES = [
  { id: "D01", reference: "DOS012", client: "Brightspot Group (prev.)", employe: "Youssef El Amrani", statut: "en_cours", service: "Outbound" },
  { id: "D02", reference: "DOS021", client: "Nadia Chraibi", employe: "Salma Benkirane", statut: "en_cours", service: "MICE" },
  { id: "D03", reference: "DOS018", client: "Karim Benali", employe: "Amine Hamdoune", statut: "confirme", service: "Omra" },
  { id: "D04", reference: "DOS022", client: "Omar Tazi", employe: "Leila Chraibi", statut: "en_cours", service: "Leisure" },
];

const PRIORITE_CONFIG = {
  haute:   { label: "Urgent",  color: "#791F1F", bg: "#FCEBEB" },
  normale: { label: "Normal",  color: "#633806", bg: "#FAEEDA" },
  basse:   { label: "Basse",   color: "#5F5E5A", bg: "#F1EFE8" },
};

// ─── Workload Bar ─────────────────────────────────────────────────────────────
function WorkloadBar({ employe }: { employe: Employe }) {
  const pct = Math.round((employe.dossiers_actifs / employe.seuil_max) * 100);
  const surcharge = employe.dossiers_actifs >= employe.seuil_max;
  const proche = employe.dossiers_actifs >= employe.seuil_max - 1 && !surcharge;

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${Math.min(pct, 100)}%`,
            background: surcharge ? "#E24B4A" : proche ? "#EF9F27" : "#1D9E75"
          }}
        />
      </div>
      <span className={`text-xs font-medium w-12 text-right ${surcharge ? "text-red-600" : proche ? "text-amber-600" : "text-muted-foreground"}`}>
        {employe.dossiers_actifs}/{employe.seuil_max}
      </span>
    </div>
  );
}

// ─── Assignment Modal ─────────────────────────────────────────────────────────
function AssignmentModal({
  open, onClose, dossier, employes, onAssign
}: {
  open: boolean;
  onClose: () => void;
  dossier: DossierAAssigner | null;
  employes: Employe[];
  onAssign: (dossierId: string, employeId: string, note: string) => void;
}) {
  const [selectedEmploye, setSelectedEmploye] = useState("");
  const [note, setNote] = useState("");

  if (!dossier) return null;

  const employe = employes.find(e => e.id === selectedEmploye);
  const surcharge = employe && employe.dossiers_actifs >= employe.seuil_max;
  const proche = employe && employe.dossiers_actifs >= employe.seuil_max - 1 && !surcharge;

  const handleAssign = () => {
    if (!selectedEmploye) { toast.error("Choisissez un employé"); return; }
    onAssign(dossier.id, selectedEmploye, note);
    setSelectedEmploye("");
    setNote("");
    onClose();
  };

  // Tri: employés disponibles + charge croissante
  const sortedEmployes = [...employes].sort((a, b) => {
    if (a.disponible !== b.disponible) return a.disponible ? -1 : 1;
    return a.dossiers_actifs - b.dossiers_actifs;
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Assigner le dossier {dossier.reference}</DialogTitle>
        </DialogHeader>

        {/* Dossier info */}
        <div className="p-3 rounded-lg bg-secondary/30 text-sm space-y-1">
          <p className="font-medium text-foreground">{dossier.client}</p>
          <p className="text-muted-foreground">{dossier.service}</p>
          {dossier.notes && <p className="text-xs italic text-muted-foreground">"{dossier.notes}"</p>}
        </div>

        {/* Employe selector */}
        <div className="space-y-3">
          <Label>Choisir l'employé</Label>
          <div className="space-y-2">
            {sortedEmployes.map(e => {
              const isSurcharge = e.dossiers_actifs >= e.seuil_max;
              const isProche = e.dossiers_actifs >= e.seuil_max - 1 && !isSurcharge;
              const isSelected = selectedEmploye === e.id;

              return (
                <button
                  key={e.id}
                  onClick={() => setSelectedEmploye(e.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all text-left ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border/50 hover:border-border"
                  } ${!e.disponible ? "opacity-50" : ""}`}
                >
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    isSelected ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
                  }`}>
                    {e.initiales}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">
                        {e.prenom} {e.nom}
                      </span>
                      {!e.disponible && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">Absent</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{e.specialite}</p>
                    <WorkloadBar employe={e} />
                  </div>

                  {/* Warning badges */}
                  {isSurcharge && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0" style={{ background: "#FCEBEB", color: "#791F1F" }}>
                      Surchargé
                    </span>
                  )}
                  {isProche && !isSurcharge && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0" style={{ background: "#FAEEDA", color: "#633806" }}>
                      Quasi-plein
                    </span>
                  )}
                  {!isSurcharge && !isProche && e.disponible && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0" style={{ background: "#EAF3DE", color: "#27500A" }}>
                      Disponible
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Warning si surcharge */}
          {surcharge && (
            <div className="flex items-start gap-2 p-3 rounded-lg border" style={{ background: "#FCEBEB", borderColor: "#E24B4A33" }}>
              <AlertTriangle size={15} style={{ color: "#A32D2D" }} className="shrink-0 mt-0.5" />
              <p className="text-xs" style={{ color: "#A32D2D" }}>
                <strong>{employe?.prenom} {employe?.nom}</strong> a déjà {employe?.dossiers_actifs} dossiers actifs — charge maximale atteinte. Voulez-vous quand même assigner ?
              </p>
            </div>
          )}

          {proche && !surcharge && (
            <div className="flex items-start gap-2 p-3 rounded-lg border" style={{ background: "#FAEEDA", borderColor: "#EF9F2733" }}>
              <Info size={15} style={{ color: "#633806" }} className="shrink-0 mt-0.5" />
              <p className="text-xs" style={{ color: "#633806" }}>
                <strong>{employe?.prenom}</strong> approche de sa charge maximale ({employe?.dossiers_actifs}/{employe?.seuil_max} dossiers).
              </p>
            </div>
          )}

          <div className="space-y-1">
            <Label>Note d'instruction (optionnel)</Label>
            <Textarea
              rows={2}
              placeholder="Ex: Priorité départ 27 Avril. Contacter le client aujourd'hui."
              value={note}
              onChange={e => setNote(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={handleAssign} disabled={!selectedEmploye} className="gap-1.5">
            <UserCheck size={14} />
            Assigner
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function ManagerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dossiers, setDossiers] = useState<DossierAAssigner[]>(MOCK_DOSSIERS_A_ASSIGNER);
  const [employes] = useState<Employe[]>(MOCK_EMPLOYES);
  const [assignModal, setAssignModal] = useState<DossierAAssigner | null>(null);
  const [employesWorkload, setEmployesWorkload] = useState<Employe[]>(MOCK_EMPLOYES);

  const nonAssignes = dossiers.filter(d => d.statut === "non_assigne");
  const urgents = nonAssignes.filter(d => d.priorite === "haute");
  const employes_surcharges = employes.filter(e => e.dossiers_actifs >= e.seuil_max);
  const employe_recommande = [...employes]
    .filter(e => e.disponible && e.dossiers_actifs < e.seuil_max)
    .sort((a, b) => a.dossiers_actifs - b.dossiers_actifs)[0];

  const handleAssign = (dossierId: string, employeId: string, note: string) => {
    const employe = employes.find(e => e.id === employeId)!;
    setDossiers(p => p.map(d =>
      d.id === dossierId ? { ...d, statut: "en_attente_assignment" as const } : d
    ));
    setEmployesWorkload(p => p.map(e =>
      e.id === employeId ? { ...e, dossiers_actifs: e.dossiers_actifs + 1 } : e
    ));
    const d = dossiers.find(d => d.id === dossierId);
    toast.success(`${d?.reference} assigné à ${employe.prenom} ${employe.nom}`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Bonjour, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Département {user?.departement} · {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-3">
        {[
          {
            label: "À assigner",
            value: nonAssignes.length.toString(),
            sub: `${urgents.length} urgent${urgents.length > 1 ? "s" : ""}`,
            icon: <FolderOpen size={16} />,
            urgent: nonAssignes.length > 0,
          },
          {
            label: "Dossiers actifs",
            value: MOCK_DOSSIERS_ASSIGNES.length.toString(),
            sub: "en cours de traitement",
            icon: <Clock size={16} />,
            urgent: false,
          },
          {
            label: "Employés surchargés",
            value: employes_surcharges.length.toString(),
            sub: `sur ${employes.length} employés`,
            icon: <AlertTriangle size={16} />,
            urgent: employes_surcharges.length > 0,
          },
          {
            label: "Recommandé maintenant",
            value: employe_recommande ? `${employe_recommande.prenom}` : "—",
            sub: employe_recommande ? `${employe_recommande.dossiers_actifs}/${employe_recommande.seuil_max} dossiers` : "Tous surchargés",
            icon: <UserCheck size={16} />,
            urgent: false,
          },
        ].map(k => (
          <div
            key={k.label}
            className={`rounded-xl p-4 border transition-all ${k.urgent ? "border-red-200 bg-red-50" : "bg-background border-border/50"}`}
          >
            <div className={`flex items-center gap-1.5 mb-2 ${k.urgent ? "text-red-600" : "text-muted-foreground"}`}>
              {k.icon}
              <span className="text-xs">{k.label}</span>
            </div>
            <p className={`text-2xl font-bold ${k.urgent ? "text-red-700" : "text-foreground"}`}>{k.value}</p>
            <p className={`text-xs mt-0.5 ${k.urgent ? "text-red-600" : "text-muted-foreground"}`}>{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-5">

        {/* ── Colonne gauche: Dossiers à assigner ── */}
        <div className="col-span-3 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">
              Dossiers à assigner
              {nonAssignes.length > 0 && (
                <span className="ml-2 text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "#FCEBEB", color: "#791F1F" }}>
                  {nonAssignes.length} en attente
                </span>
              )}
            </h2>
            <button
              onClick={() => navigate("/dossiers")}
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              Voir tous <ChevronRight size={12} />
            </button>
          </div>

          {dossiers.map(d => {
            const pcfg = PRIORITE_CONFIG[d.priorite];
            const isAssigned = d.statut === "en_attente_assignment";

            return (
              <div
                key={d.id}
                className={`bg-background border rounded-xl p-4 transition-all ${
                  isAssigned ? "border-border/30 opacity-60" : "border-border/50 hover:border-border"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-muted-foreground">{d.reference}</span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ background: pcfg.bg, color: pcfg.color }}
                      >
                        {pcfg.label}
                      </span>
                      {isAssigned && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "#EAF3DE", color: "#27500A" }}>
                          ✓ Assigné
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-foreground">{d.client}</p>
                    <p className="text-xs text-muted-foreground">{d.service}</p>
                    {d.notes && (
                      <p className="text-xs text-muted-foreground mt-1 italic">"{d.notes}"</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">Reçu le {d.dateArrivee}</p>
                  </div>

                  {!isAssigned && (
                    <Button
                      size="sm"
                      className="gap-1.5 shrink-0"
                      onClick={() => setAssignModal(d)}
                    >
                      <UserCheck size={13} />
                      Assigner
                    </Button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Dossiers récemment assignés */}
          <div className="pt-2">
            <h3 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
              Dossiers en cours — suivi
            </h3>
            {MOCK_DOSSIERS_ASSIGNES.map(d => (
              <div
                key={d.id}
                className="flex items-center justify-between py-2.5 border-b border-border/30 last:border-0 hover:bg-secondary/20 -mx-1 px-1 rounded cursor-pointer transition-colors"
                onClick={() => navigate(`/dossiers/${d.id}`)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-muted-foreground w-16">{d.reference}</span>
                  <div>
                    <p className="text-sm text-foreground">{d.client}</p>
                    <p className="text-xs text-muted-foreground">{d.employe} · {d.service}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={d.statut === "confirme"
                      ? { background: "#EAF3DE", color: "#27500A" }
                      : { background: "#FAEEDA", color: "#633806" }
                    }
                  >
                    {d.statut === "confirme" ? "Confirmé" : "En cours"}
                  </span>
                  <ChevronRight size={12} className="text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Colonne droite: Workload employés ── */}
        <div className="col-span-2 space-y-4">
          <h2 className="text-sm font-semibold text-foreground">Charge de travail</h2>

          <div className="bg-background border border-border/50 rounded-xl overflow-hidden">
            {employesWorkload.map((e, i) => {
              const isSurcharge = e.dossiers_actifs >= e.seuil_max;
              const isProche = e.dossiers_actifs >= e.seuil_max - 1 && !isSurcharge;
              const isRecommande = employe_recommande?.id === e.id;

              return (
                <div
                  key={e.id}
                  className={`p-3 ${i < employesWorkload.length - 1 ? "border-b border-border/30" : ""} ${
                    isSurcharge ? "bg-red-50/50" : isRecommande ? "bg-green-50/30" : ""
                  }`}
                >
                  <div className="flex items-start gap-2.5 mb-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      isSurcharge ? "bg-red-100 text-red-700"
                      : isProche ? "bg-amber-100 text-amber-700"
                      : "bg-primary/10 text-primary"
                    }`}>
                      {e.initiales}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-medium text-foreground truncate">
                          {e.prenom} {e.nom}
                        </span>
                        {isRecommande && (
                          <span className="text-xs px-1.5 py-0.5 rounded font-medium shrink-0" style={{ background: "#EAF3DE", color: "#27500A" }}>
                            ★ Recommandé
                          </span>
                        )}
                        {isSurcharge && (
                          <AlertTriangle size={13} className="text-red-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{e.specialite}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`text-sm font-bold ${
                        isSurcharge ? "text-red-600" : isProche ? "text-amber-600" : "text-foreground"
                      }`}>
                        {e.dossiers_actifs}
                      </span>
                      <span className="text-xs text-muted-foreground">/{e.seuil_max}</span>
                    </div>
                  </div>
                  <WorkloadBar employe={e} />
                  {!e.disponible && (
                    <p className="text-xs text-muted-foreground mt-1">Absent / indisponible</p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Légende */}
          <div className="space-y-1.5 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-green-500 inline-block"></span>
              <span>Disponible (0–3 dossiers)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-amber-400 inline-block"></span>
              <span>Quasi-plein (4 dossiers)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-red-500 inline-block"></span>
              <span>Surchargé (5+ dossiers)</span>
            </div>
          </div>

          {/* Alerte si tous surchargés */}
          {employes_surcharges.length === employes.length && (
            <div className="p-3 rounded-lg border flex items-start gap-2" style={{ background: "#FCEBEB", borderColor: "#E24B4A33" }}>
              <AlertTriangle size={14} style={{ color: "#A32D2D" }} className="shrink-0 mt-0.5" />
              <p className="text-xs" style={{ color: "#A32D2D" }}>
                Tous les employés sont surchargés. Pensez à recruter un renfort ou à redistribuer les dossiers.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Assignment Modal */}
      <AssignmentModal
        open={!!assignModal}
        onClose={() => setAssignModal(null)}
        dossier={assignModal}
        employes={employesWorkload}
        onAssign={handleAssign}
      />
    </div>
  );
}