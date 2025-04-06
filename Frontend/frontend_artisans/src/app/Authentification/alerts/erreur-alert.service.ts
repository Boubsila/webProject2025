import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ErreurAlertService {

  constructor() { }

  erreurAlert(message: string){
    Swal.fire({
      title: 'ERREUR !!',
      text: message,
      icon: 'error', // Icône d'erreur
      confirmButtonText: 'OK',
      timer: 2500, // Temps avant de fermer la popup automatiquement
      timerProgressBar: true, // Barre de progression
      showConfirmButton: true,
      customClass: {
        popup: 'custom-alert-popup', // Classe CSS personnalisée
        confirmButton: 'btn btn-danger', // Style du bouton en rouge pour l'erreur
      },
    });
  }
}
