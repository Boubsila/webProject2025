import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../Authentification/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  

  userRole: string;
  userName: string;

  constructor(private authentication: AuthService) {
    this.userRole = this.authentication.getUserRoles(); //admin - livreur -client-artisan
    this.userName = this.authentication.getUserName();
  }

  ngOnInit() {
    this.userRole = this.authentication.getUserRoles();
    this.userName = this.authentication.getUserName();
  }
  

}
