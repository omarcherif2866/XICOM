import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Actualite } from 'src/app/models/actualite';
import { ActualiteService } from 'src/app/service/actualite.service';

@Component({
  selector: 'app-all-actualite',
  templateUrl: './all-actualite.component.html',
  styleUrls: ['./all-actualite.component.css']
})
export class AllActualiteComponent implements OnInit {
  actualites: Actualite[] = [];
  page: number = 1;
  itemsParPage: number = 6;

  constructor(
    private actualiteService: ActualiteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadActualites(); // ← manquait !
  }

  loadActualites(): void {
    this.actualiteService.getActualite().subscribe({
      next: (data) => this.actualites = data,
      error: (err) => console.error(err)
    });
  }

  get actualitesPaginees(): Actualite[] {
    const debut = (this.page - 1) * this.itemsParPage;
    return this.actualites.slice(debut, debut + this.itemsParPage);
  }

  get totalPages(): number {
    return Math.ceil(this.actualites.length / this.itemsParPage);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToDetail(id: number): void {
    this.router.navigate(['/actualiteDetails', id]);
  }
}