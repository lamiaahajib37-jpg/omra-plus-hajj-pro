import { useState } from "react";
import { Users, Clock, CalendarOff, CheckCircle, Plus, X, Upload, FileText, ChevronDown } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const departements = [
  "Commercial",
  "Hajj & Omra",
  "Tourisme",
  "Marketing",
  "Finance",
  "Informatique",
  "Administration",
  "Accueil & Service Client",
];

const typeContrats = [
  "CDI – Contrat à Durée Indéterminée",
  "CDD – Contrat à Durée Déterminée",
  "Intérim",
  "Stage",
  "Freelance / Prestation",
  "Temps partiel",
];

const initialEmployees = [
  { id: 1, name: "Youssef El Amrani", dept: "Commercial", poste: "Responsable Commercial", salaire: "18 000 MAD", status: "Actif", tel: "+212 6 12 34 56 78", contrat: "CDI – Contrat à Durée Indéterminée" },
  { id: 2, name: "Fatima Zahra Bennani", dept: "Hajj & Omra", poste: "Coordinatrice Pèlerinage", salaire: "15 000 MAD", status: "Actif", tel: "+212 6 23 45 67 89", contrat: "CDI – Contrat à Durée Indéterminée" },
  { id: 3, name: "Karim Tazi", dept: "Tourisme", poste: "Chef de produit", salaire: "16 500 MAD", status: "Actif", tel: "+212 6 34 56 78 90", contrat: "CDD – Contrat à Durée Déterminée" },
  { id: 4, name: "Amina Chraibi", dept: "Marketing", poste: "Community Manager", salaire: "12 000 MAD", status: "Actif", tel: "+212 6 45 67 89 01", contrat: "CDI – Contrat à Durée Indéterminée" },
  { id: 5, name: "Hassan Ouazzani", dept: "Finance", poste: "Comptable", salaire: "14 000 MAD", status: "Congé", tel: "+212 6 56 78 90 12", contrat: "CDI – Contrat à Durée Indéterminée" },
  { id: 6, name: "Nadia Berrada", dept: "Hajj & Omra", poste: "Agent réservation", salaire: "11 000 MAD", status: "Actif", tel: "+212 6 67 89 01 23", contrat: "CDD – Contrat à Durée Déterminée" },
];

const attendanceData = [
  { day: "Lun", present: 44, absent: 4 },
  { day: "Mar", present: 46, absent: 2 },
  { day: "Mer", present: 42, absent: 6 },
  { day: "Jeu", present: 45, absent: 3 },
  { day: "Ven", present: 40, absent: 8 },
];

const leaveRequests = [
  { employee: "Hassan Ouazzani", type: "Congé annuel", from: "25/03/2026", to: "02/04/2026", status: "En attente" },
  { employee: "Amina Chraibi", type: "Congé maladie", from: "20/03/2026", to: "22/03/2026", status: "Approuvé" },
  { employee: "Karim Tazi", type: "Congé personnel", from: "15/04/2026", to: "16/04/2026", status: "En attente" },
];

const emptyForm = {
  nom: "",
  prenom: "",
  tel: "",
  email: "",
  dept: "",
  poste: "",
  salaire: "",
  contrat: "",
  dateDebut: "",
  dateFin: "",
  cin: "",
  adresse: "",
  fichierContrat: null,
};

export default function RH() {
  const [employees, setEmployees] = useState(initialEmployees);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setForm((prev) => ({ ...prev, fichierContrat: file }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.nom.trim()) newErrors.nom = "Champ requis";
    if (!form.prenom.trim()) newErrors.prenom = "Champ requis";
    if (!form.tel.trim()) newErrors.tel = "Champ requis";
    if (!form.dept) newErrors.dept = "Choisir un département";
    if (!form.poste.trim()) newErrors.poste = "Champ requis";
    if (!form.salaire.trim()) newErrors.salaire = "Champ requis";
    if (!form.contrat) newErrors.contrat = "Choisir un type de contrat";
    if (!form.dateDebut) newErrors.dateDebut = "Date requise";
    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const nouvelEmploye = {
      id: employees.length + 1,
      name: `${form.prenom} ${form.nom}`,
      dept: form.dept,
      poste: form.poste,
      salaire: `${form.salaire} MAD`,
      status: "Actif",
      tel: form.tel,
      contrat: form.contrat,
    };

    setEmployees((prev) => [...prev, nouvelEmploye]);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setShowModal(false);
      setForm(emptyForm);
      setFileName("");
      setErrors({});
    }, 1800);
  };

  const handleClose = () => {
    setShowModal(false);
    setForm(emptyForm);
    setFileName("");
    setErrors({});
    setSuccess(false);
  };

  const isCDD = form.contrat.startsWith("CDD") || form.contrat === "Stage";

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Ressources Humaines</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all shadow-md hover:opacity-90 active:scale-95"
          style={{ background: "hsl(354, 85%, 42%)" }}
        >
          <Plus size={16} />
          Nouvel Employé
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Employés" value={employees.length} icon={Users} change="+3 ce mois" changeType="up" />
        <StatCard title="Présents aujourd'hui" value={employees.filter(e => e.status === "Actif").length} icon={CheckCircle} change="94%" changeType="up" />
        <StatCard title="En retard" value={2} icon={Clock} change="vs 5 hier" changeType="down" />
        <StatCard title="En congé" value={employees.filter(e => e.status === "Congé").length} icon={CalendarOff} />
      </div>

      <Tabs defaultValue="employees">
        <TabsList>
          <TabsTrigger value="employees">Employés</TabsTrigger>
          <TabsTrigger value="attendance">Présences</TabsTrigger>
          <TabsTrigger value="leaves">Congés</TabsTrigger>
        </TabsList>

        <TabsContent value="employees">
          <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-3 font-medium text-muted-foreground">Nom</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Département</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Poste</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Salaire</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Contrat</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Téléphone</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Statut</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((e) => (
                  <tr key={e.id} className="border-t hover:bg-muted/50 transition-colors">
                    <td className="p-3 font-medium">{e.name}</td>
                    <td className="p-3">{e.dept}</td>
                    <td className="p-3">{e.poste}</td>
                    <td className="p-3">{e.salaire}</td>
                    <td className="p-3 max-w-[160px] truncate text-xs text-muted-foreground" title={e.contrat}>{e.contrat?.split("–")[0]?.trim() || "–"}</td>
                    <td className="p-3">{e.tel}</td>
                    <td className="p-3">
                      <Badge variant={e.status === "Actif" ? "default" : "secondary"} className={e.status === "Actif" ? "bg-success text-success-foreground" : ""}>
                        {e.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="attendance">
          <div className="bg-card rounded-xl border shadow-sm p-5">
            <h3 className="font-semibold mb-4">Présences cette semaine</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,14%,90%)" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="present" fill="hsl(354, 85%, 42%)" name="Présents" radius={[4,4,0,0]} />
                <Bar dataKey="absent" fill="hsl(220,14%,90%)" name="Absents" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        <TabsContent value="leaves">
          <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-3 font-medium text-muted-foreground">Employé</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Type</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Du</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Au</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Statut</th>
                </tr>
              </thead>
              <tbody>
                {leaveRequests.map((l, i) => (
                  <tr key={i} className="border-t hover:bg-muted/50">
                    <td className="p-3 font-medium">{l.employee}</td>
                    <td className="p-3">{l.type}</td>
                    <td className="p-3">{l.from}</td>
                    <td className="p-3">{l.to}</td>
                    <td className="p-3">
                      <Badge className={l.status === "Approuvé" ? "bg-success text-success-foreground" : "bg-warning text-warning-foreground"}>
                        {l.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>

      {/* ===== MODAL CRÉER EMPLOYÉ ===== */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.45)" }}>
          <div className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto border">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-card z-10">
              <div>
                <h2 className="text-lg font-bold">Nouvel Employé</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Remplissez les informations ci-dessous</p>
              </div>
              <button onClick={handleClose} className="p-2 rounded-lg hover:bg-muted transition-colors">
                <X size={18} />
              </button>
            </div>

            {success ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "hsl(354, 85%, 95%)" }}>
                  <CheckCircle size={32} style={{ color: "hsl(354, 85%, 42%)" }} />
                </div>
                <p className="font-semibold text-lg">Employé ajouté avec succès !</p>
              </div>
            ) : (
              <div className="px-6 py-5 space-y-5">

                {/* Identité */}
                <Section title="Identité">
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Prénom" required error={errors.prenom}>
                      <input
                        type="text"
                        placeholder="Ex: Youssef"
                        value={form.prenom}
                        onChange={e => handleChange("prenom", e.target.value)}
                        className={inputCls(errors.prenom)}
                      />
                    </Field>
                    <Field label="Nom" required error={errors.nom}>
                      <input
                        type="text"
                        placeholder="Ex: El Amrani"
                        value={form.nom}
                        onChange={e => handleChange("nom", e.target.value)}
                        className={inputCls(errors.nom)}
                      />
                    </Field>
                    <Field label="CIN">
                      <input
                        type="text"
                        placeholder="Ex: AB123456"
                        value={form.cin}
                        onChange={e => handleChange("cin", e.target.value)}
                        className={inputCls()}
                      />
                    </Field>
                    <Field label="Téléphone" required error={errors.tel}>
                      <input
                        type="tel"
                        placeholder="+212 6 XX XX XX XX"
                        value={form.tel}
                        onChange={e => handleChange("tel", e.target.value)}
                        className={inputCls(errors.tel)}
                      />
                    </Field>
                    <Field label="Email" cls="col-span-2">
                      <input
                        type="email"
                        placeholder="email@exemple.ma"
                        value={form.email}
                        onChange={e => handleChange("email", e.target.value)}
                        className={inputCls()}
                      />
                    </Field>
                    <Field label="Adresse" cls="col-span-2">
                      <input
                        type="text"
                        placeholder="Adresse complète"
                        value={form.adresse}
                        onChange={e => handleChange("adresse", e.target.value)}
                        className={inputCls()}
                      />
                    </Field>
                  </div>
                </Section>

                {/* Poste */}
                <Section title="Poste & Département">
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Département" required error={errors.dept}>
                      <div className="relative">
                        <select
                          value={form.dept}
                          onChange={e => handleChange("dept", e.target.value)}
                          className={selectCls(errors.dept)}
                        >
                          <option value="">Sélectionner…</option>
                          {departements.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                      </div>
                    </Field>
                    <Field label="Poste / Titre" required error={errors.poste}>
                      <input
                        type="text"
                        placeholder="Ex: Responsable Commercial"
                        value={form.poste}
                        onChange={e => handleChange("poste", e.target.value)}
                        className={inputCls(errors.poste)}
                      />
                    </Field>
                    <Field label="Salaire (MAD)" required error={errors.salaire}>
                      <input
                        type="number"
                        placeholder="Ex: 15000"
                        value={form.salaire}
                        onChange={e => handleChange("salaire", e.target.value)}
                        className={inputCls(errors.salaire)}
                      />
                    </Field>
                  </div>
                </Section>

                {/* Contrat */}
                <Section title="Contrat">
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Type de contrat" required error={errors.contrat} cls="col-span-2">
                      <div className="grid grid-cols-2 gap-2">
                        {typeContrats.map(tc => (
                          <button
                            key={tc}
                            type="button"
                            onClick={() => handleChange("contrat", tc)}
                            className={`text-left px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                              form.contrat === tc
                                ? "border-transparent text-white"
                                : "border-border text-muted-foreground hover:border-muted-foreground"
                            }`}
                            style={form.contrat === tc ? { background: "hsl(354, 85%, 42%)" } : {}}
                          >
                            {tc}
                          </button>
                        ))}
                      </div>
                      {errors.contrat && <p className="text-xs mt-1" style={{ color: "hsl(354, 85%, 42%)" }}>{errors.contrat}</p>}
                    </Field>

                    <Field label="Date de début" required error={errors.dateDebut}>
                      <input
                        type="date"
                        value={form.dateDebut}
                        onChange={e => handleChange("dateDebut", e.target.value)}
                        className={inputCls(errors.dateDebut)}
                      />
                    </Field>

                    {isCDD && (
                      <Field label="Date de fin (CDD/Stage)">
                        <input
                          type="date"
                          value={form.dateFin}
                          onChange={e => handleChange("dateFin", e.target.value)}
                          className={inputCls()}
                        />
                      </Field>
                    )}

                    {/* Upload contrat */}
                    <Field label="Fichier contrat (PDF)" cls="col-span-2">
                      <label className="flex items-center gap-3 border-2 border-dashed border-border rounded-lg px-4 py-3 cursor-pointer hover:border-muted-foreground transition-colors">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "hsl(354, 85%, 95%)" }}>
                          {fileName ? <FileText size={16} style={{ color: "hsl(354, 85%, 42%)" }} /> : <Upload size={16} style={{ color: "hsl(354, 85%, 42%)" }} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          {fileName
                            ? <span className="text-sm font-medium truncate block">{fileName}</span>
                            : <span className="text-sm text-muted-foreground">Cliquez pour importer le contrat signé</span>
                          }
                          <span className="text-xs text-muted-foreground">PDF, Word – max 10 Mo</span>
                        </div>
                        <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleFile} />
                      </label>
                    </Field>
                  </div>
                </Section>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-2 border-t">
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 rounded-lg border text-sm font-medium hover:bg-muted transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-5 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95 shadow"
                    style={{ background: "hsl(354, 85%, 42%)" }}
                  >
                    Créer l'employé
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Helpers ────────────────────────────────────────────────
function Section({ title, children }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">{title}</p>
      {children}
    </div>
  );
}

function Field({ label, required, error, children, cls = "" }) {
  return (
    <div className={cls}>
      <label className="block text-xs font-medium mb-1.5">
        {label}{required && <span style={{ color: "hsl(354, 85%, 42%)" }}> *</span>}
      </label>
      {children}
      {error && <p className="text-xs mt-1" style={{ color: "hsl(354, 85%, 42%)" }}>{error}</p>}
    </div>
  );
}

function inputCls(error) {
  return `w-full px-3 py-2 rounded-lg border text-sm bg-background transition-colors outline-none focus:ring-2 ${
    error ? "border-red-400 focus:ring-red-200" : "border-border focus:ring-[hsl(354,85%,85%)] focus:border-[hsl(354,85%,42%)]"
  }`;
}

function selectCls(error) {
  return `w-full px-3 py-2 pr-8 rounded-lg border text-sm bg-background appearance-none transition-colors outline-none focus:ring-2 ${
    error ? "border-red-400 focus:ring-red-200" : "border-border focus:ring-[hsl(354,85%,85%)] focus:border-[hsl(354,85%,42%)]"
  }`;
}