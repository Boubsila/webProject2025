import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../services/order.service';
import { AuthService } from './../../../Authentification/auth.service';

@Component({
  selector: 'app-statut',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './statut.component.html',
  styleUrls: ['./statut.component.css']
})
export class StatutComponent implements OnInit {
  orders: any[] = [];
  filteredOrders: any[] = [];
  searchTerm: string = '';
  currentLivreurName: string = '';
  isLoading: boolean = true;
  selectedOrder: any = null;

  // Statuts dans l'ordre du workflow
  statusOptions = [
    { value: 'Prêt au ramassage', label: 'Prêt au ramassage', color: 'warning' },
    { value: 'Prélevé', label: 'Prélevé', color: 'primary' },
    { value: 'En cours de livraison', label: 'En cours de livraison', color: 'info' },
    { value: 'Livré', label: 'Livré', color: 'success' }
  ];

  constructor(
    private router: Router,
    private orderService: OrderService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadCurrentLivreur();
  }

  loadCurrentLivreur(): void {
    this.currentLivreurName = this.authService.getUserName();
    if (this.currentLivreurName) {
      this.loadOrders();
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadOrders(): void {
    this.isLoading = true;
    this.orderService.getOrders().subscribe({
      next: (data: any[]) => {
        // Filtrer les commandes pour le livreur connecté avec statut valide
        this.orders = data.filter(order => 
          order.livreurName === this.currentLivreurName && 
          this.isValidStatus(order.statut) &&
          order.isOrderd === true
        );
        this.filteredOrders = [...this.orders];
        this.isLoading = false;
      },
      error: (error:any) => {
       
        this.isLoading = false;
      }
    });
  }

  // Vérifie si le statut fait partie des statuts gérés
  isValidStatus(status: string): boolean {
    return this.statusOptions.some(option => option.value === status);
  }

  updateOrderStatus(): void {
    if (!this.selectedOrder || !this.selectedOrder.numeroCommande || !this.selectedOrder.artisanName || !this.selectedOrder.statut) {
      
      return;
    }

    this.isLoading = true;
    this.orderService.updateOrderStatusMulti(
      this.selectedOrder.numeroCommande, 
      this.selectedOrder.artisanName, 
      this.selectedOrder.statut
    ).subscribe({
      next: () => {
        this.loadOrders(); 
        this.closeModal();
      },
      error: (error:any) => {
       
        this.isLoading = false;
      }
    });
  }

  openModal(order: any): void {
    this.selectedOrder = { ...order };
    const modal = document.getElementById('updateStatusModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      document.body.classList.add('modal-open');
    }
  }

  closeModal(): void {
    const modal = document.getElementById('updateStatusModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
    }
    this.selectedOrder = null;
  }

  filterOrders(): void {
    if (!this.searchTerm) {
      this.filteredOrders = [...this.orders];
    } else {
      this.filteredOrders = this.orders.filter(order => 
        order.numeroCommande.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        order.artisanName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        order.statut.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        order.produitName.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  getStatusLabel(statusValue: string): string {
    const status = this.statusOptions.find(s => s.value === statusValue);
    return status ? status.label : statusValue;
  }

  getStatusColor(statusValue: string): string {
    const status = this.statusOptions.find(s => s.value === statusValue);
    return status ? status.color : 'secondary';
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}