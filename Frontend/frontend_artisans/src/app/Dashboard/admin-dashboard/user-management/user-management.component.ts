import { ErreurAlertService } from './../../../Authentification/alerts/erreur-alert.service';
import { SuccessAlertService } from './../../../Authentification/alerts/success-alert.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  searchText: string = '';

  users: any[] = [];

  constructor(private router: Router,private user : UserService,private SuccessAlertService:SuccessAlertService,private ErreurAlertService:ErreurAlertService) {}

  ngOnInit(): void {
    this.user.getUsers().subscribe(
      (users: any[]) => {
        this.users = users.map(user => {
          return {
            id: user.id,
            email: user.username, // Assurez-vous que c'est le bon champ pour l'email
            role: user.role,
            status: user.statut ? 'approved' : 'pending' // Afficher 'pending' si statut est false sinon afficher 'approved'
          };
        });
      },);

   }

  get filteredUsers(): any[] {
    return this.users.filter(user =>
      user.id.toString().includes(this.searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(this.searchText.toLowerCase()) ||
      user.role.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  deleteUser(userId: number): void {
    this.user.deleteUSer(userId).subscribe(
      (response: any) => {
        // Mettre à jour la liste des utilisateurs ici
        this.user.getUsers().subscribe((data: any[]) => {
          this.users = data.map(user => {
            return {
              id: user.id,
              email: user.username,
              role: user.role,
              status: user.statut ? 'approved' : 'pending'
            };
          });
        });
        this.SuccessAlertService.successAlert('Utilisateur supprimé');
      },
      (error) => {
        this.ErreurAlertService.erreurAlert('Erreur lors de la suppression de l\'utilisateur');
      }
    );
  }

  validateUser(userId: number): void {
    this.user.changeStatus(userId).subscribe(
      (response: any) => {
        // Récupérer les utilisateurs pour trouver l'email correspondant à l'userId
        this.user.getUsers().subscribe(
          (users: any[]) => {
            this.users = users.map(user => {
              return {
                id: user.id,
                email: user.username,
                role: user.role,
                status: user.statut ? 'approved' : 'pending'
              };
            });
  
            // Trouver l'utilisateur validé par son userId
            const validatedUser = this.users.find(user => user.id === userId);
  
            if (validatedUser) // Afficher l'alerte avec l'email de l'utilisateur
              this.SuccessAlertService.successAlert('Utilisateur validé : ' + validatedUser.email);
           
          },
          
        );
      },
      (error) => {

        this.ErreurAlertService.erreurAlert('Erreur lors de la validation de l\'utilisateur');
        
      }
    );
  }

  rejectUser(userId: number): void {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.status = 'rejected';
      this.ErreurAlertService.erreurAlert('Utilisateur rejeté : ' + user.email);
    }
  }

  // Méthode pour naviguer vers le tableau de bord
  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

 
  
}