export class Actualite {
    private id : any
    private description: string;
    private title: string;
    private image: string;


  
    constructor(
      id: any,
      title: string,
      description: string,
      image: string,


    ) {
      this.id = id;
      this.description = description;
      this.title = title;
      this.image = image;

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
  
    public get Title(): string {
      return this.title;
    }
  
    public set Title(title: string) {
      this.title = title;
    }

    public get Image(): string {
      return this.image;
    }
  
    public set Image(image: string) {
      this.image = image;
    } 

    
  }