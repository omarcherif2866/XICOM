import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Actualite } from 'src/app/models/actualite';
import { Role, User } from 'src/app/models/user';
import { ActualiteService } from 'src/app/service/actualite.service';
import { AuthService } from 'src/app/service/auth.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-actualite',
  templateUrl: './actualite.component.html',
  styleUrls: ['./actualite.component.css']
})
export class ActualiteComponent implements OnInit {
  sidebarOpen = true;
  actualites: Actualite[] = [];
  loading = false;
  currentPage = 1;
  itemsPerPage = 5;
  showModal = false;
  modalMode: 'add' | 'edit' = 'add';
  formData = {
    id: null,
    title: '',
    description: '',
  };
  
  editId: any = null;
  selectedImage: File | null = null;

      userId: number | null = null;
  userRole: string = '';
  isAdminOrSuper = false;
  isSimpleUser = false;
  constructor(private actualiteService: ActualiteService, private authService: AuthService,private router:Router ,private sanitizer: DomSanitizer) {
            const token = this.authService.getToken();
    const decoded = (this.authService as any)['jwtHelper'].decodeToken(token);
    this.userId = decoded?.id || decoded?.userId || null;
    this.userRole = decoded?.role || decoded?.roles?.[0] || '';
    this.isAdminOrSuper = ['ADMIN', 'SUPERADMIN', 'ROLE_ADMIN', 'ROLE_SUPERADMIN']
      .includes(this.userRole.toUpperCase());
    this.isSimpleUser = ['SIMPLEU'].includes(this.userRole.toUpperCase());
    const today = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(today.getDate() - 7);
  }

  ngOnInit() {
    this.fetchActualites();
  }

  // Récupérer les actualités depuis le backend
  fetchActualites() {
    this.loading = true;
    this.actualiteService.getActualite().subscribe(
      (response: any[]) => {
        // Transformer chaque JSON en instance de Formateur
        this.actualites = response.map(f => new Actualite(
          f.id,
          f.title,
          f.description,
          f.image
        ));
        this.actualites = this.actualites; // si pagination ou filtrage
        this.loading = false;
        // console.log('Données reçues: ', this.actualites);
      },
      (error) => {
        console.error('Erreur lors du chargement des actualites:', error);
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Erreur lors du chargement des données',
          showConfirmButton: false,
          timer: 1500
        });
      }
    );
  }

  // Pagination
  get currentItems(): Actualite[] {
    const indexOfLastItem = this.currentPage * this.itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - this.itemsPerPage;
    return this.actualites.slice(indexOfFirstItem, indexOfLastItem);
  }

  get totalPages(): number {
    return Math.ceil(this.actualites.length / this.itemsPerPage);
  }

  get pagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((_, i) => i + 1);
  }

  handlePageChange(pageNumber: number) {
    this.currentPage = pageNumber;
  }

  // Ajouter une actualité
  handleAdd() {
    this.modalMode = 'add';
    this.formData = {
      id: null,
      title: '',
      description: ''
    };
    this.showModal = true;
  }

  // Éditer une actualité
  handleEdit(actualite: Actualite) {
    this.modalMode = 'edit';
    this.formData = {
      id: actualite.Id,
      title: actualite.Title,
      description: actualite.Description
    };
    this.editId = actualite.Id;
    this.showModal = true;
  }

  // Supprimer une actualité
  handleDelete(id: any) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette actualité ?')) {
      this.actualiteService.deleteActualite(id).subscribe(
        () => {
          this.actualites = this.actualites.filter(item => item.Id !== id);
          Swal.fire({
            title: 'Success!',
            text: 'Actualité supprimée avec succès',
            icon: 'success',
            confirmButtonText: 'OK',
            timer: 1500,
          }).then(() => {
            window.location.reload();
          });         
        },
        (error) => {
          Swal.fire({
          icon: 'error',
          title: 'Erreur lors de la suppression',
          showConfirmButton: false,
          timer: 1500
        });          
        }
      );
    }
  }

  // Soumettre le formulaire
handleSubmit() {
  // Vérification des champs obligatoires
  if (
    !this.formData.title || !this.formData.description ) {
    alert('Veuillez remplir tous les champs obligatoires');
    return;
  }

  // Créer FormData pour envoyer les données + l'image
  const formData = new FormData();
  formData.append('title', this.formData.title);
  formData.append('description', this.formData.description);

  if (this.selectedImage) {
    formData.append('image', this.selectedImage, this.selectedImage.name);
  }

  if (this.modalMode === 'add') {
    this.actualiteService.addActualite(formData).subscribe(
      (response) => {
        const newActualite = new Actualite(
            response.Id,
            response.Title,
            response.Description,
            response.Image
        );

        this.actualites.push(newActualite);
        this.showModal = false;
        this.selectedImage = null; // Réinitialiser

        Swal.fire({
          title: 'Success!',
          text: 'Actualite ajouté avec succès',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          window.location.reload();
        });
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur lors de l\'ajout',
          text: error,
          showConfirmButton: false,
          timer: 1500
        });
      }
    );
  } else {
    this.actualiteService.putActualite(this.editId, formData).subscribe(
      (response) => {
        const index = this.actualites.findIndex(item => item.Id === this.editId);
        if (index !== -1) {
          this.actualites[index] = new Actualite(
            response.Id,
            response.Title,
            response.Description,
            response.Image

          );
        }
        this.showModal = false;
        this.selectedImage = null; // Réinitialiser

        Swal.fire({
          title: 'Success!',
          text: 'Actualite modifié avec succès',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          window.location.reload();
        });
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur lors de la modification',
          text: error,
          showConfirmButton: false,
          timer: 1500
        });
      }
    );
  }
}

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

    logout(): void {
        this.authService.logout();
    
        Swal.fire({
          icon: 'error',
          title: 'Vous êtes deconnecté',
          showConfirmButton: false,
          timer: 1500
        }); 
        

        this.router.navigate(['/']);
      }

onImageSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Veuillez sélectionner une image valide',
        timer: 1500,
        showConfirmButton: false
      });
      return;
    }
    
    // Vérifier la taille (par exemple, max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'L\'image ne doit pas dépasser 5MB',
        timer: 1500,
        showConfirmButton: false
      });
      return;
    }
    
    this.selectedImage = file;
  }
}

sanitizeImage(image: string | null): SafeUrl | string {
  if (!image) {
    return 'assets/images/placeholder.png';
  }

  if (image.startsWith('data:image')) {
    return this.sanitizer.bypassSecurityTrustUrl(image);
  }

  if (image.includes('res.cloudinary.com')) {
    // Supprimer les doublons d'URL
    if (image.split('res.cloudinary.com').length > 2) {
      const parts = image.split('/upload/');
      image = `https://res.cloudinary.com/dnrnrxm9q/image/upload/${parts[parts.length - 1]}`;
    }

    // Supprimer les transformations existantes si présentes
    image = image.replace(/\/upload\/[^/]*\//, '/upload/');

    // ✅ Transformations agressives
    image = image.replace(
      '/upload/',
      '/upload/f_webp,q_auto:low,w_400,c_limit/'
    );

    return image;
  }

  return image;
}


}