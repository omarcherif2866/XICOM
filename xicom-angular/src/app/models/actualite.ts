export class Actualite {
    private id : any
    private description: string;
    private title: string;


  
    constructor(
      id: any,
      title: string,
      description: string,


    ) {
      this.id = id;
      this.description = description;
      this.title = title;

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

    
  }