import { User } from "./user";

export class Client {
  constructor(
    public id: number | null = null,

    // Step 1 - Fiche client
    public client: string = '',
    public secteur: string = '',
    public categorie: string = '',
    public responsableNomPrenom: string = '',
    public responsableAdresse: string = '',
    public responsableTelephone: string = '',
    public responsableEmail: string = '',

    // Step 2 - Graphique & Identités
    public logo: string[] = [],
    public avatars: string[] = [],
    public charteGraphique: string[] = [],
    public policesCaracteres: string[] = [],
    public imagesIllustrations: string[] = [],
    public couleurSecondaire: string = '',
    public couleurANePasUtiliser: string = '',
    public autresDonnees: string = '',
    public autresCommentaires: string = '',

    // Step 3 - Digital
    public siteWeb: string = '',
    public reseauxSociaux: string = '',
    public coordonnees: string = '',
    public canauxContact: string = '',
    public servicesReconnusOutils: string = '',
    public concurrent: string = '',

    // Step 4 - Marque & Produits
    public lesProduits: string[] = [],
    public lesAvis: string[] = [],
    public lesPublications: string[] = [],
    public programmeFidelite: string = '',
    public hobbiesMarque: string = '',
    public consommation: string = '',
    public achatsRealises: string = '',
    public frequenceAchat: string = '',
    public moyenPaiement: string = '',
    public pagesConsultees: string = '',
    public produitsPlusVisites: string = '',

    // Relation OneToOne
    public user: User | null = null,
  ) {}
}