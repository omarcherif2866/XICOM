import { Partenaire } from "./partenaire";

export interface Details {
  title: string;
  description: string;
  icon: any;
  
}

export interface ServiceSection {
  headline: string;
  subtitle: string;
  details: Details[];
}

export interface PriceSection {
  title: string;
  subtitle: string;
  price: any;
  details: Details[];
}



export class Service {
  private id: any;
  private title: string | null;
  private subtitle: string | null;
  private image: string | null;
  private icon: string | null;
  private sections: ServiceSection[];
  private partenaires: Partenaire[] = [];
  private priceSections: PriceSection[];


  constructor(data: any = {}) {
    this.id = data.id ?? null;
    this.title = data.Title ;
    this.subtitle = data.subTitle ;
    this.image = data.image ?? null;
    this.icon = data.icon ?? null;
    this.sections = Array.isArray(data.sections) ? data.sections : [];
    this.partenaires = Array.isArray(data.partenaires) ? data.partenaires : [];
    this.priceSections = Array.isArray(data.priceSections) ? data.priceSections : [];

  }

  // --- GETTERS & SETTERS --- //

  public get Id(): any {
    return this.id;
  }
  public set Id(value: any) {
    this.id = value;
  }

  public get Title(): string | null {
    return this.title;
  }
  public set Title(value: string | null) {
    this.title = value;
  }

    public get Subtitle(): string | null {
    return this.subtitle;
  }
  public set Subtitle(value: string | null) {
    this.subtitle = value;
  }

  public get Image(): string | null {
    return this.image;
  }
  public set Image(value: string | null) {
    this.image = value;
  }

  public get Sections(): ServiceSection[] {
    return this.sections;
  }
  public set Sections(value: ServiceSection[]) {
    this.sections = value;
  }

    public get PriceSection(): PriceSection[] {
    return this.priceSections;
  }
  public set PriceSection(value: PriceSection[]) {
    this.priceSections = value;
  }
  
      public get Icon(): string | null {
      return this.icon;
    }
    public set Icon(value: string | null) {
      this.icon = value;
    }

    public get Partenaires(): Partenaire[] {
      return this.partenaires;
    }

    public set Partenaires(partenaires: Partenaire[]) {
      this.partenaires = partenaires;
    }

}
