// ============================================================
// CRM Types & Mock Data — Access Morocco ERP
// ============================================================

export type LeadStatus = "nouveau" | "contacte" | "en_cours" | "promesse" | "converti" | "perdu" | "follow_up_1" | "follow_up_2";
export type DossierStatus = "en_cours" | "confirme" | "annule" | "termine";
export type PaiementMode = "virement" | "cheque" | "especes" | "carte";
export type Departement = "mice" | "leisure" | "hajj_omra" | "outbound" | "marketing_sales";

// ---- LEADS ----
export interface Lead {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  societe?: string;
  pays: string;
  source: "foire" | "salon" | "referral" | "email" | "site_web" | "autre";
  statut: LeadStatus;
  notes: string;
  dateCreation: string;
  dateDerniereAction: string;
  assigneA: string; // feras ou autre employe
  interet: string; // "Marrakech 5 jours" etc
  nombrePax?: number;
  dateVoyageSouhaitee?: string;
  budget?: number;
  historique: { date: string; action: string; auteur: string; note?: string }[];
  rappels: { date: string; note: string; fait: boolean }[];
}

// ---- CLIENTS ----
export interface Client {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  societe?: string;
  pays: string;
  adresse?: string;
  dateCreation: string;
  leadId?: string;
  dossiers: string[]; // dossier IDs
  tags: string[];
  notes: string;
  statut: "actif" | "inactif" | "vip";
}

// ---- DOSSIERS ----
export interface Service {
  id: string;
  jour: string;
  description: string;
  unite: number;
  tarifUnitaire: number;
  nb: number;
  total: number;
  categorie: string;
  optionnel: boolean;
  inclus: boolean;
}

export interface Presentation {
  version: number;
  dateCreation: string;
  services: Service[];
  totalHT: number;
  notes: string;
  valideParClient: boolean;
  commentaireClient?: string;
}

export interface Paiement {
  id: string;
  date: string;
  montant: number;
  mode: PaiementMode;
  reference?: string;
  note?: string;
  valide: boolean;
}

export interface Dossier {
  id: string;
  reference: string;
  clientId: string;
  clientNom: string;
  departement: Departement;
  managerId: string;
  managerNom: string;
  employeId?: string;
  employeNom?: string;
  statut: DossierStatus;
  dateCreation: string;
  dateVoyage?: string;
  destination: string;
  nombrePax: number;
  presentations: Presentation[];
  paiements: Paiement[];
  totalContrat: number;
  totalPaye: number;
  commentaires: { auteur: string; date: string; texte: string }[];
  documents: { nom: string; url: string; date: string }[];
}

// ---- VOYAGES / PROGRAMMES ----
export interface ProgrammeJour {
  jour: number;
  titre: string;
  description: string;
  services: Omit<Service, "id">[];
}

export interface Voyage {
  id: string;
  titre: string;
  destination: string;
  duree: number;
  type: "groupe" | "individuel" | "hajj" | "omra" | "mice";
  description: string;
  programme: ProgrammeJour[];
  tarifBase: number;
  devise: string;
  actif: boolean;
}

// ============================================================
// MOCK DATA
// ============================================================

export const mockLeads: Lead[] = [
  {
    id: "L001",
    nom: "Dupont",
    prenom: "Marie",
    email: "marie.dupont@brightspot.fr",
    telephone: "+33 6 12 34 56 78",
    societe: "BrightSpot Events",
    pays: "France",
    source: "salon",
    statut: "converti",
    notes: "Contact rencontré au salon IFTM Paris. Très intéressée pour groupes MICE Marrakech.",
    dateCreation: "2025-10-15",
    dateDerniereAction: "2025-11-20",
    assigneA: "Feras Benali",
    interet: "Voyage groupe MICE Marrakech 5 jours 45 pax",
    nombrePax: 45,
    dateVoyageSouhaitee: "2026-04-27",
    budget: 200000,
    historique: [
      { date: "2025-10-15", action: "Création lead", auteur: "Adam Ziani", note: "Rencontré au salon IFTM" },
      { date: "2025-10-18", action: "Appel effectué", auteur: "Feras Benali", note: "Intéressée, demande programme détaillé" },
      { date: "2025-11-05", action: "Présentation V1 envoyée", auteur: "Feras Benali" },
      { date: "2025-11-20", action: "Converti en client", auteur: "Feras Benali", note: "Client accepte V3 du programme" },
    ],
    rappels: [
      { date: "2025-10-18", note: "Appel de suivi J+3", fait: true },
      { date: "2026-01-15", note: "Rappel 6 mois avant voyage pour confirmation finale", fait: false },
    ],
  },
  {
    id: "L002",
    nom: "Al-Rashidi",
    prenom: "Khalid",
    email: "khalid@alrashidi-group.ae",
    telephone: "+971 50 234 5678",
    societe: "Al Rashidi Group",
    pays: "Émirats Arabes Unis",
    source: "foire",
    statut: "en_cours",
    notes: "Rencontré à Arabian Travel Market. Groupe Omra + extension Marrakech.",
    dateCreation: "2025-11-02",
    dateDerniereAction: "2025-12-10",
    assigneA: "Feras Benali",
    interet: "Omra + extension tourisme Marrakech",
    nombrePax: 30,
    dateVoyageSouhaitee: "2026-03-01",
    budget: 120000,
    historique: [
      { date: "2025-11-02", action: "Création lead", auteur: "Adam Ziani" },
      { date: "2025-11-10", action: "Appel effectué", auteur: "Feras Benali", note: "Intéressé, demande devis" },
      { date: "2025-12-10", action: "Devis envoyé", auteur: "Feras Benali" },
    ],
    rappels: [
      { date: "2025-12-17", note: "Follow-up devis", fait: false },
    ],
  },
  {
    id: "L003",
    nom: "Schmidt",
    prenom: "Hans",
    email: "h.schmidt@munich-corp.de",
    telephone: "+49 89 1234 5678",
    societe: "Munich Corp",
    pays: "Allemagne",
    source: "email",
    statut: "follow_up_1",
    notes: "Email reçu via site web. Demande programme leisure famille.",
    dateCreation: "2025-12-01",
    dateDerniereAction: "2025-12-05",
    assigneA: "Feras Benali",
    interet: "Voyage famille leisure Marrakech",
    nombrePax: 6,
    dateVoyageSouhaitee: "2026-07-01",
    historique: [
      { date: "2025-12-01", action: "Création lead", auteur: "Feras Benali" },
      { date: "2025-12-05", action: "Appel - pas de réponse", auteur: "Feras Benali" },
    ],
    rappels: [
      { date: "2025-12-12", note: "Follow-up 1 - 2ème tentative", fait: false },
    ],
  },
  {
    id: "L004",
    nom: "Johnson",
    prenom: "Sarah",
    email: "sarah.j@corporate-uk.co.uk",
    telephone: "+44 20 7946 0958",
    societe: "UK Corporate Travel",
    pays: "Royaume-Uni",
    source: "referral",
    statut: "promesse",
    notes: "Référé par BrightSpot. Voyage incentive 100 pax.",
    dateCreation: "2025-12-05",
    dateDerniereAction: "2025-12-20",
    assigneA: "Feras Benali",
    interet: "Voyage incentive MICE Marrakech + Agafay",
    nombrePax: 100,
    dateVoyageSouhaitee: "2026-06-15",
    budget: 350000,
    historique: [
      { date: "2025-12-05", action: "Création lead", auteur: "Adam Ziani" },
      { date: "2025-12-10", action: "Appel effectué", auteur: "Feras Benali", note: "Très intéressée" },
      { date: "2025-12-20", action: "Réunion Zoom", auteur: "Feras Benali", note: "Accord de principe, attend V1" },
    ],
    rappels: [
      { date: "2026-01-05", note: "Envoyer V1 du programme", fait: false },
    ],
  },
  {
    id: "L005",
    nom: "Tanaka",
    prenom: "Yuki",
    email: "y.tanaka@jp-travel.jp",
    telephone: "+81 3 1234 5678",
    societe: "JP Travel Agency",
    pays: "Japon",
    source: "salon",
    statut: "perdu",
    notes: "Intéressé mais a choisi un concurrent pour budget.",
    dateCreation: "2025-09-10",
    dateDerniereAction: "2025-10-30",
    assigneA: "Feras Benali",
    interet: "Groupe tourisme culturel 25 pax",
    nombrePax: 25,
    historique: [
      { date: "2025-09-10", action: "Création lead", auteur: "Adam Ziani" },
      { date: "2025-09-15", action: "Appel effectué", auteur: "Feras Benali" },
      { date: "2025-10-30", action: "Lead perdu", auteur: "Feras Benali", note: "Choisi concurrent moins cher" },
    ],
    rappels: [],
  },
];

export const mockClients: Client[] = [
  {
    id: "C001",
    nom: "Dupont",
    prenom: "Marie",
    email: "marie.dupont@brightspot.fr",
    telephone: "+33 6 12 34 56 78",
    societe: "BrightSpot Events",
    pays: "France",
    adresse: "15 Rue de la Paix, 75001 Paris",
    dateCreation: "2025-11-20",
    leadId: "L001",
    dossiers: ["D001"],
    tags: ["MICE", "VIP", "Groupe"],
    notes: "Cliente VIP - groupes récurrents. Toujours paiement virement.",
    statut: "vip",
  },
  {
    id: "C002",
    nom: "Johnson",
    prenom: "Sarah",
    email: "sarah.j@corporate-uk.co.uk",
    telephone: "+44 20 7946 0958",
    societe: "UK Corporate Travel",
    pays: "Royaume-Uni",
    dateCreation: "2025-12-20",
    leadId: "L004",
    dossiers: [],
    tags: ["Incentive", "MICE"],
    notes: "Nouveau client référé par BrightSpot.",
    statut: "actif",
  },
];

export const mockDossiers: Dossier[] = [
  {
    id: "D001",
    reference: "GRP BS V15",
    clientId: "C001",
    clientNom: "BrightSpot Events - Marie Dupont",
    departement: "mice",
    managerId: "MGR001",
    managerNom: "Rachid Amrani",
    employeId: "EMP001",
    employeNom: "Youssef El Amrani",
    statut: "confirme",
    dateCreation: "2025-11-25",
    dateVoyage: "2026-04-27",
    destination: "Marrakech + Agafay",
    nombrePax: 45,
    presentations: [
      {
        version: 1,
        dateCreation: "2025-11-28",
        services: [],
        totalHT: 185000,
        notes: "Première version - programme standard",
        valideParClient: false,
        commentaireClient: "Ajouter gala dinner à Agafay + hot air balloon",
      },
      {
        version: 2,
        dateCreation: "2025-12-05",
        services: [],
        totalHT: 195000,
        notes: "V2 avec gala dinner Agafay",
        valideParClient: false,
        commentaireClient: "OK sur le fond, négocier le prix du hot air balloon",
      },
      {
        version: 3,
        dateCreation: "2025-12-15",
        services: [
          // Day 1
          { id: "s001", jour: "Jour 1 - 27 Avril", description: "English speaking guide", unite: 2, tarifUnitaire: 150, nb: 1, total: 300, categorie: "Guide", optionnel: false, inclus: true },
          { id: "s002", jour: "Jour 1 - 27 Avril", description: "Hospitality desk - Access Morocco", unite: 1, tarifUnitaire: 170, nb: 1, total: 170, categorie: "Staff", optionnel: false, inclus: true },
          { id: "s003", jour: "Jour 1 - 27 Avril", description: "46 seater deluxe bus - Transfer APT → Ville", unite: 1, tarifUnitaire: 400, nb: 1, total: 400, categorie: "Transport", optionnel: false, inclus: true },
          { id: "s004", jour: "Jour 1 - 27 Avril", description: "Water in the vehicle", unite: 45, tarifUnitaire: 1, nb: 1, total: 45, categorie: "F&B", optionnel: false, inclus: true },
          { id: "s005", jour: "Jour 1 - 27 Avril", description: "Pop-up Shop Setup - Gifting", unite: 1, tarifUnitaire: 1450, nb: 1, total: 1450, categorie: "Activité", optionnel: false, inclus: true },
          // Day 2
          { id: "s010", jour: "Jour 2 - 28 Avril", description: "English speaking guide x4", unite: 4, tarifUnitaire: 150, nb: 1, total: 600, categorie: "Guide", optionnel: false, inclus: true },
          { id: "s011", jour: "Jour 2 - 28 Avril", description: "Sound & lighting system (Basic)", unite: 1, tarifUnitaire: 9400, nb: 1, total: 9400, categorie: "AV", optionnel: false, inclus: true },
          { id: "s012", jour: "Jour 2 - 28 Avril", description: "DJ", unite: 1, tarifUnitaire: 2170, nb: 1, total: 2170, categorie: "Entertainment", optionnel: false, inclus: true },
          // Day 4
          { id: "s020", jour: "Jour 4 - 30 Avril", description: "Gala Dinner - 1001 candles setup", unite: 1, tarifUnitaire: 9500, nb: 1, total: 9500, categorie: "Événement", optionnel: false, inclus: true },
          { id: "s021", jour: "Jour 4 - 30 Avril", description: "Open bar 2hrs per pax", unite: 43, tarifUnitaire: 155, nb: 1, total: 6665, categorie: "F&B", optionnel: false, inclus: true },
          { id: "s022", jour: "Jour 4 - 30 Avril", description: "Hot air balloon + Berber breakfast", unite: 28, tarifUnitaire: 250, nb: 1, total: 7000, categorie: "Activité", optionnel: false, inclus: true },
        ],
        totalHT: 199903,
        notes: "Version finale validée - programme complet 6 jours",
        valideParClient: true,
      },
    ],
    paiements: [
      { id: "P001", date: "2025-12-20", montant: 32230, mode: "virement", reference: "VIR-2025-1220", note: "1er acompte 16%", valide: true },
      { id: "P002", date: "2026-02-15", montant: 66014, mode: "virement", reference: "VIR-2026-0215", note: "2ème acompte 33%", valide: true },
    ],
    totalContrat: 199903,
    totalPaye: 98244,
    commentaires: [
      { auteur: "Youssef El Amrani", date: "2025-12-16", texte: "Programme V3 validé par la cliente. Attente du 1er acompte." },
      { auteur: "Rachid Amrani", date: "2025-12-22", texte: "1er acompte reçu et validé. Dossier confirmé." },
    ],
    documents: [
      { nom: "Grp_BS_V15_BrightSpot.xlsx", url: "#", date: "2025-12-15" },
      { nom: "Contrat_D001_BrightSpot.pdf", url: "#", date: "2025-12-18" },
    ],
  },
];

export const mockVoyages: Voyage[] = [
  {
    id: "V001",
    titre: "Marrakech Prestige 6 Jours",
    destination: "Marrakech + Agafay",
    duree: 6,
    type: "mice",
    description: "Programme MICE premium incluant ville impériale, désert Agafay, activités culturelles et galas.",
    programme: [],
    tarifBase: 4500,
    devise: "USD",
    actif: true,
  },
  {
    id: "V002",
    titre: "Omra Ramadan Premium",
    destination: "Médine + La Mecque",
    duree: 15,
    type: "omra",
    description: "Package Omra complet pendant le Ramadan. Hôtels 5* proximité Haram.",
    programme: [],
    tarifBase: 3200,
    devise: "USD",
    actif: true,
  },
  {
    id: "V003",
    titre: "Marrakech Leisure Family",
    destination: "Marrakech",
    duree: 5,
    type: "individuel",
    description: "Séjour famille découverte de Marrakech, musées, jardins et activités.",
    programme: [],
    tarifBase: 1800,
    devise: "USD",
    actif: true,
  },
];

// Kanban columns for leads pipeline
export const LEAD_COLUMNS: { key: LeadStatus; label: string; color: string }[] = [
  { key: "nouveau", label: "Nouveau", color: "#6366f1" },
  { key: "contacte", label: "Contacté", color: "#f59e0b" },
  { key: "follow_up_1", label: "Follow-up 1", color: "#f97316" },
  { key: "follow_up_2", label: "Follow-up 2", color: "#ef4444" },
  { key: "en_cours", label: "En cours", color: "#10b981" },
  { key: "promesse", label: "Promesse", color: "#8b5cf6" },
  { key: "converti", label: "Converti ✓", color: "#059669" },
  { key: "perdu", label: "Perdu", color: "#6b7280" },
];

export const DEPARTEMENTS_LABELS: Record<Departement, string> = {
  mice: "MICE",
  leisure: "Leisure",
  hajj_omra: "Hajj & Omra",
  outbound: "Outbound",
  marketing_sales: "Marketing & Sales",
};