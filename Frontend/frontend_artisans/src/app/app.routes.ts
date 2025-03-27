import { CarouselComponent } from './NavBar/carousel/carousel.component';
import { ProduitsComponent } from './Artisans/produits/produits.component';
import { RegisterComponent } from './Authentification/register/register.component';
import { Routes } from '@angular/router';
import { LoginComponent } from './Authentification/login/login.component';
import { NavbarComponent } from './NavBar/navbar/navbar.component';
import { AddProductComponent } from './Artisans/add-product/add-product.component';
import { DeliveryComponent } from './Patner/delivery/delivery.component';
import { DashboardComponent } from './Dashboard/dashboard/dashboard.component';
import { AdminDashboardComponent } from './Dashboard/admin-dashboard/admin-dashboard.component';
import { StatisticsComponent } from './Dashboard/admin-dashboard/statistics/statistics.component';
import { UserManagementComponent } from './Dashboard/admin-dashboard/user-management/user-management.component';
import { ModerationComponent } from './Dashboard/admin-dashboard/moderation/moderation.component';
import { authGuard } from './Authentification/auth.guard';
import { adminGuard } from './Authentification/admin.guard';
import { ProduitComponent } from './Dashboard/artisan-dashboard/produit/produit.component';
import { CommandeComponent } from './Dashboard/artisan-dashboard/commande/commande.component';
import { AvisComponent } from './Dashboard/artisan-dashboard/avis/avis.component';
import { CommandesComponent } from './Dashboard/livreur-dashboard/commandes/commandes.component';
import { StatutComponent } from './Dashboard/livreur-dashboard/statut/statut.component';
import { CommandeClientComponent } from './Dashboard/client-dashboard/commande-client/commande-client.component';
import { PanierComponent } from './Dashboard/client-dashboard/panier/panier.component';
import { AvisClientComponent } from './Dashboard/client-dashboard/avis-client/avis-client.component';
import { clientGuard } from './Authentification/client.guard';

export const routes: Routes = [

    { path: '', component: CarouselComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'produits', component: ProduitsComponent , canActivate: [clientGuard]},
    { path: 'addProduct', component: AddProductComponent },
    { path: 'delivery', component: DeliveryComponent },
    { path: 'home', component: CarouselComponent },
    { path: 'admindashboard', component: AdminDashboardComponent },
    { path: 'dashboard', component:DashboardComponent,canActivate: [authGuard] },
    { path: 'user-management', component:UserManagementComponent },
    { path: 'moderation', component: ModerationComponent },
    { path: 'statistics', component: StatisticsComponent },
    {path: 'artisan-dashboard/produit', component: ProduitComponent, canActivate: [authGuard]},
    {path: 'artisan-dashboard/commande', component: CommandeComponent, canActivate: [authGuard]},
    {path: 'artisan-dashboard/avis', component: AvisComponent, canActivate: [authGuard]},
    {path:'livreur-dashboard/commandes', component: CommandesComponent, canActivate: [authGuard]},
    {path:'livreur-dashboard/statut', component: StatutComponent, canActivate: [authGuard]},
    {path:'client-dashboard/commande-client', component: CommandeClientComponent, canActivate: [authGuard]},
    {path:'client-dashboard/panier', component: PanierComponent, canActivate: [authGuard]},
    {path:'client-dashboard/avis-client', component:AvisClientComponent , canActivate: [authGuard]}


];
