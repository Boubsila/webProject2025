import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../auth.service';
// import { jwtDecode } from 'jwt-decode';
import { RegisterComponent } from '../register/register.component';
import { SuccessAlertService } from '../alerts/success-alert.service';
import { ErreurAlertService } from '../alerts/erreur-alert.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  goToRegister() {
    this.router.navigate(['/register']);
  }

  //reactive form 
  myForm = new FormGroup({
    Email: new FormControl('@petitshands.be', [Validators.required, Validators.maxLength(60)]),
    Password: new FormControl('', [Validators.required, Validators.minLength(4)])
  });

  constructor(private router: Router, private authentication: AuthService, private success: SuccessAlertService, private erreur: ErreurAlertService) { }

  onSubmit() {
    const email = this.myForm.value.Email ?? '';
    const password = this.myForm.value.Password ?? '';

    this.authentication.login(email, password).subscribe({
      next: (response) => {
        if (response.token) {
          sessionStorage.setItem("jwt", response.token);
          this.success.successAlert('Connexion réussie');
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        let message = 'Une erreur inattendue est survenue';
        console.log('erreur : ',err);
        if (err.status === 0) {
          message = 'Impossible de joindre le serveur';
        } else if (err.error?.message) {
          message = err.error.message;
        }

        this.erreur.erreurAlert(message);
      }




    });
  }

}
