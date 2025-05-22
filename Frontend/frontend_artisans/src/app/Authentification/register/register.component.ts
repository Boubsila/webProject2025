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
      email: ['@ArtMarket.be', [Validators.required]], // Champ obligatoire et format email
      password: ['', Validators.required], // Champ obligatoire
      confirmPassword: ['', Validators.required], // Champ obligatoire
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
      if(this.registerForm.value.email == '@ArtMarket.be'){
        this.erreur.erreurAlert('Email invalide.');
        return;
      }

      // Ajoutez le nouvel utilisateur au tableau
      this.users.push({
      
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        role: this.registerForm.value.role,
      });

      

      this.r.Register(this.registerForm.value.email,this.registerForm.value.password,this.registerForm.value.role);
     


      // Réinitialisez le formulaire après soumission
      this.registerForm.reset();
      this.goToLogin();
    } 

   
  }

 
  goToLogin() {
    this.router.navigate(['/login']);
  }

  
}