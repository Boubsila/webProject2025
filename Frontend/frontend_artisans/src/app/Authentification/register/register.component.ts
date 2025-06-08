import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

import { AuthService } from '../auth.service';
import { SuccessAlertService } from '../alerts/success-alert.service';
import { ErreurAlertService } from '../alerts/erreur-alert.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule], // Utilisez ReactiveFormsModule au lieu de FormsModule
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  // Déclarez un FormGroup pour gérer le formulaire
  registerForm: FormGroup;

  // Tableau pour stocker les utilisateurs
  users: { email: string; password: string; role: string }[] = [];

  constructor(private router: Router, private fb: FormBuilder,private r : AuthService,private success:SuccessAlertService,private erreur:ErreurAlertService,private register:AuthService) { 
    
    
    // Initialisez le formulaire réactif
    this.registerForm = this.fb.group({
      email: ['@petitshands.be', [Validators.required]], // Champ obligatoire et format email
      password: ['', [Validators.required,Validators.minLength(4)]], // Champ obligatoire
      confirmPassword: ['', [Validators.required,Validators.minLength(4)]], // Champ obligatoire
      role: ['', Validators.required], // Champ obligatoire
    });
  }

  // Méthode pour gérer la soumission du formulaire
  OnSubmit() {
    if (this.registerForm.valid) {
      // Vérifiez si les mots de passe correspondent
      if (this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
        this.erreur.erreurAlert('Les mots de passe ne correspondent pas.');
        return;
      }
      if(this.registerForm.value.email == '@petitshands.be'){
        this.erreur.erreurAlert('Email invalide.');
        return;
      }

      // Ajoutez le nouvel utilisateur au tableau
      this.users.push({
      
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        role: this.registerForm.value.role,
      });

      

this.r.Register(this.registerForm.value.email, this.registerForm.value.password, this.registerForm.value.role)
  .subscribe({
    next: () => {
      this.success.successAlert('Utilisateur enregistré avec succès');
      this.registerForm.reset();
      this.goToLogin();
    },
    error: (error) => {
      let errorMessage = '';

      if (error.status === 0) {
        errorMessage = 'Connexion au serveur impossible. Vérifiez votre connexion ou le serveur.';
      } else if (error.status === 409) {
        errorMessage = 'Un utilisateur avec ces identifiants existe déjà.';
      } else if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else {
        errorMessage = 'Une erreur inattendue est survenue.';
      }

      this.erreur.erreurAlert(errorMessage);
    }
  });

     


      // Réinitialisez le formulaire après soumission
      this.registerForm.reset();
      this.goToLogin();
    } 

   
  }

 
  goToLogin() {
    this.router.navigate(['/login']);
  }

  
}