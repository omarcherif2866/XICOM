
export class RDV {
    private id : any
    private email: string;
    private name: string;
    private surname: string;
    private num: string;
    private countryCode: string;

  
    constructor(
      id: any,
      email: string,
      name: string,
      surname: string,
      num: string,
      countryCode: string

    ) {
      this.id = id;
      this.email = email;
      this.name = name;
      this.surname = surname;
      this.num = num;
      this.countryCode = countryCode;

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

        public get Surname(): string {
      return this.surname;
    }
  
    public set Surname(surname: string) {
      this.surname = surname;
    }

    public get Num(): string {
      return this.num;
    }
  
    public set Num(num: string) {
      this.num = num;
    }

    
    public get CountryCode(): string {
      return this.countryCode;
    }
  
    public set CountryCode(countryCode: string) {
      this.countryCode = countryCode;
    }


    
  }