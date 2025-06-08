import { AuthService } from './../../Authentification/auth.service';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


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
  

  constructor(private router: Router, private clientUser: AuthService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.activeRoute = event.url; 
      }
      
    });

    
  }

  islogged(): boolean {
  return !!sessionStorage.getItem('jwt');
}


  isAdmin(): string {
    if (sessionStorage.getItem('jwt')) {
      const jwt = sessionStorage.getItem('jwt');
      let role = jwt ? JSON.parse(atob(jwt.split('.')[1])).role : null;
     return role ;
     
    }
    return '';
    
  }

  logout() {
    sessionStorage.removeItem('jwt');
    this.router.navigate(['/login']);

  }

  isClient()
  {
    let user = this.clientUser.getUserRoles();

    if(user =="client")
      return true 
    else
    return false
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