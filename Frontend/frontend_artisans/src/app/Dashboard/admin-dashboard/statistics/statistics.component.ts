import { UserService } from './../../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-statistics',
  standalone: true,
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  constructor(private router: Router, private statistics: UserService, private productService: ProductService, private orders: OrderService) { }

  totalUsers: any = 0;
  artisan: any = 0;
  client: any = 0;
  livreur: any = 0;

  totalProducts: number = 0;
  pendingProducts: number = 0;
  approvedProducts: number = 0;

  orderStats = {
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0
  };

  ngOnInit(): void {
    this.statistics.getStatisticsAllUsers().subscribe(data => this.totalUsers = data);
    this.statistics.getStatisticsUserByRole('artisan').subscribe(data => this.artisan = data);
    this.statistics.getStatisticsUserByRole('client').subscribe(data => this.client = data);
    this.statistics.getStatisticsUserByRole('livreur').subscribe(data => this.livreur = data);

    this.updateProductStats();

    this.orders.getOrders().subscribe((data: any[]) => {
      const uniqueOrderNumbers = [...new Set(data.map(order => order.numeroCommande))];
      this.orderStats.totalOrders = uniqueOrderNumbers.length;
      this.orderStats.completedOrders = uniqueOrderNumbers.filter(num =>
        data.find(o => o.numeroCommande === num && o.statut === 'Livré')).length;
      this.orderStats.pendingOrders = uniqueOrderNumbers.length - this.orderStats.completedOrders;
    });
  }

  updateProductStats() {
    this.productService.getProducts().subscribe((data: any[]) => {
      this.totalProducts = data.length;
      this.pendingProducts = data.filter(p => p.statut === 'pending').length;
      this.approvedProducts = data.filter(p => p.statut === 'approved').length;
    });
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
