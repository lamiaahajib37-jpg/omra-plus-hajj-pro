// ════════════════════════════════════════════════════════════════════════
// NewClientModal.tsx — Formulaire nouveau client — wizard multi-étapes
// ════════════════════════════════════════════════════════════════════════
import { useState, useRef, useEffect, useCallback } from "react";
import {
  X, User, Phone, MapPin, Briefcase, ChevronRight,
  ChevronLeft, Check, Loader2, Sparkles, Building2,
  Mail, Globe, Hash, AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Client } from "./Clients";

// ── Types ──────────────────────────────────────────────────────────────
type Departement = Client["departement"];
type Statut      = Client["statut"];

interface FormData {
  // Étape 1 — Identité
  prenom:      string;
  nom:         string;
  email:       string;
  telephone:   string;
  // Étape 2 — Localisation
  ville:       string;
  adresse:     string;
  pays:        string;
  // Étape 3 — Profil commercial
  departement: Departement | "";
  statut:      Statut | "";
  source:      string;
  notes:       string;
}

interface FieldError { [k: string]: string }

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (client: Omit<Client, "id" | "nbDossiers" | "totalCA" | "dernierDossier">) => void;
}

// ── Constants ──────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Identité",    icon: User      },
  { id: 2, label: "Adresse",     icon: MapPin    },
  { id: 3, label: "Profil",      icon: Briefcase },
] as const;

const DEPARTEMENTS: { value: Departement; label: string; desc: string; color: string }[] = [
  { value: "mice",      label: "MICE",        desc: "Meetings, incentives, congrès",  color: "from-violet-500/10 border-violet-200 hover:border-violet-400" },
  { value: "leisure",   label: "Leisure",     desc: "Voyages loisirs & tourisme",     color: "from-sky-500/10 border-sky-200 hover:border-sky-400"           },
  { value: "hajj_omra", label: "Hajj & Omra", desc: "Pèlerinages & voyages spirituels", color: "from-emerald-500/10 border-emerald-200 hover:border-emerald-400" },
  { value: "outbound",  label: "Outbound",    desc: "Voyages internationaux sortants", color: "from-amber-500/10 border-amber-200 hover:border-amber-400"    },
];

const STATUTS: { value: Statut; label: string; dot: string }[] = [
  { value: "actif",    label: "Actif",    dot: "bg-emerald-500" },
  { value: "en_cours", label: "En cours", dot: "bg-amber-400"   },
  { value: "promis",   label: "Promis",   dot: "bg-blue-400"    },
  { value: "inactif",  label: "Inactif",  dot: "bg-stone-400"   },
];

const SOURCES = ["Recommandation", "Réseaux sociaux", "Site web", "Salon professionnel", "Agence partenaire", "Autre"];

const PAYS_MAROC = ["Casablanca", "Rabat", "Marrakech", "Fès", "Agadir", "Tanger", "Meknès", "Oujda", "Tétouan", "Laâyoune"];

const INITIAL: FormData = {
  prenom: "", nom: "", email: "", telephone: "",
  ville: "", adresse: "", pays: "Maroc",
  departement: "", statut: "", source: "", notes: "",
};

// ── Validation ─────────────────────────────────────────────────────────
function validateStep(step: number, data: FormData): FieldError {
  const errors: FieldError = {};
  if (step === 1) {
    if (!data.prenom.trim())  errors.prenom    = "Prénom requis";
    if (!data.nom.trim())     errors.nom       = "Nom requis";
    if (!data.email.trim())   errors.email     = "Email requis";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = "Email invalide";
    if (!data.telephone.trim()) errors.telephone = "Téléphone requis";
  }
  if (step === 2) {
    if (!data.ville.trim()) errors.ville = "Ville requise";
  }
  if (step === 3) {
    if (!data.departement) errors.departement = "Département requis";
    if (!data.statut)      errors.statut      = "Statut requis";
  }
  return errors;
}

// ── Field component ────────────────────────────────────────────────────
function Field({
  label, error, children, required,
}: { label: string; error?: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
        {label}{required && <span className="text-primary ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs text-destructive animate-in slide-in-from-top-1">
          <AlertCircle size={11} /> {error}
        </p>
      )}
    </div>
  );
}

// ── Input styles ───────────────────────────────────────────────────────
const inputCls = (error?: string) => cn(
  "w-full h-10 px-3 rounded-lg text-sm text-foreground",
  "bg-muted/40 border transition-all duration-150 outline-none",
  "placeholder:text-muted-foreground/50",
  "focus:bg-background focus:border-primary/50 focus:ring-2 focus:ring-primary/10",
  error ? "border-destructive/60 focus:border-destructive focus:ring-destructive/10" : "border-border/60",
);

// ════════════════════════════════════════════════════════════════════════
// Main component
// ════════════════════════════════════════════════════════════════════════
export default function NewClientModal({ open, onClose, onSubmit }: Props) {
  const [step,       setStep]       = useState(1);
  const [data,       setData]       = useState<FormData>(INITIAL);
  const [errors,     setErrors]     = useState<FieldError>({});
  const [touched,    setTouched]    = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [done,       setDone]       = useState(false);
  const [direction,  setDirection]  = useState<"forward" | "back">("forward");

  const overlayRef = useRef<HTMLDivElement>(null);

  // Reset on open
  useEffect(() => {
    if (open) {
      setStep(1); setData(INITIAL); setErrors({});
      setTouched(new Set()); setSubmitting(false); setDone(false);
    }
  }, [open]);

  // Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape" && open) onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const set = useCallback((field: keyof FormData, value: string) => {
    setData(d => ({ ...d, [field]: value }));
    setTouched(t => new Set(t).add(field));
    // clear error on change
    setErrors(e => { const n = { ...e }; delete n[field]; return n; });
  }, []);

  const goNext = () => {
    const errs = validateStep(step, data);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setDirection("forward");
    setStep(s => s + 1);
    setErrors({});
  };

  const goBack = () => {
    setDirection("back");
    setStep(s => s - 1);
    setErrors({});
  };

  const handleSubmit = async () => {
    const errs = validateStep(3, data);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1200));
    onSubmit({
      prenom:      data.prenom,
      nom:         data.nom,
      email:       data.email,
      telephone:   data.telephone,
      ville:       data.ville,
      dateCreation: new Date().toISOString().split("T")[0],
      statut:      data.statut as Statut,
      departement: data.departement as Departement,
    });
    setSubmitting(false);
    setDone(true);
    setTimeout(() => onClose(), 1800);
  };

  if (!open) return null;

  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  return (
    // Overlay
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
      onClick={e => { if (e.target === overlayRef.current) onClose(); }}
    >
      {/* Modal */}
      <div
        className={cn(
          "relative w-full max-w-lg bg-card rounded-2xl shadow-2xl overflow-hidden",
          "animate-in fade-in zoom-in-95 duration-200",
        )}
        style={{ maxHeight: "90vh" }}
      >
        {/* ── Top bar ──────────────────────────────────────────────── */}
        <div className="relative px-6 pt-5 pb-0">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          >
            <X size={16} />
          </button>

          {/* Title */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Sparkles size={16} className="text-primary" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground leading-tight">Nouveau client</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Étape {step} sur {STEPS.length} — {STEPS[step - 1].label}
              </p>
            </div>
          </div>

          {/* Step indicators */}
          <div className="flex items-center gap-0 mb-5">
            {STEPS.map((s, i) => {
              const done_step = step > s.id;
              const active    = step === s.id;
              return (
                <div key={s.id} className="flex items-center flex-1 last:flex-none">
                  {/* Circle */}
                  <div
                    className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-all duration-300",
                      done_step ? "bg-primary text-primary-foreground scale-100"
                        : active ? "bg-primary/15 text-primary ring-2 ring-primary/30"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {done_step ? <Check size={13} /> : s.id}
                  </div>
                  {/* Label */}
                  <span className={cn(
                    "ml-1.5 text-xs font-medium transition-colors mr-2",
                    active ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {s.label}
                  </span>
                  {/* Connector */}
                  {i < STEPS.length - 1 && (
                    <div className="flex-1 h-px bg-border/60 mx-1 relative overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 bg-primary transition-all duration-500"
                        style={{ width: step > s.id ? "100%" : "0%" }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Progress bar ─────────────────────────────────────────── */}
        <div className="h-0.5 bg-muted/60 mx-0">
          <div
            className="h-full bg-gradient-to-r from-primary/70 to-primary transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* ── Form area ────────────────────────────────────────────── */}
        <div className="px-6 py-5 overflow-y-auto" style={{ maxHeight: "calc(90vh - 200px)" }}>

          {/* ─── Success state ─────────────────────────────────────── */}
          {done && (
            <div className="flex flex-col items-center justify-center py-10 text-center animate-in fade-in zoom-in-90 duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                <Check size={28} className="text-emerald-600" />
              </div>
              <h3 className="text-base font-semibold text-foreground">Client créé avec succès</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {data.prenom} {data.nom} a été ajouté à votre base clients.
              </p>
            </div>
          )}

          {/* ─── Step 1 — Identité ────────────────────────────────── */}
          {!done && step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Prénom" error={errors.prenom} required>
                  <input
                    className={inputCls(errors.prenom)}
                    placeholder="Rim"
                    value={data.prenom}
                    onChange={e => set("prenom", e.target.value)}
                    autoFocus
                  />
                </Field>
                <Field label="Nom" error={errors.nom} required>
                  <input
                    className={inputCls(errors.nom)}
                    placeholder="Sentissi"
                    value={data.nom}
                    onChange={e => set("nom", e.target.value)}
                  />
                </Field>
              </div>

              <Field label="Email" error={errors.email} required>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                  <input
                    className={cn(inputCls(errors.email), "pl-9")}
                    placeholder="r.sentissi@gmail.com"
                    type="email"
                    value={data.email}
                    onChange={e => set("email", e.target.value)}
                  />
                </div>
              </Field>

              <Field label="Téléphone" error={errors.telephone} required>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                  <input
                    className={cn(inputCls(errors.telephone), "pl-9")}
                    placeholder="+212 6 00 00 00 00"
                    value={data.telephone}
                    onChange={e => set("telephone", e.target.value)}
                  />
                </div>
              </Field>

              {/* Smart preview card */}
              {(data.prenom || data.nom) && (
                <div className="mt-2 rounded-xl border border-border/40 bg-muted/30 p-3 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary shrink-0">
                    {data.prenom?.[0] ?? ""}{data.nom?.[0] ?? ""}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {[data.prenom, data.nom].filter(Boolean).join(" ") || "—"}
                    </p>
                    <p className="text-xs text-muted-foreground">{data.email || "Email non renseigné"}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─── Step 2 — Adresse ─────────────────────────────────── */}
          {!done && step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
              <Field label="Ville" error={errors.ville} required>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 pointer-events-none z-10" />
                  <select
                    className={cn(inputCls(errors.ville), "pl-9 appearance-none cursor-pointer")}
                    value={data.ville}
                    onChange={e => set("ville", e.target.value)}
                  >
                    <option value="">Sélectionner une ville…</option>
                    {PAYS_MAROC.map(v => <option key={v} value={v}>{v}</option>)}
                    <option value="Autre">Autre ville</option>
                  </select>
                  <ChevronRight size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground rotate-90 pointer-events-none" />
                </div>
              </Field>

              {data.ville === "Autre" && (
                <Field label="Préciser la ville" error={errors.villeCustom}>
                  <input
                    className={inputCls()}
                    placeholder="Nom de la ville"
                    autoFocus
                    onChange={e => set("ville", e.target.value)}
                  />
                </Field>
              )}

              <Field label="Adresse">
                <div className="relative">
                  <Building2 size={14} className="absolute left-3 top-3 text-muted-foreground/60" />
                  <textarea
                    className={cn(inputCls(), "pl-9 pt-2.5 h-20 resize-none leading-relaxed")}
                    placeholder="Rue, quartier, code postal…"
                    value={data.adresse}
                    onChange={e => set("adresse", e.target.value)}
                  />
                </div>
              </Field>

              <Field label="Pays">
                <div className="relative">
                  <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 pointer-events-none z-10" />
                  <select
                    className={cn(inputCls(), "pl-9 appearance-none cursor-pointer")}
                    value={data.pays}
                    onChange={e => set("pays", e.target.value)}
                  >
                    {["Maroc", "France", "Belgique", "Espagne", "Italie", "Canada", "Émirats Arabes Unis", "Arabie Saoudite", "Autre"].map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  <ChevronRight size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground rotate-90 pointer-events-none" />
                </div>
              </Field>
            </div>
          )}

          {/* ─── Step 3 — Profil commercial ───────────────────────── */}
          {!done && step === 3 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-200">
              {/* Département — card picker */}
              <Field label="Département" error={errors.departement} required>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {DEPARTEMENTS.map(d => (
                    <button
                      key={d.value}
                      type="button"
                      onClick={() => set("departement", d.value)}
                      className={cn(
                        "relative text-left p-3 rounded-xl border bg-gradient-to-br transition-all duration-150",
                        d.color,
                        data.departement === d.value
                          ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                          : "bg-transparent",
                      )}
                    >
                      {data.departement === d.value && (
                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                          <Check size={9} className="text-white" />
                        </div>
                      )}
                      <p className="text-xs font-semibold text-foreground">{d.label}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">{d.desc}</p>
                    </button>
                  ))}
                </div>
              </Field>

              {/* Statut */}
              <Field label="Statut" error={errors.statut} required>
                <div className="flex gap-2 flex-wrap">
                  {STATUTS.map(s => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => set("statut", s.value)}
                      className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium",
                        "border transition-all duration-150",
                        data.statut === s.value
                          ? "border-primary/50 bg-primary/8 text-foreground ring-2 ring-primary/15"
                          : "border-border/50 bg-muted/30 text-muted-foreground hover:border-border",
                      )}
                    >
                      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", s.dot)} />
                      {s.label}
                    </button>
                  ))}
                </div>
              </Field>

              {/* Source */}
              <Field label="Source d'acquisition">
                <div className="relative">
                  <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 pointer-events-none z-10" />
                  <select
                    className={cn(inputCls(), "pl-9 appearance-none cursor-pointer")}
                    value={data.source}
                    onChange={e => set("source", e.target.value)}
                  >
                    <option value="">Sélectionner…</option>
                    {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronRight size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground rotate-90 pointer-events-none" />
                </div>
              </Field>

              {/* Notes */}
              <Field label="Notes internes">
                <textarea
                  className={cn(inputCls(), "h-20 resize-none leading-relaxed pt-2.5")}
                  placeholder="Informations complémentaires, contexte client…"
                  value={data.notes}
                  onChange={e => set("notes", e.target.value)}
                />
              </Field>

              {/* Summary card */}
              <div className="rounded-xl border border-primary/15 bg-primary/[0.03] p-4 space-y-2">
                <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-3">Récapitulatif</p>
                {[
                  { label: "Nom complet", value: `${data.prenom} ${data.nom}` },
                  { label: "Email",       value: data.email                   },
                  { label: "Téléphone",   value: data.telephone               },
                  { label: "Ville",       value: data.ville || "—"            },
                  { label: "Département", value: DEPARTEMENTS.find(d => d.value === data.departement)?.label || "—" },
                ].map(row => (
                  <div key={row.label} className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{row.label}</span>
                    <span className="text-xs font-medium text-foreground">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Footer ───────────────────────────────────────────────── */}
        {!done && (
          <div className="px-6 py-4 border-t border-border/40 flex items-center justify-between bg-muted/20">
            <button
              onClick={step === 1 ? onClose : goBack}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
            >
              {step > 1 && <ChevronLeft size={14} />}
              {step === 1 ? "Annuler" : "Retour"}
            </button>

            <div className="flex items-center gap-2">
              {/* Dot progress */}
              <div className="flex gap-1 mr-2">
                {STEPS.map(s => (
                  <div
                    key={s.id}
                    className={cn(
                      "rounded-full transition-all duration-300",
                      step === s.id ? "w-4 h-1.5 bg-primary" : step > s.id ? "w-1.5 h-1.5 bg-primary/40" : "w-1.5 h-1.5 bg-muted-foreground/25"
                    )}
                  />
                ))}
              </div>

              {step < STEPS.length ? (
                <button
                  onClick={goNext}
                  className="
                    inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium
                    bg-primary text-primary-foreground
                    hover:opacity-90 active:scale-[0.98] transition-all shadow-sm
                  "
                >
                  Suivant
                  <ChevronRight size={14} />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="
                    inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium
                    bg-primary text-primary-foreground
                    hover:opacity-90 active:scale-[0.98] transition-all shadow-sm
                    disabled:opacity-60 disabled:cursor-not-allowed
                  "
                >
                  {submitting ? (
                    <><Loader2 size={14} className="animate-spin" /> Création en cours…</>
                  ) : (
                    <><Check size={14} /> Créer le client</>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}