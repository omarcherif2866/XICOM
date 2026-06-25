export class Commande {
  constructor(
    public id: number | null = null,
    public serviceTitle: string = '',
    public detailTitles: string[] = [],
    public packTitle: string = '',
    public packPrice: string = '',

    public status: 'EN_COURS' | 'LIVREE' = 'EN_COURS',  // 👈 majuscules comme le Java
    public user: any = null
  ) {}
}