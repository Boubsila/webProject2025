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

  confirmDelete(message: string, onConfirm: () => void) {
  Swal.fire({
    title: 'Confirmer la suppression',
    text: message,
    icon: 'question', 
    showCancelButton: true,
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler',
    confirmButtonColor: '#d33', 
    cancelButtonColor: '#3085d6', 
    reverseButtons: true, 
    focusCancel: true, 
    showClass: {
      popup: 'animate__animated animate__fadeIn' 
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOut' 
    },
    customClass: {
      popup: 'swal-wide', 
    }
  }).then((result) => {
    if (result.isConfirmed) {
      onConfirm();
    }
  });
}

}
