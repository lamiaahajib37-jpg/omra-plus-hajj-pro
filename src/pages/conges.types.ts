// ════════════════════════════════════════════════════════════════════════
// conges.types.ts — Types partagés pour le module Congés
// ════════════════════════════════════════════════════════════════════════

export interface Employee {
  id: number;
  name: string;
  dept: string;
  initials: string;
  /** Jours déjà pris sur l'année en cours (hors demandes approuvées dans l'app) */
  prisAnnuel: number;
}

export type CongeStatut = "en_attente" | "approuve" | "refuse";

export interface CongeRequest {
  id: number;
  empId: number;
  type: string;
  debut: string;        // format ISO "YYYY-MM-DD"
  fin: string;          // format ISO "YYYY-MM-DD"
  jours: number;        // jours ouvrables calculés
  statut: CongeStatut;
  motifEmp: string;     // motif fourni par l'employé (optionnel)
  motifRefus: string;   // motif du refus fourni par l'admin (obligatoire si refus)
}

export interface SoldeConge {
  total: number;
  pris: number;
  restant: number;
}