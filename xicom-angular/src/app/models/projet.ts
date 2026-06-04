import { User } from "./user";

export interface ProduitItem {
  type: 'text' | 'image';
  value: string;
}

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
    public couleurSecondaire: string[] = [],
    public couleurANePasUtiliser: string = '',
    public autresDonnees: string = '',
    public autresCommentaires: string = '',

    // Step 3 - Digital
    public siteWeb: string = '',
    public reseauxSociaux: string[] = [],
    public coordonnees: string = '',
    public canauxContact: string[] = [],
    public servicesReconnusOutils: string = '',
    public concurrent: string = '',

    // Step 4 - Marque & Produits (aligné sur le backend)
    public produit1: ProduitItem[] = [],
    public produit2: ProduitItem[] = [],
    public produit3: ProduitItem[] = [],
    public produit4: ProduitItem[] = [],
    public produit5: ProduitItem[] = [],

    public user: User | null = null,
  ) {}
}