import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompagneService } from 'src/app/service/compagne.service';

@Component({
  selector: 'app-compagne',
  templateUrl: './compagne.component.html',
  styleUrls: ['./compagne.component.css']
})
export class CompagneComponent  {

currentStep = 1;
  totalSteps = 2;
  submitted = false;
  successMessage = '';

  steps = [
    { number: 1, label: 'Infos & Stratégie' },
    { number: 2, label: 'Exécution & Évaluation' },
  ];

  // Step 1 — tout ce qui était demandé
  step1Form: FormGroup = this.fb.group({
    nomCampagne:         ['', Validators.required],
    dateDebut:           ['', Validators.required],
    dateFin:             ['', Validators.required],
    budgetTotal:         ['', Validators.required],
    objectifs:           [''],
    cible:               [''],
    canauxCommunication: [''],
    messageCle:          [''],
    concept:             [''],
    brief:               [''],
    analyseSituation:    [''],
    objectif:            [''],
    dateLine:            [''],
  });

  // Step 2 — le reste
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

  constructor(private fb: FormBuilder, private compagneService: CompagneService) {}

  next(): void { if (this.currentStep < this.totalSteps) this.currentStep++; }
  prev(): void { if (this.currentStep > 1) this.currentStep--; }
  goTo(step: number): void { this.currentStep = step; }

  submit(): void {
    const data = {
      ...this.step1Form.value,
      ...this.step2Form.value,
    };
    this.compagneService.create(data).subscribe({
      next: () => {
        this.successMessage = 'Campagne créée avec succès !';
        this.submitted = true;
      },
      error: (err) => console.error(err)
    });
  }
}