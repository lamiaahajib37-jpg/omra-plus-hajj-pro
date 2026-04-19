import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  ArrowLeft, FolderOpen, Users, Calendar, MapPin, FileText,
  DollarSign, MessageSquare, Paperclip, Plus,
  CheckCircle2, Clock, User, Eye,
} from "lucide-react";
import { mockDossiers, DEPARTEMENTS_LABELS } from "@/data/crmData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// ─── Mock dossiers (identique à Dossiers.tsx) ────────────────────────────────
const YOUSSEF_DOSSIERS = [
  {
    id: "YE-001",
    reference: "DOS-2026-0042",
    clientNom: "Ahmed Benali",
    destination: "Médine & La Mecque",
    departement: "hajj_omra",
    statut: "en_cours",
    nombrePax: 4,
    dateVoyage: "2026-06-15",
    totalContrat: 28000,
    totalPaye: 8000,
    managerNom: "Admin Manager",
    employeNom: "Youssef El Amrani",
    presentations: [
      {
        version: 1, dateCreation: "2026-03-10", totalHT: 26000,
        valideParClient: false, notes: "Première proposition",
        commentaireClient: "Peut-on réviser le prix du vol ?",
        employeNom: "Youssef El Amrani",
        documents: [],
      },
    ],
    paiements: [
      { id: "P1", montant: 8000, mode: "virement", reference: "VIR-2026-001", note: "1er acompte", date: "2026-03-12", valide: true, employeNom: "Youssef El Amrani" },
    ],
    commentaires: [
      { auteur: "Youssef El Amrani", texte: "Dossier ouvert — en attente confirmation visa.", date: "2026-03-10" },
    ],
    documents: [],
    assigneA: "Youssef",
    notes: "Client régulier — traiter en priorité",
  },
  {
    id: "YE-002",
    reference: "DOS-2026-0051",
    clientNom: "Fatima Zahra Idrissi",
    destination: "Istanbul, Turquie",
    departement: "leisure",
    statut: "confirme",
    nombrePax: 2,
    dateVoyage: "2026-05-20",
    totalContrat: 9500,
    totalPaye: 9500,
    managerNom: "Admin Manager",
    employeNom: "Youssef El Amrani",
    presentations: [
      {
        version: 1, dateCreation: "2026-02-20", totalHT: 9500,
        valideParClient: true, notes: "Voyage de noces",
        employeNom: "Youssef El Amrani",
        documents: [
          { nom: "Proposition_Istanbul_V1.xlsx", type: "excel", date: "2026-02-20" },
          { nom: "Programme_Voyage_Noces.pptx", type: "powerpoint", date: "2026-02-20" },
        ],
      },
    ],
    paiements: [
      { id: "P2", montant: 9500, mode: "carte", note: "Paiement intégral", date: "2026-02-22", valide: true, employeNom: "Youssef El Amrani" },
    ],
    commentaires: [
      { auteur: "Youssef El Amrani", texte: "Paiement complet reçu. Billets confirmés.", date: "2026-02-22" },
    ],
    documents: [
      { nom: "Billets_Istanbul.pdf", date: "2026-02-23" },
      { nom: "Reservation_Hotel.pdf", date: "2026-02-23" },
    ],
    assigneA: "Youssef",
    notes: "Voyage de noces — attention particulière",
  },
  {
    id: "YE-003",
    reference: "DOS-2026-0058",
    clientNom: "Omar Tazi",
    destination: "Dubai, Émirats",
    departement: "outbound",
    statut: "en_cours",
    nombrePax: 6,
    dateVoyage: "2026-07-01",
    totalContrat: 42000,
    totalPaye: 15000,
    managerNom: "Admin Manager",
    employeNom: "Youssef El Amrani",
    presentations: [],
    paiements: [
      { id: "P3", montant: 15000, mode: "virement", note: "Acompte initial", date: "2026-03-20", valide: true, employeNom: "Youssef El Amrani" },
    ],
    commentaires: [],
    documents: [],
    assigneA: "Youssef",
    notes: "Groupe famille élargie",
  },
  {
    id: "YE-004",
    reference: "DOS-2026-0063",
    clientNom: "Sara Mohammedi",
    destination: "Médine — Omra Ramadan",
    departement: "hajj_omra",
    statut: "en_cours",
    nombrePax: 3,
    dateVoyage: "2026-04-20",
    totalContrat: 18500,
    totalPaye: 5000,
    managerNom: "Admin Manager",
    employeNom: "Youssef El Amrani",
    presentations: [
      {
        version: 1, dateCreation: "2026-03-25", totalHT: 18000,
        valideParClient: false, notes: "Devis initial Omra",
        employeNom: "Youssef El Amrani",
        documents: [],
      },
    ],
    paiements: [
      { id: "P4", montant: 5000, mode: "cheque", note: "Acompte réservation", date: "2026-03-26", valide: true, employeNom: "Youssef El Amrani" },
    ],
    commentaires: [
      { auteur: "Youssef El Amrani", texte: "Visa en cours de traitement — priorité haute.", date: "2026-03-26" },
    ],
    documents: [{ nom: "Demande_Visa_Omra.pdf", date: "2026-03-27" }],
    assigneA: "Youssef",
    notes: "Départ urgent — prioriser les visas",
  },
  {
    id: "YE-005",
    reference: "DOS-2026-0071",
    clientNom: "Karim El Fassi",
    destination: "Marrakech MICE",
    departement: "mice",
    statut: "en_cours",
    nombrePax: 45,
    dateVoyage: "2026-05-10",
    totalContrat: 185000,
    totalPaye: 60000,
    managerNom: "Admin Manager",
    employeNom: "Youssef El Amrani",
    presentations: [
      {
        version: 1, dateCreation: "2026-03-01", totalHT: 180000,
        valideParClient: false, notes: "Gala dinner + activités",
        employeNom: "Youssef El Amrani",
        documents: [{ nom: "Costing_MICE_V1.xlsx", type: "excel", date: "2026-03-01" }],
      },
      {
        version: 2, dateCreation: "2026-03-15", totalHT: 185000,
        valideParClient: false, notes: "Version révisée avec Agafay",
        commentaireClient: "Programme Agafay approuvé, attente signature.",
        employeNom: "Youssef El Amrani",
        documents: [
          { nom: "Costing_MICE_V2.xlsx", type: "excel", date: "2026-03-15" },
          { nom: "Presentation_Client_V2.pptx", type: "powerpoint", date: "2026-03-15" },
        ],
      },
    ],
    paiements: [
      { id: "P5", montant: 60000, mode: "virement", reference: "VIR-2026-089", note: "1er acompte corporate", date: "2026-03-18", valide: true, employeNom: "Youssef El Amrani" },
    ],
    commentaires: [
      { auteur: "Youssef El Amrani", texte: "Réunion client prévue le 12 avril pour finalisation.", date: "2026-03-20" },
      { auteur: "Admin Manager", texte: "Confirmer la logistique transport Agafay.", date: "2026-03-22" },
    ],
    documents: [
      { nom: "Proposition_MICE_V2.pdf", date: "2026-03-15" },
      { nom: "Contrat_Karim_ElFassi.pdf", date: "2026-03-18" },
    ],
    assigneA: "Youssef",
    notes: "Événement corporate — client VIP",
  },
];

const ALL_DOSSIERS = [...(mockDossiers as any[]), ...YOUSSEF_DOSSIERS];

// ─── Current user context (in real app, from auth context) ───────────────────
// role: "admin" | "employe"
const CURRENT_USER = { nom: "Admin Manager", role: "admin" };

const tabs = [
  { id: "apercu",        label: "Aperçu",       icon: FolderOpen },
  { id: "presentations", label: "Présentations", icon: FileText },
  { id: "paiements",     label: "Paiements",     icon: DollarSign },
  { id: "commentaires",  label: "Commentaires",  icon: MessageSquare },
  { id: "documents",     label: "Documents",     icon: Paperclip },
];

const STATUT_LABELS: Record<string, string> = {
  en_cours: "En cours",
  confirme:  "✓ Confirmé",
  annule:    "Annulé",
  termine:   "Terminé",
};

const FILE_ICONS: Record<string, string> = {
  excel: "📊",
  powerpoint: "📑",
  pdf: "📄",
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function DossierDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dossier = ALL_DOSSIERS.find((d) => d.id === id);

  const [activeTab, setActiveTab] = useState("apercu");
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<{ auteur: string; texte: string; date: string }[]>(
    dossier?.commentaires ?? []
  );

  // Admin filter: filter presentations/paiements by employee
  const isAdmin = CURRENT_USER.role === "admin";
  const allEmployees = isAdmin
    ? Array.from(new Set([
        ...(dossier?.presentations ?? []).map((p: any) => p.employeNom).filter(Boolean),
        ...(dossier?.paiements ?? []).map((p: any) => p.employeNom).filter(Boolean),
        dossier?.employeNom,
      ].filter(Boolean)))
    : [];
  const [filterEmploye, setFilterEmploye] = useState<string>("tous");

  if (!dossier) return (
    <div className="p-8 text-center text-muted-foreground">
      Dossier introuvable.
      <Button variant="link" onClick={() => navigate("/dossiers")}>Retour</Button>
    </div>
  );

  const lastPresentation = dossier.presentations[dossier.presentations.length - 1];
  const solde   = dossier.totalContrat - dossier.totalPaye;
  const pctPaye = dossier.totalContrat > 0
    ? Math.round((dossier.totalPaye / dossier.totalContrat) * 100)
    : 0;

  // Filter presentations & paiements by selected employee (admin only)
  const filteredPresentations = filterEmploye === "tous"
    ? dossier.presentations
    : dossier.presentations.filter((p: any) => p.employeNom === filterEmploye);

  const filteredPaiements = filterEmploye === "tous"
    ? dossier.paiements
    : dossier.paiements.filter((p: any) => p.employeNom === filterEmploye);

  const handleSendComment = () => {
    if (!newComment.trim()) return;
    setComments(prev => [...prev, {
      auteur: CURRENT_USER.nom,
      texte: newComment.trim(),
      date: new Date().toISOString(),
    }]);
    setNewComment("");
  };

  // Employee filter bar (admin only)
  const EmployeeFilterBar = () => {
    if (!isAdmin || allEmployees.length === 0) return null;
    return (
      <div className="flex items-center gap-3 px-4 py-2.5 bg-primary/5 border border-primary/20 rounded-xl mb-4">
        <User size={14} className="text-primary shrink-0" />
        <span className="text-xs font-medium text-primary">Filtrer par employé :</span>
        <Select value={filterEmploye} onValueChange={setFilterEmploye}>
          <SelectTrigger className="h-7 w-52 text-xs border-primary/30">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tous">Tous les employés</SelectItem>
            {allEmployees.map((emp: string) => (
              <SelectItem key={emp} value={emp}>{emp}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {filterEmploye !== "tous" && (
          <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
            <Eye size={10} className="mr-1" />
            Vue filtrée
          </Badge>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/dossiers")}>
          <ArrowLeft size={18} />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-foreground">{dossier.reference}</h1>
            <Badge
              variant={dossier.statut === "confirme" ? "default" : "secondary"}
              className={dossier.statut === "confirme" ? "bg-emerald-600" : ""}
            >
              {STATUT_LABELS[dossier.statut] ?? dossier.statut}
            </Badge>
            <Badge variant="outline">
              {(DEPARTEMENTS_LABELS[dossier.departement] as string) ?? dossier.departement}
            </Badge>
            {isAdmin && (
              <Badge variant="outline" className="bg-amber-50 border-amber-200 text-amber-700 text-xs gap-1">
                <Eye size={10} /> Vue Admin
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">{dossier.clientNom}</p>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { icon: MapPin,     label: "Destination",   value: dossier.destination },
          { icon: Users,      label: "Participants",  value: `${dossier.nombrePax} pax` },
          { icon: Calendar,   label: "Date voyage",   value: dossier.dateVoyage ? new Date(dossier.dateVoyage).toLocaleDateString("fr-FR") : "TBD" },
          { icon: FileText,   label: "Présentations", value: `${dossier.presentations.length} version${dossier.presentations.length > 1 ? "s" : ""}` },
          { icon: DollarSign, label: "Total contrat", value: `${dossier.totalContrat.toLocaleString()} $` },
        ].map((s) => (
          <Card key={s.label} className="border-border/50">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <s.icon size={13} className="text-primary" />
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
              <p className="text-sm font-semibold truncate">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex gap-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Aperçu ── */}
      {activeTab === "apercu" && (
        <div className="grid grid-cols-2 gap-6">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Équipe assignée</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {dossier.managerNom && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">M</div>
                  <div>
                    <p className="text-sm font-medium">{dossier.managerNom}</p>
                    <p className="text-xs text-muted-foreground">Manager</p>
                  </div>
                </div>
              )}
              {dossier.employeNom && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground text-xs font-bold">E</div>
                  <div>
                    <p className="text-sm font-medium">{dossier.employeNom}</p>
                    <p className="text-xs text-muted-foreground">Employé responsable</p>
                  </div>
                </div>
              )}
              {dossier.notes && (
                <div className="mt-2 px-3 py-2 bg-amber-50 border border-amber-100 rounded-lg">
                  <p className="text-xs text-amber-700 italic">{dossier.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">État des paiements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total contrat</span>
                <span className="font-bold">{dossier.totalContrat.toLocaleString()} $</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Encaissé</span>
                <span className="font-bold text-emerald-600">{dossier.totalPaye.toLocaleString()} $</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Solde restant</span>
                <span className="font-bold text-amber-600">{solde.toLocaleString()} $</span>
              </div>
              <div className="pt-2">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Progression</span>
                  <span>{pctPaye}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pctPaye}%` }} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Admin: résumé de toutes les versions par employé */}
          {isAdmin && dossier.presentations.length > 0 && (
            <Card className="border-border/50 col-span-2 bg-primary/5 border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Eye size={15} className="text-primary" />
                  Vue admin — Toutes les présentations par employé
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {dossier.presentations.map((p: any) => (
                    <div key={p.version} className="flex items-center justify-between py-2 px-3 rounded-lg bg-background border border-border/50">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">V{p.version}</Badge>
                        <span className="text-xs text-muted-foreground">{new Date(p.dateCreation).toLocaleDateString("fr-FR")}</span>
                        {p.employeNom && (
                          <span className="text-xs font-medium text-primary flex items-center gap-1">
                            <User size={10} /> {p.employeNom}
                          </span>
                        )}
                        {p.valideParClient
                          ? <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs gap-1"><CheckCircle2 size={10} /> Validée</Badge>
                          : <Badge variant="secondary" className="text-xs gap-1"><Clock size={10} /> En attente</Badge>
                        }
                        {p.commentaireClient && (
                          <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-xs">💬 Commentaire client</Badge>
                        )}
                      </div>
                      <span className="font-bold text-emerald-600">{p.totalHT.toLocaleString()} $</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Dernière présentation */}
          <Card className="border-border/50 col-span-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  Dernière présentation {lastPresentation ? `(V${lastPresentation.version})` : ""}
                </CardTitle>
                <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={() => navigate(`/dossiers/${id}/presentation`)}>
                  <FileText size={13} /> Voir tout
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {lastPresentation ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">
                        Créée le {new Date(lastPresentation.dateCreation).toLocaleDateString("fr-FR")}
                      </span>
                      {lastPresentation.employeNom && (
                        <span className="text-xs text-primary flex items-center gap-1">
                          <User size={10} /> {lastPresentation.employeNom}
                        </span>
                      )}
                    </div>
                    {lastPresentation.valideParClient ? (
                      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 gap-1">
                        <CheckCircle2 size={11} /> Validée par client
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="gap-1">
                        <Clock size={11} /> En attente
                      </Badge>
                    )}
                  </div>
                  <p className="text-2xl font-bold text-emerald-600">{lastPresentation.totalHT.toLocaleString()} $</p>
                  {lastPresentation.notes && <p className="text-sm text-muted-foreground">{lastPresentation.notes}</p>}
                  {lastPresentation.commentaireClient && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <p className="text-xs font-medium text-amber-700 mb-1">Commentaire client :</p>
                      <p className="text-sm text-amber-800">{lastPresentation.commentaireClient}</p>
                    </div>
                  )}
                  {/* Documents joints à cette présentation */}
                  {lastPresentation.documents?.length > 0 && (
                    <div className="pt-2 border-t border-border/50">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Documents joints :</p>
                      <div className="flex gap-2 flex-wrap">
                        {lastPresentation.documents.map((doc: any) => (
                          <Badge key={doc.nom} variant="outline" className="text-xs gap-1">
                            {FILE_ICONS[doc.type] ?? "📎"} {doc.nom}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center py-6 text-muted-foreground gap-2">
                  <FileText size={28} className="opacity-30" />
                  <p className="text-sm">Aucune présentation — créez la première version</p>
                  <Button size="sm" variant="outline" className="gap-1 text-xs mt-1" onClick={() => navigate(`/dossiers/${id}/presentation`)}>
                    <Plus size={12} /> Créer une présentation
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── Présentations ── */}
      {activeTab === "presentations" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {filteredPresentations.length} version{filteredPresentations.length > 1 ? "s" : ""}
              {filterEmploye !== "tous" && ` · ${filterEmploye}`}
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="gap-2" onClick={() => navigate(`/dossiers/${id}/costing`)}>
                <DollarSign size={14} /> Costing
              </Button>
              <Button size="sm" className="gap-2" onClick={() => navigate(`/dossiers/${id}/presentation`)}>
                <Plus size={14} /> Nouvelle version
              </Button>
            </div>
          </div>

          {/* Admin filter bar */}
          <EmployeeFilterBar />

          {filteredPresentations.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <FileText size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">Aucune présentation{filterEmploye !== "tous" ? ` pour ${filterEmploye}` : " pour ce dossier"}</p>
            </div>
          )}

          {filteredPresentations.map((p: any) => (
            <Card key={p.version} className={`border-2 ${p.valideParClient ? "border-emerald-300" : "border-border/50"}`}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                      V{p.version}
                    </div>
                    <div>
                      <p className="font-semibold">Version {p.version}</p>
                      <p className="text-xs text-muted-foreground">{new Date(p.dateCreation).toLocaleDateString("fr-FR")}</p>
                    </div>
                    {/* Employé qui a créé cette version */}
                    {p.employeNom && (
                      <Badge variant="outline" className="text-xs gap-1 text-primary border-primary/30">
                        <User size={9} /> {p.employeNom}
                      </Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-emerald-600">{p.totalHT.toLocaleString()} $</p>
                    {p.valideParClient
                      ? <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs">✓ Validée</Badge>
                      : <Badge variant="secondary" className="text-xs">En attente</Badge>}
                  </div>
                </div>

                {p.notes && <p className="text-sm text-muted-foreground mb-2">{p.notes}</p>}

                {/* Commentaire client — bien visible pour admin */}
                {p.commentaireClient && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3">
                    <p className="text-xs font-semibold text-amber-700 mb-1 flex items-center gap-1">
                      💬 Retour client :
                    </p>
                    <p className="text-sm text-amber-800 font-medium">{p.commentaireClient}</p>
                  </div>
                )}

                {/* Documents joints à cette version */}
                {p.documents?.length > 0 && (
                  <div className="mb-3 p-3 bg-muted/30 rounded-lg border border-border/50">
                    <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                      <Paperclip size={11} /> Documents joints ({p.documents.length})
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {p.documents.map((doc: any) => (
                        <div key={doc.nom} className="flex items-center gap-1.5 px-2.5 py-1 bg-background border border-border rounded-lg text-xs">
                          <span>{FILE_ICONS[doc.type] ?? "📎"}</span>
                          <span className="font-medium">{doc.nom}</span>
                          <Button variant="ghost" size="sm" className="h-5 px-1 text-xs text-muted-foreground">↓</Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="text-xs gap-1" onClick={() => navigate(`/dossiers/${id}/presentation`)}>
                    <FileText size={12} /> Voir détails
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs gap-1" onClick={() => navigate(`/dossiers/${id}/costing`)}>
                    <DollarSign size={12} /> Costing
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ── Paiements ── */}
      {activeTab === "paiements" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {filteredPaiements.length} paiement{filteredPaiements.length > 1 ? "s" : ""} enregistré{filteredPaiements.length > 1 ? "s" : ""}
              {filterEmploye !== "tous" && ` · ${filterEmploye}`}
            </p>
            <Button size="sm" className="gap-2" onClick={() => navigate(`/dossiers/${id}/paiements`)}>
              <Plus size={14} /> Nouveau paiement
            </Button>
          </div>

          {/* Admin filter bar */}
          <EmployeeFilterBar />

          <div className="grid grid-cols-3 gap-4 mb-4">
            <Card className="border-border/50"><CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-xl font-bold">{dossier.totalContrat.toLocaleString()} $</p>
            </CardContent></Card>
            <Card className="border-emerald-200"><CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Encaissé</p>
              <p className="text-xl font-bold text-emerald-600">{dossier.totalPaye.toLocaleString()} $</p>
            </CardContent></Card>
            <Card className="border-amber-200"><CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Restant</p>
              <p className="text-xl font-bold text-amber-600">{solde.toLocaleString()} $</p>
            </CardContent></Card>
          </div>

          {filteredPaiements.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              <DollarSign size={28} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">Aucun paiement{filterEmploye !== "tous" ? ` pour ${filterEmploye}` : " enregistré"}</p>
            </div>
          )}

          {filteredPaiements.map((p: any) => (
            <Card key={p.id} className="border-border/50">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center ${p.valide ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"}`}>
                    <DollarSign size={16} />
                  </div>
                  <div>
                    <p className="font-semibold">{p.montant.toLocaleString()} $</p>
                    <p className="text-xs text-muted-foreground">{p.note}</p>
                    {/* Employé qui a enregistré ce paiement */}
                    {p.employeNom && (
                      <p className="text-xs text-primary flex items-center gap-1 mt-0.5">
                        <User size={9} /> {p.employeNom}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium capitalize">{p.mode}</p>
                  {p.reference && <p className="text-xs text-muted-foreground">{p.reference}</p>}
                  <p className="text-xs text-muted-foreground">{new Date(p.date).toLocaleDateString("fr-FR")}</p>
                </div>
                <Badge variant={p.valide ? "default" : "secondary"} className={p.valide ? "bg-emerald-600" : ""}>
                  {p.valide ? "✓ Validé" : "En attente"}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ── Commentaires ── */}
      {activeTab === "commentaires" && (
        <div className="space-y-4">
          <div className="space-y-3">
            {comments.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-6">Aucun commentaire pour ce dossier.</p>
            )}
            {comments.map((c, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                  {c.auteur.split(" ").map((w: string) => w[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 bg-muted/40 rounded-xl p-3">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-medium">{c.auteur}</p>
                    <p className="text-xs text-muted-foreground">{new Date(c.date).toLocaleDateString("fr-FR")}</p>
                  </div>
                  <p className="text-sm text-foreground">{c.texte}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-3 pt-4 border-t border-border">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0">
              {CURRENT_USER.nom.split(" ").map(w => w[0]).join("").slice(0, 2)}
            </div>
            <div className="flex-1 space-y-2">
              <Textarea placeholder="Ajouter un commentaire..." rows={3} value={newComment} onChange={(e) => setNewComment(e.target.value)} />
              <Button size="sm" disabled={!newComment.trim()} className="gap-2" onClick={handleSendComment}>
                <MessageSquare size={14} /> Envoyer
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Documents ── */}
      {activeTab === "documents" && (
        <div className="space-y-3">
          <Button size="sm" variant="outline" className="gap-2">
            <Plus size={14} /> Ajouter document
          </Button>
          {(dossier.documents ?? []).length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">Aucun document joint.</p>
          )}
          {(dossier.documents ?? []).map((doc: any) => (
            <Card key={doc.nom} className="border-border/50">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Paperclip size={16} className="text-primary" />
                  <div>
                    <p className="text-sm font-medium">{doc.nom}</p>
                    <p className="text-xs text-muted-foreground">{new Date(doc.date).toLocaleDateString("fr-FR")}</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="text-xs">Télécharger</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}