export type MeetingStatus = "today" | "upcoming" | "past";
export type InviteStatus = "pending" | "accepted" | "declined";

export interface MeetingParticipant {
  id: number;
  name: string;
  initials: string;
  department: string;
  status: InviteStatus;
  declineReason?: string;
}

export interface Meeting {
  id: number;
  title: string;
  date: string; // ISO
  timeStart: string; // "HH:MM"
  timeEnd: string;
  department: string;
  objective: string;
  location: string;
  notes?: string;
  participants: MeetingParticipant[];
  createdBy: string;
}

export const ALL_EMPLOYEES = [
  { id: 1,  name: "Fatima Zahra Alaoui",  initials: "FZ", department: "Opérations" },
  { id: 2,  name: "Karim Tazi",           initials: "KT", department: "Commercial" },
  { id: 3,  name: "Amina Chraibi",        initials: "AC", department: "Marketing" },
  { id: 4,  name: "Nadia Berrada",        initials: "NB", department: "Comptabilité" },
  { id: 5,  name: "Youssef El Amrani",    initials: "YE", department: "IT" },
  { id: 6,  name: "Hassan Ouazzani",      initials: "HO", department: "Commercial" },
  { id: 7,  name: "Salma Idrissi",        initials: "SI", department: "Opérations" },
  { id: 8,  name: "Omar Benali",          initials: "OB", department: "RH" },
  { id: 9,  name: "Sara El Idrissi",      initials: "SE", department: "Hajj & Omra" },
  { id: 10, name: "Rachid Benjelloun",    initials: "RB", department: "Tourisme" },
];

export const DEPARTMENTS = ["Opérations", "Commercial", "Marketing", "Comptabilité", "IT", "RH", "Hajj & Omra", "Tourisme", "Direction"];

const today = new Date();
const fmt = (d: Date) => d.toISOString().split("T")[0];
const daysFromNow = (n: number) => { const d = new Date(today); d.setDate(d.getDate() + n); return fmt(d); };
const daysAgo = (n: number) => { const d = new Date(today); d.setDate(d.getDate() - n); return fmt(d); };

export const INITIAL_MEETINGS: Meeting[] = [
  {
    id: 1,
    title: "Réunion hebdomadaire — Département Hajj & Omra",
    date: fmt(today),
    timeStart: "09:00", timeEnd: "10:00",
    department: "Hajj & Omra",
    objective: "Faire le point sur les dossiers en cours et planifier la semaine",
    location: "Salle de conférence A",
    notes: "Apporter les rapports de la semaine précédente",
    createdBy: "Admin",
    participants: [
      { id: 1, name: "Fatima Zahra Alaoui", initials: "FZ", department: "Opérations", status: "accepted" },
      { id: 4, name: "Nadia Berrada",        initials: "NB", department: "Comptabilité", status: "pending" },
      { id: 9, name: "Sara El Idrissi",      initials: "SE", department: "Hajj & Omra", status: "accepted" },
    ],
  },
  {
    id: 2,
    title: "Revue objectifs Q1 — Direction",
    date: daysFromNow(2),
    timeStart: "14:00", timeEnd: "16:00",
    department: "Direction",
    objective: "Analyse des résultats Q1 et définition des objectifs Q2",
    location: "Salle Direction",
    createdBy: "Admin",
    participants: [
      { id: 5,  name: "Youssef El Amrani", initials: "YE", department: "IT",         status: "accepted" },
      { id: 6,  name: "Hassan Ouazzani",   initials: "HO", department: "Commercial", status: "declined", declineReason: "Déplacement professionnel à Marrakech" },
      { id: 2,  name: "Karim Tazi",        initials: "KT", department: "Commercial", status: "pending" },
      { id: 3,  name: "Amina Chraibi",     initials: "AC", department: "Marketing",  status: "accepted" },
    ],
  },
  {
    id: 3,
    title: "Point campagne Omra Ramadan",
    date: daysFromNow(3),
    timeStart: "10:00", timeEnd: "11:00",
    department: "Marketing",
    objective: "Présenter les résultats de la campagne et ajuster la stratégie",
    location: "Salle Marketing",
    createdBy: "Admin",
    participants: [
      { id: 3, name: "Amina Chraibi",      initials: "AC", department: "Marketing",  status: "pending" },
      { id: 1, name: "Fatima Zahra Alaoui",initials: "FZ", department: "Opérations", status: "pending" },
    ],
  },
  {
    id: 4,
    title: "Formation logiciel réservation",
    date: daysAgo(3),
    timeStart: "09:00", timeEnd: "12:00",
    department: "Tourisme",
    objective: "Formation sur le nouveau système de réservation en ligne",
    location: "Salle IT",
    createdBy: "Admin",
    participants: [
      { id: 4,  name: "Nadia Berrada",  initials: "NB", department: "Comptabilité", status: "accepted" },
      { id: 2,  name: "Karim Tazi",     initials: "KT", department: "Commercial",   status: "accepted" },
      { id: 9,  name: "Sara El Idrissi",initials: "SE", department: "Hajj & Omra",  status: "declined", declineReason: "Congé maladie" },
      { id: 10, name: "Rachid Benjelloun", initials: "RB", department: "Tourisme",  status: "accepted" },
    ],
  },
];

export function getMeetingStatus(date: string): MeetingStatus {
  const today = new Date(); today.setHours(0,0,0,0);
  const d = new Date(date); d.setHours(0,0,0,0);
  if (d.getTime() === today.getTime()) return "today";
  if (d > today) return "upcoming";
  return "past";
}