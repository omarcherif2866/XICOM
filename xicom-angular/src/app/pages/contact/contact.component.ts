import { Component, OnInit } from '@angular/core';
import { Country } from '../home-page/home-page.component';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  allCountriesCodes: Country[] = [];
  contactForm: FormGroup;
  constructor(    private http: HttpClient,    private fb: FormBuilder) { 
          this.contactForm = this.fb.group({
          nom: ['', Validators.required],
          prenom: ['', Validators.required],
          email: ['', [Validators.required, Validators.email]],
          countryCode: ['+33', Validators.required], // Changé de +33 à +33 pour la Tunisie par défaut
          sujet: ['', Validators.required],
          phone: ['', Validators.required],
          message: ['', Validators.required],    
        });
  }

  ngOnInit(): void {
    this.loadCountriesCodes();
  }

  async loadCountriesCodes(): Promise<void> {
    try {
      const response: any = await this.http.get('assets/countries.json').toPromise();
      this.allCountriesCodes = response.sort((a: Country, b: Country) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error('⚠️ Erreur lors du chargement des pays:', error);
      this.allCountriesCodes = [];
    }
  }

  getSelectedCountryFlagContactForm(): string {
    const selectedDialCode = this.contactForm.get('countryCode')?.value;
    const country = this.allCountriesCodes.find(c => c.dial_code === selectedDialCode);
    return country?.flags?.png || '';
  }

}