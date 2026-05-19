

export class Abonnee {
    private id : any
    private email: string;
    private name: string;


  
    constructor(
      id: any,
      email: string,
      name: string,



    ) {
      this.id = id;
      this.email = email;
      this.name = name;

    }
  
    public get Id(): any {
      return this.id;
    }

  
    public get Email(): string {
      return this.email;
    }
  
    public set Email(email: string) {
      this.email = email;
    }
  
  
    public get Name(): string {
      return this.name;
    }
  
    public set Name(name: string) {
      this.name = name;
    }


    
  }