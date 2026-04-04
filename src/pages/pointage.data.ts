export type PointageStatus = "present" | "retard" | "absent" | "conge" | "telework";
export type JustifType = "medical" | "perso" | "transport" | "urgence" | "autre";

export interface PointageRecord {
  id: number;
  employeeId: number;
  employeeName: string;
  employeeInitials: string;
  department: string;
  date: string; // ISO
  checkIn?: string;  // "HH:MM"
  checkOut?: string;
  status: PointageStatus;
  justification?: string;
  justifType?: JustifType;
  justifApproved?: boolean | null; // null = pending
  gpsLat?: number;
  gpsLng?: number;
  workHours?: number; // computed
}

export const EMPLOYEES_POINTAGE = [
  { id: 1, name: "Fatima Zahra Alaoui",  initials: "FZ", department: "Opérations" },
  { id: 2, name: "Karim Tazi",           initials: "KT", department: "Commercial" },
  { id: 3, name: "Amina Chraibi",        initials: "AC", department: "Marketing" },
  { id: 4, name: "Nadia Berrada",        initials: "NB", department: "Comptabilité" },
  { id: 5, name: "Youssef El Amrani",    initials: "YE", department: "IT" },
  { id: 6, name: "Hassan Ouazzani",      initials: "HO", department: "Commercial" },
  { id: 7, name: "Salma Idrissi",        initials: "SI", department: "Opérations" },
  { id: 8, name: "Omar Benali",          initials: "OB", department: "RH" },
];

const today = new Date();
const fmt = (d: Date) => d.toISOString().split("T")[0];
const daysAgo = (n: number) => { const d = new Date(today); d.setDate(d.getDate() - n); return fmt(d); };

export const INITIAL_RECORDS: PointageRecord[] = [
  // Today
  { id: 1,  employeeId: 1, employeeName: "Fatima Zahra Alaoui", employeeInitials: "FZ", department: "Opérations",    date: fmt(today),  checkIn: "08:02", checkOut: "17:15", status: "present",  workHours: 9.2, gpsLat: 33.5731, gpsLng: -7.5898 },
  { id: 2,  employeeId: 2, employeeName: "Karim Tazi",          employeeInitials: "KT", department: "Commercial",    date: fmt(today),  checkIn: "09:22", status: "retard",   justification: "Embouteillages sur l'autoroute A1", justifType: "transport", justifApproved: null, gpsLat: 33.5731, gpsLng: -7.5898 },
  { id: 3,  employeeId: 3, employeeName: "Amina Chraibi",       employeeInitials: "AC", department: "Marketing",     date: fmt(today),  checkIn: "08:00", checkOut: "17:00", status: "present",  workHours: 9.0, gpsLat: 33.5731, gpsLng: -7.5898 },
  { id: 4,  employeeId: 4, employeeName: "Nadia Berrada",       employeeInitials: "NB", department: "Comptabilité",  date: fmt(today),  status: "absent",  justification: "Consultation médicale urgente", justifType: "medical", justifApproved: true },
  { id: 5,  employeeId: 5, employeeName: "Youssef El Amrani",   employeeInitials: "YE", department: "IT",            date: fmt(today),  checkIn: "08:30", status: "present",  gpsLat: 33.5731, gpsLng: -7.5898 },
  { id: 6,  employeeId: 6, employeeName: "Hassan Ouazzani",     employeeInitials: "HO", department: "Commercial",    date: fmt(today),  status: "conge",   justification: "Congé annuel approuvé", justifType: "perso", justifApproved: true },
  { id: 7,  employeeId: 7, employeeName: "Salma Idrissi",       employeeInitials: "SI", department: "Opérations",    date: fmt(today),  checkIn: "08:10", checkOut: "17:05", status: "present",  workHours: 8.9, gpsLat: 33.5731, gpsLng: -7.5898 },
  { id: 8,  employeeId: 8, employeeName: "Omar Benali",         employeeInitials: "OB", department: "RH",            date: fmt(today),  checkIn: "07:55", status: "present",  gpsLat: 33.5731, gpsLng: -7.5898 },
  // Yesterday
  { id: 9,  employeeId: 1, employeeName: "Fatima Zahra Alaoui", employeeInitials: "FZ", department: "Opérations",    date: daysAgo(1),  checkIn: "08:05", checkOut: "17:10", status: "present",  workHours: 9.1 },
  { id: 10, employeeId: 2, employeeName: "Karim Tazi",          employeeInitials: "KT", department: "Commercial",    date: daysAgo(1),  checkIn: "08:00", checkOut: "17:00", status: "present",  workHours: 9.0 },
  { id: 11, employeeId: 3, employeeName: "Amina Chraibi",       employeeInitials: "AC", department: "Marketing",     date: daysAgo(1),  status: "absent",  justifApproved: false },
  { id: 12, employeeId: 4, employeeName: "Nadia Berrada",       employeeInitials: "NB", department: "Comptabilité",  date: daysAgo(1),  checkIn: "08:20", checkOut: "17:30", status: "present",  workHours: 9.2 },
  { id: 13, employeeId: 5, employeeName: "Youssef El Amrani",   employeeInitials: "YE", department: "IT",            date: daysAgo(1),  checkIn: "09:45", status: "retard",   justifType: "autre", justifApproved: null },
  { id: 14, employeeId: 6, employeeName: "Hassan Ouazzani",     employeeInitials: "HO", department: "Commercial",    date: daysAgo(1),  checkIn: "08:00", checkOut: "17:00", status: "present",  workHours: 9.0 },
  { id: 15, employeeId: 7, employeeName: "Salma Idrissi",       employeeInitials: "SI", department: "Opérations",    date: daysAgo(1),  checkIn: "08:00", checkOut: "17:00", status: "present",  workHours: 9.0 },
  { id: 16, employeeId: 8, employeeName: "Omar Benali",         employeeInitials: "OB", department: "RH",            date: daysAgo(1),  checkIn: "08:00", checkOut: "17:00", status: "present",  workHours: 9.0 },
  // 2 days ago
  { id: 17, employeeId: 1, employeeName: "Fatima Zahra Alaoui", employeeInitials: "FZ", department: "Opérations",    date: daysAgo(2),  checkIn: "08:00", checkOut: "17:00", status: "present",  workHours: 9.0 },
  { id: 18, employeeId: 2, employeeName: "Karim Tazi",          employeeInitials: "KT", department: "Commercial",    date: daysAgo(2),  checkIn: "10:00", status: "retard",   justification: "Panne de voiture", justifType: "transport", justifApproved: true },
  { id: 19, employeeId: 5, employeeName: "Youssef El Amrani",   employeeInitials: "YE", department: "IT",            date: daysAgo(2),  checkIn: "08:00", checkOut: "17:00", status: "telework", workHours: 9.0 },
];

export const STATUS_CONFIG: Record<PointageStatus, { label: string; color: string; bg: string; dot: string }> = {
  present:  { label: "Présent",    color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200",  dot: "bg-emerald-500" },
  retard:   { label: "Retard",     color: "text-amber-700",   bg: "bg-amber-50 border-amber-200",      dot: "bg-amber-500" },
  absent:   { label: "Absent",     color: "text-red-700",     bg: "bg-red-50 border-red-200",          dot: "bg-red-500" },
  conge:    { label: "Congé",      color: "text-blue-700",    bg: "bg-blue-50 border-blue-200",        dot: "bg-blue-500" },
  telework: { label: "Télétravail",color: "text-violet-700",  bg: "bg-violet-50 border-violet-200",    dot: "bg-violet-500" },
};

export const JUSTIF_LABELS: Record<JustifType, string> = {
  medical:   "Médical",
  perso:     "Personnel",
  transport: "Transport",
  urgence:   "Urgence",
  autre:     "Autre",
};