import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../Authentification/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  userStats: any;
  pendingProducts: any;
  products: any;
  users: any;
  userRole: string;

  constructor(private authentication: AuthService) {
    this.userRole = this.authentication.getUserRoles(); //admin - livreur -client-artisan
  }

  ngOnInit(): void {
    this.userRole = this.authentication.getUserRoles();
  }

  deleteUser(arg0: any) {
    throw new Error('Method not implemented.');
  }
  orderStats: any;
  deleteProduct(arg0: any) {
    throw new Error('Method not implemented.');
  }
  approveProduct(arg0: any) {
    throw new Error('Method not implemented.');
  }


  
    
  
   

}
