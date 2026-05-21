export interface Compagne {
  id?: number;

  // Step 1 - Infos générales
  nomCampagne: string;
  dateDebut: string;
  dateFin: string;
  budgetTotal: number;
  objectifs: string;
  cible: string;
  canauxCommunication: string;
  messageCle: string;
  concept: string;
  brief: string;

  // Step 2 - Stratégie
  analyseSituation: string;
  objectif: string;
  dateLine: string;
  ciblage: string;
  messageMotsCles: string;
  strategieCanauxCommunication: string;
  benchmarkAnalyseConcurrentielle: string;

  // Step 3 - Exécution
  creationContenu: string;
  testPreliminaire: string;
  ajustement: string;

  // Step 4 - Évaluation
  postEvaluation: string;
  analysesDonnees: string;
  compilationDonnees: string;
  rapportFinal: string;
}