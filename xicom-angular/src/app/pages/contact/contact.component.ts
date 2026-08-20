import { Component, OnInit } from '@angular/core';
import { Country } from '../home-page/home-page.component';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ContactService } from 'src/app/service/contact.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  allCountriesCodes: Country[] = [];
  contactForm: FormGroup;
  constructor(    private http: HttpClient,  private contactService: ContactService,  private fb: FormBuilder) { 
          this.contactForm = this.fb.group({
          nom: ['', Validators.required],
          // prenom: ['', Validators.required],
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


onSubmit(): void {
  console.log('form valid:', this.contactForm.valid);
  console.log('form value:', this.contactForm.value);
  
  if (this.contactForm.invalid) {
    console.log('form errors:', this.contactForm.errors);
    this.contactForm.markAllAsTouched();
    return;
  }
  
  this.contactService.sendContact(this.contactForm.value).subscribe({
    next: (res) => {
      console.log('succès:', res);
      Swal.fire({ icon: 'success', title: 'Message envoyé !', timer: 2000 });
      this.contactForm.reset();
    },
    error: (err) => {
      console.log('erreur:', err);
      Swal.fire({ icon: 'error', title: 'Erreur', text: err.message });
    }
  });
}

}