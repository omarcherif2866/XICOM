import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';


@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css'],
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(14px)' }),
        animate('300ms ease', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease', style({ opacity: 0, transform: 'translateY(-8px)' }))
      ])
    ])
  ]
})
export class OffersComponent  {
  mode: 'mois' | 'tache' = 'mois';

  packsMois = [
    {
      label: 'Essentiel',
      name: 'Starter',
      price: '50€',
      period: 'HT / mois · <10k followers',
      features: [
        'Gestion comptes sociaux (moins de 10 000 followers)',
        'Community management',
        'Modération',
        'Analyse des performances et rapports'
      ],
      dark: false
    },
    {
      label: 'Croissance',
      name: 'Pro',
      price: '120€',
      period: 'HT / mois · 10k–25k followers',
      features: [
        'Gestion comptes sociaux (entre 10 000 et 25 000 followers)',
        'Community management',
        'Modération avancée',
        'Rapports détaillés'
      ],
      dark: false
    },
    {
      label: 'Sur mesure',
      name: 'Agence',
      price: '?',
      period: 'Devis personnalisé',
      features: [
        'Service entièrement personnalisé',
        'Équipe dédiée',
        'SLA & suivi prioritaire'
      ],
      dark: true
    }
  ];

  packsTache = [
    {
      label: 'Visuel unique',
      name: 'Un visuel',
      price: '15€',
      period: 'par création livrée',
      features: [
        '1 post / story / bannière',
        'Brief + retour inclus',
        'Livraison sous 48h',
        'Format prêt à publier'
      ],
      dark: false
    },
    {
      label: 'Pack tâches',
      name: 'Mini projet',
      price: '80€',
      period: 'pack 6 créations',
      features: [
        '6 visuels au choix',
        'Suivi de brief',
        '1 révision par visuel',
        'Valable 30 jours'
      ],
      dark: false
    },
    {
      label: 'Projet complet',
      name: 'Full projet',
      price: '?',
      period: 'Devis selon périmètre',
      features: [
        'Stratégie + production',
        'Suivi et itérations',
        'Reporting inclus'
      ],
      dark: true
    }
  ];

  get currentPacks() {
    return this.mode === 'mois' ? this.packsMois : this.packsTache;
  }
}
