export interface Employee {
  name: string;
  role: string;
  status: "Actif" | "Congé" | "Absent";
  initials: string;
  color: string;
  bg: string;
}

export interface Department {
  id: number;
  name: string;
  head: string;
  employees: number;
  objective: number;
  tasks: number;
  category: string;
  description: string;
  color: string;
  bg: string;
  staff: Employee[];
}

export const departments: Department[] = [
  {
    id: 1,
    name: "Commercial",
    head: "Youssef El Amrani",
    employees: 12,
    objective: 85,
    tasks: 24,
    category: "ventes",
    description: "Gestion commerciale, prospection et fidélisation clients",
    color: "#185FA5",
    bg: "#E6F1FB",
    staff: [
      { name: "Youssef El Amrani", role: "Responsable", status: "Actif", initials: "YE", color: "#185FA5", bg: "#E6F1FB" },
      { name: "Sara Idrissi", role: "Chargée de clientèle", status: "Actif", initials: "SI", color: "#0F6E56", bg: "#E1F5EE" },
      { name: "Mehdi Alaoui", role: "Commercial", status: "Congé", initials: "MA", color: "#854F0B", bg: "#FAEEDA" },
      { name: "Nadia Benali", role: "Assistante commerciale", status: "Actif", initials: "NB", color: "#185FA5", bg: "#E6F1FB" },
      { name: "Omar Fassi", role: "Commercial senior", status: "Actif", initials: "OF", color: "#0F6E56", bg: "#E1F5EE" },
      { name: "Hayat Lamrani", role: "Commerciale", status: "Actif", initials: "HL", color: "#72243E", bg: "#FBEAF0" },
      { name: "Tarik Berrada", role: "Commercial junior", status: "Actif", initials: "TB", color: "#185FA5", bg: "#E6F1FB" },
    ],
  },
  {
    id: 2,
    name: "Hajj & Omra",
    head: "Fatima Zahra Bennani",
    employees: 15,
    objective: 92,
    tasks: 38,
    category: "pelerinage",
    description: "Organisation et suivi des pèlerinages Hajj et Omra",
    color: "#3B6D11",
    bg: "#EAF3DE",
    staff: [
      { name: "Fatima Zahra Bennani", role: "Responsable", status: "Actif", initials: "FZ", color: "#3B6D11", bg: "#EAF3DE" },
      { name: "Rachid Qorchi", role: "Coordinateur Hajj", status: "Actif", initials: "RQ", color: "#185FA5", bg: "#E6F1FB" },
      { name: "Khadija Moussaoui", role: "Conseillère Omra", status: "Actif", initials: "KM", color: "#3B6D11", bg: "#EAF3DE" },
      { name: "Abdellah Jamai", role: "Agent terrain", status: "Actif", initials: "AJ", color: "#854F0B", bg: "#FAEEDA" },
      { name: "Houda Tlemcani", role: "Assistante", status: "Actif", initials: "HT", color: "#185FA5", bg: "#E6F1FB" },
      { name: "Hamza Bensouda", role: "Agent visa", status: "Congé", initials: "HB", color: "#A32D2D", bg: "#FCEBEB" },
      { name: "Sanaa Rifai", role: "Conseillère Hajj", status: "Actif", initials: "SR", color: "#3B6D11", bg: "#EAF3DE" },
    ],
  },
  {
    id: 3,
    name: "Tourisme",
    head: "Karim Tazi",
    employees: 10,
    objective: 78,
    tasks: 18,
    category: "tourisme",
    description: "Création et gestion des produits touristiques Maroc et international",
    color: "#993C1D",
    bg: "#FAECE7",
    staff: [
      { name: "Karim Tazi", role: "Responsable", status: "Actif", initials: "KT", color: "#993C1D", bg: "#FAECE7" },
      { name: "Leila Sefrioui", role: "Product Manager", status: "Actif", initials: "LS", color: "#185FA5", bg: "#E6F1FB" },
      { name: "Anas Benkirane", role: "Guide touristique", status: "Actif", initials: "AB", color: "#3B6D11", bg: "#EAF3DE" },
      { name: "Dounia Hajjam", role: "Assistante voyage", status: "Congé", initials: "DH", color: "#854F0B", bg: "#FAEEDA" },
      { name: "Yassine Tahiri", role: "Agent billetterie", status: "Actif", initials: "YT", color: "#993C1D", bg: "#FAECE7" },
    ],
  },
  {
    id: 4,
    name: "Marketing",
    head: "Amina Chraibi",
    employees: 6,
    objective: 70,
    tasks: 14,
    category: "marketing",
    description: "Communication digitale, branding et campagnes publicitaires",
    color: "#72243E",
    bg: "#FBEAF0",
    staff: [
      { name: "Amina Chraibi", role: "Responsable Marketing", status: "Actif", initials: "AC", color: "#72243E", bg: "#FBEAF0" },
      { name: "Ilias Zaki", role: "Social Media Manager", status: "Actif", initials: "IZ", color: "#185FA5", bg: "#E6F1FB" },
      { name: "Ghita Tahiri", role: "Designer graphique", status: "Actif", initials: "GT", color: "#3B6D11", bg: "#EAF3DE" },
      { name: "Rania Kettani", role: "Content Creator", status: "Absent", initials: "RK", color: "#72243E", bg: "#FBEAF0" },
    ],
  },
  {
    id: 5,
    name: "Finance & Comptabilité",
    head: "Hassan Ouazzani",
    employees: 5,
    objective: 88,
    tasks: 12,
    category: "finance",
    description: "Comptabilité, facturation et gestion financière",
    color: "#3C3489",
    bg: "#EEEDFE",
    staff: [
      { name: "Hassan Ouazzani", role: "Responsable Finance", status: "Actif", initials: "HO", color: "#3C3489", bg: "#EEEDFE" },
      { name: "Zineb Fassi Fihri", role: "Comptable", status: "Actif", initials: "ZF", color: "#185FA5", bg: "#E6F1FB" },
      { name: "Khalid Benmoussa", role: "Assistant comptable", status: "Actif", initials: "KB", color: "#3B6D11", bg: "#EAF3DE" },
    ],
  },
  {
    id: 6,
    name: "Ressources Humaines",
    head: "Soumia Benali",
    employees: 4,
    objective: 82,
    tasks: 10,
    category: "rh",
    description: "Recrutement, gestion du personnel et formation",
    color: "#085041",
    bg: "#E1F5EE",
    staff: [
      { name: "Soumia Benali", role: "DRH", status: "Actif", initials: "SB", color: "#085041", bg: "#E1F5EE" },
      { name: "Imane Berrada", role: "Chargée RH", status: "Actif", initials: "IB", color: "#185FA5", bg: "#E6F1FB" },
      { name: "Mouad Ouali", role: "Assistant RH", status: "Actif", initials: "MO", color: "#3B6D11", bg: "#EAF3DE" },
    ],
  },
];

export const categories = [
  { key: "all", label: "Tous" },
  { key: "ventes", label: "Commercial" },
  { key: "pelerinage", label: "Hajj & Omra" },
  { key: "tourisme", label: "Tourisme" },
  { key: "marketing", label: "Marketing" },
  { key: "finance", label: "Finance" },
  { key: "rh", label: "RH" },
];

export function getObjectiveVariant(obj: number): "high" | "mid" | "low" {
  if (obj >= 85) return "high";
  if (obj >= 75) return "mid";
  return "low";
}

export function getObjectiveLabel(obj: number): string {
  if (obj >= 85) return "Excellent";
  if (obj >= 75) return "Bon";
  return "À améliorer";
}

export function getObjectiveColor(obj: number): string {
  if (obj >= 85) return "#3B6D11";
  if (obj >= 75) return "#854F0B";
  return "#A32D2D";
}

export function getObjectiveBadgeStyle(obj: number): React.CSSProperties {
  if (obj >= 85) return { background: "#EAF3DE", color: "#3B6D11" };
  if (obj >= 75) return { background: "#FAEEDA", color: "#854F0B" };
  return { background: "#FCEBEB", color: "#A32D2D" };
}

export function getStatusStyle(status: Employee["status"]): React.CSSProperties {
  if (status === "Actif") return { background: "#EAF3DE", color: "#3B6D11" };
  if (status === "Congé") return { background: "#FAEEDA", color: "#854F0B" };
  return { background: "#FCEBEB", color: "#A32D2D" };
}