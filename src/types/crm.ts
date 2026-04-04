export type LeadStatus = "new" | "followup1" | "followup2" | "followup3" | "in_progress" | "potential" | "lost" | "converted";
export type LeadSource = "Foire" | "Website" | "Ads" | "Referral" | "Cold Call" | "Email" | "Social Media";
export type InterestType = "Leisure" | "MICE";
export type DossierStatus = "new" | "assigned" | "in_progress" | "waiting_client" | "confirmed" | "lost";
export type PresentationStatus = "draft" | "sent" | "accepted" | "rejected";
export type DossierType = "Couple" | "Group" | "Corporate" | "Family" | "Individual";
export type ServiceCategory = "Hotel" | "Transport" | "Vol" | "Activité" | "Guide" | "Visa" | "Assurance" | "Restaurant" | "Excursion" | "Autre";

export interface Lead {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  company?: string;
  source: LeadSource;
  interest: InterestType;
  status: LeadStatus;
  assignedTo: string;
  assignedToName: string;
  notes: string;
  activities: Activity[];
  createdAt: string;
  updatedAt: string;
  nextFollowUp?: string;
}

export interface Activity {
  id: string;
  type: "call" | "email" | "note" | "meeting" | "whatsapp" | "status_change";
  description: string;
  date: string;
  by: string;
}

export interface CRMDossier {
  id: string;
  reference: string;
  leadId?: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientCompany?: string;
  type: DossierType;
  department: "MICE" | "Leisure";
  budget: number;
  dateStart: string;
  dateEnd: string;
  status: DossierStatus;
  assignedBy?: string;
  assignedTo?: string;
  assignedToName?: string;
  notes: string;
  presentations: Presentation[];
  activities: Activity[];
  createdAt: string;
}

export interface Presentation {
  id: string;
  version: number;
  dossierId: string;
  services: PresentationService[];
  status: PresentationStatus;
  totalCost: number;
  totalSelling: number;
  margin: number;
  createdAt: string;
  sentAt?: string;
}

export interface PresentationService {
  id: string;
  serviceId: string;
  serviceName: string;
  category: ServiceCategory;
  quantity: number;
  unitCostPrice: number;
  unitSellingPrice: number;
  discount: number;
  marginPercent: number;
  totalCost: number;
  totalSelling: number;
}

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  basePrice: number;
  sellingPrice: number;
  description?: string;
  supplier?: string;
  active: boolean;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  role: "agent" | "manager";
  department: "MICE" | "Leisure" | "Sales";
  leadsCount: number;
  convertedCount: number;
}

export const LEAD_STATUS_CONFIG: Record<LeadStatus, { label: string; color: string }> = {
  new: { label: "Nouveau", color: "bg-blue-100 text-blue-800" },
  followup1: { label: "Relance 1", color: "bg-yellow-100 text-yellow-800" },
  followup2: { label: "Relance 2", color: "bg-orange-100 text-orange-800" },
  followup3: { label: "Relance 3", color: "bg-red-100 text-red-800" },
  in_progress: { label: "En cours", color: "bg-purple-100 text-purple-800" },
  potential: { label: "Potentiel", color: "bg-cyan-100 text-cyan-800" },
  lost: { label: "Perdu", color: "bg-gray-100 text-gray-800" },
  converted: { label: "Converti", color: "bg-green-100 text-green-800" },
};

export const DOSSIER_STATUS_CONFIG: Record<DossierStatus, { label: string; color: string }> = {
  new: { label: "Nouveau", color: "bg-blue-100 text-blue-800" },
  assigned: { label: "Assigné", color: "bg-purple-100 text-purple-800" },
  in_progress: { label: "En cours", color: "bg-yellow-100 text-yellow-800" },
  waiting_client: { label: "Attente client", color: "bg-orange-100 text-orange-800" },
  confirmed: { label: "Confirmé", color: "bg-green-100 text-green-800" },
  lost: { label: "Perdu", color: "bg-gray-100 text-gray-800" },
};
