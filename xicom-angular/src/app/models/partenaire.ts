import { Service } from "./service";

export class Partenaire {
    private id : any
    private name: string;
    private description: string;
    private services: Service[] = [];
    private image: string;
  
    constructor(
      id: any,
      name: string,
      description: string,
      image: string,
      services: Service[] = []
    ) {
      this.id = id;
      this.name = name;
      this.description = description;
      this.image = image;
      this.services = services;
    }

  
    public get Id(): any {
      return this.id;
    }

  
  
    public get Description(): string {
      return this.description;
    }
  
    public set Description(description: string) {
      this.description = description;
    }

    
    public get Name(): string {
      return this.name;
    }
  
    public set Name(name: string) {
      this.name = name;
    }

    
  public get Services(): Service[] { return this.services; }
  public set Services(services: Service[]) { this.services = services; }


         public get Image(): string {
      return this.image;
    }
  
    public set Image(image: string) {
      this.image = image;
    } 

  }
