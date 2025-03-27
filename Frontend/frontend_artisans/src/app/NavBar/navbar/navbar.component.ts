import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../Authentification/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  activeRoute: string = '';
  cartItemCount = 0;
  

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.activeRoute = event.url; // Met à jour l'état actif en fonction de l'URL
      }
      
    });

    
  }

  islogged(): boolean {
    if (sessionStorage.getItem('jwt')) {
      return true;
    } else {
      return false;
    }
  }

  isAdmin(): string {
    if (sessionStorage.getItem('jwt')) {
      const jwt = sessionStorage.getItem('jwt');
      let role = jwt ? JSON.parse(atob(jwt.split('.')[1])).role : null;
     return role ;
     console.log('role:', role);
    }
    return '';
    
  }

  logout() {
    sessionStorage.removeItem('jwt');
    this.router.navigate(['/login']);

  }

  goToDelivery() {
    this.router.navigate(['/delivery']);
  }
  goToLogin() {
    this.router.navigate(['/login']);
  }
  goToRegister() {
    this.router.navigate(['/register']);

  }

  goToProduct() {
    this.router.navigate(['/produits']);
  }
  goToAddProduct() {
    this.router.navigate(['/addProduct']);
  }

  goToHome() {
    this.router.navigate(['/home']);
  }
}
