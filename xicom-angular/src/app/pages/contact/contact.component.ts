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
          countryCode: ['+216', Validators.required], // Changé de +33 à +216 pour la Tunisie par défaut
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
      // Utiliser un proxy CORS pour le développement
      // En production, vous devrez faire l'appel depuis votre backend
      const proxyUrl = 'https://corsproxy.io/?';
      const apiUrl = 'https://apicountries.com/countries';
      
      const response: any = await this.http.get(proxyUrl + encodeURIComponent(apiUrl)).toPromise();
      
      if (response && response.length > 0) {
        // Extraire uniquement les données nécessaires : name, alpha3Code, callingCodes, flags
        this.allCountriesCodes = response
          .filter((country: any) => country.callingCodes && country.callingCodes.length > 0)
          .map((country: any) => ({
            name: country.name,
            alpha3Code: country.alpha3Code,
            dial_code: '+' + country.callingCodes[0],
            callingCodes: country.callingCodes,
            flags: country.flags
          }))
          .sort((a: Country, b: Country) => a.name.localeCompare(b.name));
        
        console.log('✅ Pays chargés avec succès:', this.allCountriesCodes.length);
        console.log('📍 Exemple - Premier pays:', this.allCountriesCodes[0]);
        console.log('📍 Exemple - Tunisie:', this.allCountriesCodes.find(c => c.alpha3Code === 'TUN'));
      }
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
