// import { Component, OnInit } from '@angular/core';
// import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
// import { AuthService } from 'src/app/service/auth.service';
// import { CompagneService } from 'src/app/service/compagne.service';
// import Swal from 'sweetalert2';

// @Component({
//   selector: 'app-compagne',
//   templateUrl: './compagne.component.html',
//   styleUrls: ['./compagne.component.css']
// })
// export class CompagneComponent {
//   sidebarOpen = true;
// currentStep: number = 1;
// totalSteps: number = 2;
//   submitted = false;
//   successMessage = '';

//   steps = [
//     { number: 1, label: 'Infos & Stratégie' },
//     { number: 2, label: 'Exécution & Évaluation' },
//   ];

// step1Form: FormGroup = this.fb.group({
//   nomCampagne:         ['', Validators.required],
//   dateDebut:           ['', Validators.required],
//   dateFin:             ['', Validators.required],
//   budgetTotal:         ['', Validators.required],
//   objectifs:           ['', Validators.required],
//   cible:               ['', Validators.required],
//   canauxCommunication: this.fb.group(
//     {
//       Facebook:       [false],
//       Instagram: [false],
//       TIKTOK:         [false],
//       Youtube:  [false],
//     },
//     { validators: this.atLeastOneChecked() }
//   ),
//   messageCle:       ['', Validators.required],
//   concept:          ['', Validators.required],
//   brief:            ['', Validators.required],
//   analyseSituation: ['', Validators.required],
//   objectif:         ['', Validators.required],
//   dateLine:         ['', Validators.required],
// });

//   step2Form: FormGroup = this.fb.group({
//     ciblage:                         [''],
//     messageMotsCles:                 [''],
//     strategieCanauxCommunication:    [''],
//     benchmarkAnalyseConcurrentielle: [''],
//     creationContenu:                 [''],
//     testPreliminaire:                [''],
//     ajustement:                      [''],
//     postEvaluation:                  [''],
//     analysesDonnees:                 [''],
//     compilationDonnees:              [''],
//     rapportFinal:                    [''],
//   });

//   constructor(
//     private fb: FormBuilder,
//     private compagneService: CompagneService,
//     private router: Router,
//     private authService: AuthService
//   ) {}

//   // ✅ next() avec validation step1
//   next(): void {
//     if (this.currentStep === 1) {
//       this.step1Form.markAllAsTouched();
//       if (this.step1Form.invalid) return;
//     }
//     if (this.currentStep < this.totalSteps) this.currentStep++;
//   }

//   prev(): void { if (this.currentStep > 1) this.currentStep--; }
//   goTo(step: number): void {
//   if (step > 1) {
//     this.step1Form.markAllAsTouched();
//     if (this.step1Form.invalid) return;
//   }
//   this.currentStep = step;
// }

// submit(): void {
//   const userId = this.authService.getUserIdFromToken();

//   if (!userId) {
//     console.error('Utilisateur non connecté');
//     return;
//   }

//   const data = {
//     ...this.step1Form.value,
//     ...this.step2Form.value,
//   };

//   this.compagneService.create(data, userId).subscribe({
//     next: () => {
//       this.successMessage = 'Campagne créée avec succès !';
//       this.submitted = true;
//     },
//     error: (err) => console.error(err)
//   });
// }

//   logout(): void {
//     this.authService.logout();
//     Swal.fire({
//       icon: 'error',
//       title: 'Vous êtes déconnecté',
//       showConfirmButton: false,
//       timer: 1500
//     });
//     this.router.navigate(['/']);
//   }

//   toggleSidebar() {
//     this.sidebarOpen = !this.sidebarOpen;
//   }

// atLeastOneChecked(): ValidatorFn {
//   return (group: AbstractControl): ValidationErrors | null => {
//     const values = Object.values(group.value) as boolean[];
//     return values.some(v => v) ? null : { required: true };
//   };
// }

// }

import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { CompagneService } from 'src/app/service/compagne.service';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-compagne',
  templateUrl: './compagne.component.html',
  styleUrls: ['./compagne.component.css']
})
export class CompagneComponent {
  sidebarOpen = true;
  currentStep: number = 1;
  totalSteps: number = 1;
  submitted = false;
  successMessage = '';
isLoading = false;
  userId: number | null = null;

  steps = [
    { number: 1, label: 'Infos & Stratégie' },
  ];

  step1Form: FormGroup = this.fb.group({
    nomCampagne:         ['', Validators.required],
    dateDebut:           ['', Validators.required],
    dateFin:             ['', Validators.required],
    budgetTotal:         ['', Validators.required],
    objectifs:           ['', Validators.required],
    cible:               ['', Validators.required],
    canauxCommunication: this.fb.group(
      {
        Facebook:  [false],
        Instagram: [false],
        TIKTOK:    [false],
        Youtube:   [false],
      },
      { validators: this.atLeastOneChecked() }
    ),
    messageCle:       ['', Validators.required],
    concept:          ['', Validators.required],
    brief:            ['', Validators.required],
    analyseSituation: ['', Validators.required],
    objectif:         ['', Validators.required],
    dateLine:         ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private compagneService: CompagneService,
    private router: Router,
    private authService: AuthService
  ) {
    const token = this.authService.getToken();
    const decoded = (this.authService as any)['jwtHelper'].decodeToken(token);
    this.userId = decoded?.id || decoded?.userId || null;
  }

  next(): void {
    this.step1Form.markAllAsTouched();
    if (this.step1Form.invalid) return;
    if (this.currentStep < this.totalSteps) this.currentStep++;
  }

  prev(): void { if (this.currentStep > 1) this.currentStep--; }

  goTo(step: number): void {
    if (step > 1) {
      this.step1Form.markAllAsTouched();
      if (this.step1Form.invalid) return;
    }
    this.currentStep = step;
  }

  submit(): void {
    this.step1Form.markAllAsTouched();
    if (this.step1Form.invalid) return;

    const userId = this.authService.getUserIdFromToken();
    if (!userId) {
      console.error('Utilisateur non connecté');
      return;
    }

    const canaux = this.step1Form.value.canauxCommunication;
    const canauxCommunication = Object.entries(canaux)
      .filter(([, checked]) => checked)
      .map(([key]) => key);
  this.isLoading = true;

    const data = {
      ...this.step1Form.value,
      canauxCommunication,
    };

    this.compagneService.create(data, userId).subscribe({
      next: () => {
              this.isLoading = false;
        this.successMessage = 'Campagne créée avec succès !';
        this.submitted = true;
        this.generatePDF(data);
      },
      error: (err) => console.error(err)
    });
  }

  generatePDF(data: any): void {
    const doc = new jsPDF();
    const lineHeight = 10;
    let y = 20;

    const addLine = (label: string, value: string) => {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text(label, 15, y);
      doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(value || '-', 160);
      doc.text(lines, 15, y + 5);
      y += lineHeight + (lines.length - 1) * 6 + 4;
    };

    // Titre
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Rapport de Campagne', 105, y, { align: 'center' });
    y += 15;

    doc.setFontSize(11);
    addLine('Nom de la campagne :', data.nomCampagne);
    addLine('Date de début :', data.dateDebut);
    addLine('Date de fin :', data.dateFin);
    addLine('Date limite :', data.dateLine);
    addLine('Budget total :', `${data.budgetTotal} €`);
    addLine('Cible :', data.cible);
    addLine('Canaux de communication :', data.canauxCommunication.join(', '));
    addLine('Objectifs :', data.objectifs);
    addLine('Message clé :', data.messageCle);
    addLine('Concept :', data.concept);
    addLine('Brief :', data.brief);
    addLine('Analyse de la situation :', data.analyseSituation);
    addLine('Objectif stratégique :', data.objectif);

    doc.save(`campagne-${data.nomCampagne || 'export'}.pdf`);
  }

  atLeastOneChecked(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const values = Object.values(group.value) as boolean[];
      return values.some(v => v) ? null : { required: true };
    };
  }

  logout(): void {
    this.authService.logout();
    Swal.fire({
      icon: 'error',
      title: 'Vous êtes déconnecté',
      showConfirmButton: false,
      timer: 1500
    });
    this.router.navigate(['/']);
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}