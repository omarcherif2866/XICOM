export class Commande {
  constructor(
    public id: number | null = null,
    public serviceTitle: string = '',
    public detailTitles: string[] = [],
    public objectifs: string = '',
    public analyseSituation: string = '',
    public messageCle: string = '',
    public brief: string = '',
    public devis: string = '',
    public delaiSouhaite: string = '',
    public status: 'EN_COURS' | 'LIVREE' = 'EN_COURS',  // 👈 majuscules comme le Java
    public user: any = null
  ) {}
}