import { Lead, CRMDossier, Service, Agent } from "@/types/crm";

export const mockAgents: Agent[] = [
  { id: "a1", name: "Sara Benali", email: "sara@accessmorocco.ma", role: "agent", department: "Sales", leadsCount: 34, convertedCount: 12 },
  { id: "a2", name: "Karim Tazi", email: "karim@accessmorocco.ma", role: "agent", department: "Sales", leadsCount: 28, convertedCount: 9 },
  { id: "a3", name: "Fatima Zohra", email: "fatima@accessmorocco.ma", role: "agent", department: "Sales", leadsCount: 41, convertedCount: 15 },
  { id: "a4", name: "Ahmed Mansouri", email: "ahmed@accessmorocco.ma", role: "manager", department: "MICE", leadsCount: 0, convertedCount: 0 },
  { id: "a5", name: "Nadia El Fassi", email: "nadia@accessmorocco.ma", role: "manager", department: "Leisure", leadsCount: 0, convertedCount: 0 },
];

export const mockLeads: Lead[] = [
  {
    id: "L001", fullName: "Jean-Pierre Dupont", email: "jp.dupont@corp.fr", phone: "+33 6 12 34 56 78",
    company: "TechCorp France", source: "Foire", interest: "MICE", status: "new",
    assignedTo: "a1", assignedToName: "Sara Benali", notes: "Rencontré au salon IFTM Top Resa",
    activities: [
      { id: "act1", type: "note", description: "Lead capturé au salon IFTM", date: "2026-04-01", by: "Sara Benali" },
    ],
    createdAt: "2026-04-01", updatedAt: "2026-04-01", nextFollowUp: "2026-04-05",
  },
  {
    id: "L002", fullName: "Maria Garcia", email: "maria.g@gmail.com", phone: "+34 612 345 678",
    source: "Website", interest: "Leisure", status: "followup1",
    assignedTo: "a2", assignedToName: "Karim Tazi", notes: "Intéressée par circuit Maroc 10 jours",
    activities: [
      { id: "act2", type: "email", description: "Email de bienvenue envoyé", date: "2026-03-28", by: "Karim Tazi" },
      { id: "act3", type: "call", description: "Appel 1 - Intéressée, demande devis", date: "2026-03-30", by: "Karim Tazi" },
    ],
    createdAt: "2026-03-28", updatedAt: "2026-03-30", nextFollowUp: "2026-04-04",
  },
  {
    id: "L003", fullName: "Omar Khalil", email: "omar.k@enterprise.ae", phone: "+971 50 123 4567",
    company: "Gulf Events LLC", source: "Referral", interest: "MICE", status: "in_progress",
    assignedTo: "a3", assignedToName: "Fatima Zohra", notes: "Événement corporate 200 personnes à Marrakech",
    activities: [
      { id: "act4", type: "call", description: "Premier contact - besoin confirmé", date: "2026-03-15", by: "Fatima Zohra" },
      { id: "act5", type: "email", description: "Brochure MICE envoyée", date: "2026-03-16", by: "Fatima Zohra" },
      { id: "act6", type: "meeting", description: "Visio de qualification - budget 500K MAD", date: "2026-03-20", by: "Fatima Zohra" },
    ],
    createdAt: "2026-03-15", updatedAt: "2026-03-20",
  },
  {
    id: "L004", fullName: "Sophie Martin", email: "sophie.m@yahoo.fr", phone: "+33 7 89 01 23 45",
    source: "Ads", interest: "Leisure", status: "potential",
    assignedTo: "a1", assignedToName: "Sara Benali", notes: "Voyage en couple, budget 30K MAD",
    activities: [
      { id: "act7", type: "call", description: "Appel 1 - Très intéressée", date: "2026-03-25", by: "Sara Benali" },
      { id: "act8", type: "email", description: "Proposition envoyée", date: "2026-03-26", by: "Sara Benali" },
      { id: "act9", type: "call", description: "Appel 2 - Demande modifications", date: "2026-03-28", by: "Sara Benali" },
    ],
    createdAt: "2026-03-24", updatedAt: "2026-03-28",
  },
  {
    id: "L005", fullName: "Klaus Weber", email: "k.weber@auto.de", phone: "+49 170 123 4567",
    company: "AutoTech GmbH", source: "Cold Call", interest: "MICE", status: "followup2",
    assignedTo: "a2", assignedToName: "Karim Tazi", notes: "Séminaire équipe 50 personnes",
    activities: [
      { id: "act10", type: "call", description: "Cold call - intéressé mais pas disponible", date: "2026-03-20", by: "Karim Tazi" },
      { id: "act11", type: "call", description: "Rappel - demande plus d'infos", date: "2026-03-25", by: "Karim Tazi" },
    ],
    createdAt: "2026-03-20", updatedAt: "2026-03-25", nextFollowUp: "2026-04-06",
  },
  {
    id: "L006", fullName: "Amina Berrada", email: "amina@berrada.ma", phone: "+212 661 234 567",
    source: "Social Media", interest: "Leisure", status: "converted",
    assignedTo: "a3", assignedToName: "Fatima Zohra", notes: "Circuit familial converti en dossier",
    activities: [
      { id: "act12", type: "call", description: "Contact initial", date: "2026-03-10", by: "Fatima Zohra" },
      { id: "act13", type: "email", description: "Devis envoyé", date: "2026-03-12", by: "Fatima Zohra" },
      { id: "act14", type: "status_change", description: "Lead converti en dossier DSR-2026-042", date: "2026-03-18", by: "Fatima Zohra" },
    ],
    createdAt: "2026-03-10", updatedAt: "2026-03-18",
  },
  {
    id: "L007", fullName: "David Chen", email: "d.chen@global.com", phone: "+852 9123 4567",
    company: "Global Trading HK", source: "Website", interest: "MICE", status: "lost",
    assignedTo: "a1", assignedToName: "Sara Benali", notes: "Budget insuffisant",
    activities: [
      { id: "act15", type: "call", description: "Appel 1 - Besoin identifié", date: "2026-02-15", by: "Sara Benali" },
      { id: "act16", type: "call", description: "Appel 2 - Hésitant", date: "2026-02-20", by: "Sara Benali" },
      { id: "act17", type: "call", description: "Appel 3 - Pas de budget", date: "2026-02-28", by: "Sara Benali" },
      { id: "act18", type: "status_change", description: "Marqué comme perdu - budget", date: "2026-03-01", by: "Sara Benali" },
    ],
    createdAt: "2026-02-15", updatedAt: "2026-03-01",
  },
  {
    id: "L008", fullName: "Isabelle Moreau", email: "i.moreau@luxe.fr", phone: "+33 6 45 67 89 01",
    source: "Referral", interest: "Leisure", status: "followup3",
    assignedTo: "a2", assignedToName: "Karim Tazi", notes: "Lune de miel luxe",
    activities: [
      { id: "act19", type: "call", description: "Appel 1", date: "2026-03-28", by: "Karim Tazi" },
      { id: "act20", type: "call", description: "Appel 2 - Pas de réponse", date: "2026-04-01", by: "Karim Tazi" },
      { id: "act21", type: "call", description: "Appel 3 - Messagerie", date: "2026-04-03", by: "Karim Tazi" },
    ],
    createdAt: "2026-03-28", updatedAt: "2026-04-03", nextFollowUp: "2026-04-07",
  },
];

export const mockServices: Service[] = [
  { id: "s1", name: "Riad Luxe Marrakech", category: "Hotel", basePrice: 1200, sellingPrice: 1800, description: "Nuit en suite, petit-déjeuner inclus", supplier: "Riad Palace", active: true },
  { id: "s2", name: "Hotel 5* Casablanca", category: "Hotel", basePrice: 2000, sellingPrice: 2800, description: "Chambre deluxe, all inclusive", supplier: "Hyatt Regency", active: true },
  { id: "s3", name: "Transfer Aéroport Marrakech", category: "Transport", basePrice: 250, sellingPrice: 400, description: "Mercedes Vito, A/R", supplier: "Atlas Transfer", active: true },
  { id: "s4", name: "Vol Paris-Marrakech A/R", category: "Vol", basePrice: 3500, sellingPrice: 4200, description: "RAM, classe éco", supplier: "Royal Air Maroc", active: true },
  { id: "s5", name: "Excursion Atlas", category: "Excursion", basePrice: 400, sellingPrice: 650, description: "Journée complète, déjeuner inclus", supplier: "Atlas Adventures", active: true },
  { id: "s6", name: "Guide Privé Marrakech", category: "Guide", basePrice: 600, sellingPrice: 900, description: "Guide francophone, journée", supplier: "Interne", active: true },
  { id: "s7", name: "Visa Processing", category: "Visa", basePrice: 300, sellingPrice: 500, description: "Traitement visa express", supplier: "Interne", active: true },
  { id: "s8", name: "Assurance Voyage Premium", category: "Assurance", basePrice: 200, sellingPrice: 350, description: "Couverture complète", supplier: "AXA Assurance", active: true },
  { id: "s9", name: "Dîner Gala Marrakech", category: "Restaurant", basePrice: 500, sellingPrice: 800, description: "Menu 5 plats, spectacle", supplier: "Le Comptoir Darna", active: true },
  { id: "s10", name: "Quad Désert Agafay", category: "Activité", basePrice: 300, sellingPrice: 500, description: "2h quad + thé", supplier: "Desert Fun", active: true },
  { id: "s11", name: "Hotel 4* Fès", category: "Hotel", basePrice: 900, sellingPrice: 1400, description: "Chambre standard, B&B", supplier: "Sofitel Fès", active: true },
  { id: "s12", name: "Bus Grand Tourisme", category: "Transport", basePrice: 3000, sellingPrice: 4500, description: "Bus 50 places, journée", supplier: "CTM Pro", active: true },
];

export const mockCRMDossiers: CRMDossier[] = [
  {
    id: "CRM-D001", reference: "GRPMS-2026-001", leadId: "L003",
    clientName: "Omar Khalil", clientEmail: "omar.k@enterprise.ae", clientPhone: "+971 50 123 4567",
    clientCompany: "Gulf Events LLC", type: "Corporate", department: "MICE",
    budget: 500000, dateStart: "2026-06-15", dateEnd: "2026-06-20",
    status: "in_progress", assignedBy: "Ahmed Mansouri", assignedTo: "a3", assignedToName: "Fatima Zohra",
    notes: "Événement corporate 200 pax, Marrakech",
    presentations: [
      {
        id: "p1", version: 1, dossierId: "CRM-D001", status: "rejected",
        services: [
          { id: "ps1", serviceId: "s2", serviceName: "Hotel 5* Casablanca", category: "Hotel", quantity: 200, unitCostPrice: 2000, unitSellingPrice: 2800, discount: 0, marginPercent: 40, totalCost: 400000, totalSelling: 560000 },
        ],
        totalCost: 400000, totalSelling: 560000, margin: 160000, createdAt: "2026-03-22", sentAt: "2026-03-23",
      },
      {
        id: "p2", version: 2, dossierId: "CRM-D001", status: "sent",
        services: [
          { id: "ps2", serviceId: "s1", serviceName: "Riad Luxe Marrakech", category: "Hotel", quantity: 100, unitCostPrice: 1200, unitSellingPrice: 1800, discount: 5, marginPercent: 45, totalCost: 120000, totalSelling: 171000 },
          { id: "ps3", serviceId: "s12", serviceName: "Bus Grand Tourisme", category: "Transport", quantity: 4, unitCostPrice: 3000, unitSellingPrice: 4500, discount: 0, marginPercent: 50, totalCost: 12000, totalSelling: 18000 },
          { id: "ps4", serviceId: "s9", serviceName: "Dîner Gala Marrakech", category: "Restaurant", quantity: 200, unitCostPrice: 500, unitSellingPrice: 800, discount: 10, marginPercent: 44, totalCost: 100000, totalSelling: 144000 },
        ],
        totalCost: 232000, totalSelling: 333000, margin: 101000, createdAt: "2026-03-28", sentAt: "2026-03-29",
      },
    ],
    activities: [
      { id: "da1", type: "status_change", description: "Dossier créé depuis lead L003", date: "2026-03-21", by: "Fatima Zohra" },
      { id: "da2", type: "note", description: "Assigné au département MICE", date: "2026-03-21", by: "Ahmed Mansouri" },
      { id: "da3", type: "email", description: "Présentation v1 envoyée", date: "2026-03-23", by: "Fatima Zohra" },
      { id: "da4", type: "call", description: "Client demande version révisée - budget réduit", date: "2026-03-25", by: "Fatima Zohra" },
      { id: "da5", type: "email", description: "Présentation v2 envoyée", date: "2026-03-29", by: "Fatima Zohra" },
    ],
    createdAt: "2026-03-21",
  },
  {
    id: "CRM-D002", reference: "GRPMS-2026-002", leadId: "L006",
    clientName: "Amina Berrada", clientEmail: "amina@berrada.ma", clientPhone: "+212 661 234 567",
    type: "Family", department: "Leisure",
    budget: 45000, dateStart: "2026-07-10", dateEnd: "2026-07-17",
    status: "confirmed", assignedBy: "Nadia El Fassi", assignedTo: "a2", assignedToName: "Karim Tazi",
    notes: "Circuit familial Imperial Cities 7 jours",
    presentations: [
      {
        id: "p3", version: 1, dossierId: "CRM-D002", status: "accepted",
        services: [
          { id: "ps5", serviceId: "s1", serviceName: "Riad Luxe Marrakech", category: "Hotel", quantity: 3, unitCostPrice: 1200, unitSellingPrice: 1800, discount: 0, marginPercent: 50, totalCost: 3600, totalSelling: 5400 },
          { id: "ps6", serviceId: "s11", serviceName: "Hotel 4* Fès", category: "Hotel", quantity: 2, unitCostPrice: 900, unitSellingPrice: 1400, discount: 0, marginPercent: 55, totalCost: 1800, totalSelling: 2800 },
          { id: "ps7", serviceId: "s4", serviceName: "Vol Paris-Marrakech A/R", category: "Vol", quantity: 4, unitCostPrice: 3500, unitSellingPrice: 4200, discount: 0, marginPercent: 20, totalCost: 14000, totalSelling: 16800 },
          { id: "ps8", serviceId: "s5", serviceName: "Excursion Atlas", category: "Excursion", quantity: 4, unitCostPrice: 400, unitSellingPrice: 650, discount: 0, marginPercent: 62, totalCost: 1600, totalSelling: 2600 },
          { id: "ps9", serviceId: "s6", serviceName: "Guide Privé Marrakech", category: "Guide", quantity: 2, unitCostPrice: 600, unitSellingPrice: 900, discount: 0, marginPercent: 50, totalCost: 1200, totalSelling: 1800 },
        ],
        totalCost: 22200, totalSelling: 29400, margin: 7200, createdAt: "2026-03-20", sentAt: "2026-03-21",
      },
    ],
    activities: [
      { id: "da6", type: "status_change", description: "Dossier créé", date: "2026-03-18", by: "Fatima Zohra" },
      { id: "da7", type: "note", description: "Assigné à Karim - Leisure", date: "2026-03-18", by: "Nadia El Fassi" },
      { id: "da8", type: "email", description: "Présentation envoyée", date: "2026-03-21", by: "Karim Tazi" },
      { id: "da9", type: "call", description: "Client accepte la proposition!", date: "2026-03-25", by: "Karim Tazi" },
      { id: "da10", type: "status_change", description: "Statut → Confirmé", date: "2026-03-25", by: "Karim Tazi" },
    ],
    createdAt: "2026-03-18",
  },
  {
    id: "CRM-D003", reference: "GRPMS-2026-003",
    clientName: "Sophie Martin", clientEmail: "sophie.m@yahoo.fr", clientPhone: "+33 7 89 01 23 45",
    type: "Couple", department: "Leisure",
    budget: 30000, dateStart: "2026-08-01", dateEnd: "2026-08-08",
    status: "waiting_client", assignedBy: "Nadia El Fassi", assignedTo: "a1", assignedToName: "Sara Benali",
    notes: "Lune de miel Marrakech-Essaouira",
    presentations: [],
    activities: [
      { id: "da11", type: "status_change", description: "Dossier créé", date: "2026-03-30", by: "Sara Benali" },
      { id: "da12", type: "note", description: "En attente confirmation dates client", date: "2026-04-01", by: "Sara Benali" },
    ],
    createdAt: "2026-03-30",
  },
];
