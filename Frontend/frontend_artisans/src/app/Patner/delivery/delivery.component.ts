
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-delivery',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './delivery.component.html',
  styleUrl: './delivery.component.css'
})
export class DeliveryComponent implements OnInit {

  selectedArtisan: any;
  message: any;
  pickupDate: any;
  selectedStatus: any;
  orderId: any;
  updateStatus: { [orderId: number]: string } = {};
  orders: any[] = []; // Initialiser le tableau des commandes
  constructor() { }

  ngOnInit(): void {
   
  }

  

  schedulePickup(pickupDate: any) {
    this.OrderUpdateAlert(pickupDate);
  }

  updateDeliveryStatus(oId: any) {
    const orderToUpdate = this.orders.find(order => order.orderId === Number(oId));
    if (orderToUpdate) {
      orderToUpdate.statut = this.selectedStatus;
      this.updateStatus [orderToUpdate.orderId] = new Date().toLocaleString();
      this.OrderUpdateAlert(oId);
    } else {
      this.OrderNotFoudAlert(oId);
    }
    this.orderId = '';
    this.selectedStatus = '';
  }

  OrderUpdateAlert(oId: any) {
    if (this.pickupDate != undefined)
      this.message = `Date de ramassage  : ${this.pickupDate} , le ramassage est planifiée avec succès`;
    if (this.selectedStatus != undefined && oId != undefined)
      this.message = `Statut de la commande ${oId} mis à jour : ${this.selectedStatus}`;
    if (this.pickupDate == undefined && this.selectedStatus == undefined && oId != undefined)
      this.message = `***`;

    if (oId != undefined || this.pickupDate != undefined || this.selectedStatus != undefined) {
      Swal.fire({
        title: 'SUCCESS!! ',
        text: `${this.message}`,
        icon: 'success',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'custom-alert-popup',
          confirmButton: 'btn btn-primary',
        },
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: true,
        showClass: {
          popup: 'animate__animated animate__fadeInDown',
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp',
        },
      });
    } else
      this.OrderNotFoudAlert(oId);


  }

  OrderNotFoudAlert(oId: any) {
    if (oId == undefined)
      oId = ' "vide"';
    Swal.fire({
      title: 'ERREUR !!',
      text: `Aucune commande trouvée avec l'identifiant ${oId}`,
      icon: 'error',
      confirmButtonText: 'OK',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: true,
      customClass: {
        popup: 'custom-alert-popup',
        confirmButton: 'btn btn-danger',
      },
    });
  }

  artisans = [
    {
      id: 1,
      name: 'Mamadou'
    },
    {
      id: 2,
      name: 'Moussa'
    }
  ];


}