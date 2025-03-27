import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SuccessAlertService {

  constructor() { }


  successAlert(message: string){
    Swal.fire({
      title: 'Success',
      text: message,
      icon: 'success', // Icône de succès
      confirmButtonText: 'OK',
      timer: 3000, // Temps avant de fermer la popup automatiquement
      timerProgressBar: true, // Barre de progression
      showConfirmButton: true,
      customClass: {
        popup: 'custom-alert-popup', // Classe CSS personnalisée
        confirmButton: 'btn btn-success', // Style du bouton en vert pour le succès
      },
    });
  }
}
