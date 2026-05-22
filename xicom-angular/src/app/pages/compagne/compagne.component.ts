import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { CompagneService } from 'src/app/service/compagne.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-compagne',
  templateUrl: './compagne.component.html',
  styleUrls: ['./compagne.component.css']
})
export class CompagneComponent {
  sidebarOpen = true;
currentStep: number = 1;
totalSteps: number = 2;
  submitted = false;
  successMessage = '';

  steps = [
    { number: 1, label: 'Infos & Stratégie' },
    { number: 2, label: 'Exécution & Évaluation' },
  ];

  step1Form: FormGroup = this.fb.group({
    nomCampagne:         ['', Validators.required],
    dateDebut:           ['', Validators.required],
    dateFin:             ['', Validators.required],
    budgetTotal:         ['', Validators.required],
    objectifs:           ['', Validators.required],
    cible:               ['', Validators.required],
    canauxCommunication: ['', Validators.required],
    messageCle:          ['', Validators.required],
    concept:             ['', Validators.required],
    brief:               ['', Validators.required],
    analyseSituation:    ['', Validators.required],
    objectif:            ['', Validators.required],
    dateLine:            ['', Validators.required],
  });

  step2Form: FormGroup = this.fb.group({
    ciblage:                         [''],
    messageMotsCles:                 [''],
    strategieCanauxCommunication:    [''],
    benchmarkAnalyseConcurrentielle: [''],
    creationContenu:                 [''],
    testPreliminaire:                [''],
    ajustement:                      [''],
    postEvaluation:                  [''],
    analysesDonnees:                 [''],
    compilationDonnees:              [''],
    rapportFinal:                    [''],
  });

  constructor(
    private fb: FormBuilder,
    private compagneService: CompagneService,
    private router: Router,
    private authService: AuthService
  ) {}

  // ✅ next() avec validation step1
  next(): void {
    if (this.currentStep === 1) {
      this.step1Form.markAllAsTouched();
      if (this.step1Form.invalid) return;
    }
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
  const userId = this.authService.getUserIdFromToken();

  if (!userId) {
    console.error('Utilisateur non connecté');
    return;
  }

  const data = {
    ...this.step1Form.value,
    ...this.step2Form.value,
  };

  this.compagneService.create(data, userId).subscribe({
    next: () => {
      this.successMessage = 'Campagne créée avec succès !';
      this.submitted = true;
    },
    error: (err) => console.error(err)
  });
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