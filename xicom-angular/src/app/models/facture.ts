export type StatusFacture = 'EN_ATTENTE' | 'PAYEE' | 'ANNULEE';

export interface Facture {
  id: number;
  reference: string;
  fichierUrl?: string;   // ← AJOUTER
  date: string;
  montant: number;
  status: StatusFacture;
  commande?: { id: number; serviceTitle?: string; };
  user?: { id: number; email?: string; name?: string; };
}

export interface CreateFactureRequest {
  commandeId: number;
  userId: number;
  montant: number;
}