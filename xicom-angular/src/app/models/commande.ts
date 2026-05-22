export class Commande {
  constructor(
    public id: number | null = null,
    public serviceTitle: string = '',
    public detailTitles: string[] = [],  // ← liste au lieu de string
    public user: any = null
  ) {}
}