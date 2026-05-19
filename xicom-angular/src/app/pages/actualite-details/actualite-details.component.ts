import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actualite } from 'src/app/models/actualite';
import { ActualiteService } from 'src/app/service/actualite.service';

@Component({
  selector: 'app-actualite-details',
  templateUrl: './actualite-details.component.html',
  styleUrls: ['./actualite-details.component.css']
})
export class ActualiteDetailsComponent implements OnInit {
  actualite: Actualite | null = null;

  constructor(private route: ActivatedRoute, private actualiteService: ActualiteService,private router: Router) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.loadActualiteById(id);
  }

  loadActualiteById(id: any): void {
    this.actualiteService.getActualiteById(id).subscribe({
      next: (data: any) => {
        this.actualite = new Actualite(data.id, data.title, data.description, data.image);
      },
      error: (err) => console.error(err)
    });
  }



goBack(): void {
  this.router.navigate(['/actualites']);
}

}
