import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CalendarOptions } from '@fullcalendar/core';
import { AuthService } from 'src/app/service/auth.service';
import { RDVService } from 'src/app/service/rdv.service';
import Swal from 'sweetalert2';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
@Component({
  selector: 'app-rdv',
  templateUrl: './rdv.component.html',
  styleUrls: ['./rdv.component.css']
})
export class RdvComponent implements OnInit {
  userId: number | null = null;


  sidebarOpen = true;
rdvList: any[] = [];
loading = false;
currentPage = 1;
itemsPerPage = 5;
showModal = false;
editId: any = null;
isSubmitting = false;

formData = {
  date: '',
  heure: '',
  lien_reunion: ''
};

calendarOptions: CalendarOptions = {
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'timeGridWeek',
  locale: frLocale,
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay'
  },
  slotMinTime: '08:00:00',   // ← Commence à 8h
  slotMaxTime: '21:00:00',   // ← Finit à 21h
  slotDuration: '00:30:00',
  height: 'auto',
  events: []  // ← tes événements ici
};
showCalendar = false;
constructor(private rdvService: RDVService, private authService: AuthService, private router: Router) {}

ngOnInit() {
  this.fetchRDV();
  this.fetchCalendrier();

}

fetchRDV() {
  this.loading = true;
  this.rdvService.getAllRDV().subscribe(
    (response: any[]) => {
      this.rdvList = response;
      this.loading = false;
    },
    (error) => {
      console.error('Erreur lors du chargement des RDV:', error);
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

get currentItems(): any[] {
  const indexOfLastItem = this.currentPage * this.itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - this.itemsPerPage;
  return this.rdvList.slice(indexOfFirstItem, indexOfLastItem);
}

get totalPages(): number {
  return Math.ceil(this.rdvList.length / this.itemsPerPage);
}

get pagesArray(): number[] {
  return Array(this.totalPages).fill(0).map((_, i) => i + 1);
}

handlePageChange(pageNumber: number) {
  this.currentPage = pageNumber;
}

handleEdit(rdv: any) {
  this.editId = rdv.id;
  this.formData = {
    date: rdv.date || '',
    heure: rdv.heure || '',
    lien_reunion: rdv.lien_reunion || ''
  };
  this.showModal = true;
}

handleSubmit() {
  if (!this.formData.date || !this.formData.heure || !this.formData.lien_reunion) {
    Swal.fire({
      icon: 'error',
      title: 'Veuillez remplir tous les champs',
      showConfirmButton: false,
      timer: 1500
    });
    return;
  }

  if (this.isSubmitting) return;
  this.isSubmitting = true;

  this.rdvService.updateRDV(this.editId, this.formData).subscribe(
    (response) => {
      const index = this.rdvList.findIndex(r => r.id === this.editId);
      if (index !== -1) {
        this.rdvList[index] = response;
      }
      this.showModal = false;
      this.isSubmitting = false;
      Swal.fire({
        title: 'Succès!',
        text: 'RDV modifié avec succès, un email a été envoyé au client.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      }).then(() => {
        window.location.reload();
      });
    },
    (error) => {
      this.isSubmitting = false;
      Swal.fire({
        icon: 'error',
        title: 'Erreur lors de la modification',
        showConfirmButton: false,
        timer: 1500
      });
    }
  );
}

closeModal() {
  this.showModal = false;
  this.formData = { date: '', heure: '', lien_reunion: '' };
  this.editId = null;
}

toggleSidebar() {
  this.sidebarOpen = !this.sidebarOpen;
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

fetchCalendrier() {
  this.rdvService.getCalendrier().subscribe((events: any[]) => {
    this.calendarOptions = {
      ...this.calendarOptions,
      events: events.map(e => ({
        id: e.id,
        title: e.title,
        start: e.start,
        extendedProps: {
          email: e.email,
          lien: e.lien
        },
        backgroundColor: '#6863BF',
        borderColor: '#6863BF'
      }))
    };
  });
}

openCalendar() {
  this.showCalendar = true;
}

closeCalendar(event: MouseEvent) {
  // Ferme uniquement si clic sur l'overlay (pas sur le dialog)
  if ((event.target as HTMLElement).classList.contains('calendar-dialog-overlay')) {
    this.showCalendar = false;
  }
}


}